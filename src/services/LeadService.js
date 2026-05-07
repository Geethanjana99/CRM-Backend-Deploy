const Lead = require('../models/Lead');
const Note = require('../models/Note');

class LeadService {
  // Create a new lead
  async createLead(leadData, userId) {
    const lead = new Lead({
      ...leadData,
      createdBy: userId,
    });

    await lead.save();
    await lead.populate('assignedSalesperson', 'name email');
    await lead.populate('createdBy', 'name email');

    return lead;
  }

  // Get all leads with filtering and pagination
  async getAllLeads(filters = {}, page = 1, limit = 10) {
    const { status, leadSource, assignedSalesperson, search } = filters;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (leadSource) {
      query.leadSource = leadSource;
    }

    if (assignedSalesperson) {
      query.assignedSalesperson = assignedSalesperson;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Lead.countDocuments(query);

    // Get leads
    const leads = await Lead.find(query)
      .populate('assignedSalesperson', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      leads,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get a single lead by ID
  async getLeadById(leadId) {
    const lead = await Lead.findById(leadId)
      .populate('assignedSalesperson', 'name email')
      .populate('createdBy', 'name email');

    if (!lead) {
      throw new Error('Lead not found');
    }

    return lead;
  }

  // Update a lead
  async updateLead(leadId, updateData) {
    // Prevent updating createdBy
    delete updateData.createdBy;

    const lead = await Lead.findByIdAndUpdate(leadId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('assignedSalesperson', 'name email')
      .populate('createdBy', 'name email');

    if (!lead) {
      throw new Error('Lead not found');
    }

    return lead;
  }

  // Update lead status
  async updateLeadStatus(leadId, status, userId) {
    const lead = await Lead.findById(leadId);

    if (!lead) {
      throw new Error('Lead not found');
    }

    const previous = lead.status;
    lead.status = status;
    // push status history
    lead.statusHistory = lead.statusHistory || [];
    lead.statusHistory.push({ from: previous, to: status, changedBy: userId || null, changedAt: new Date() });

    await lead.save();

    await lead.populate('assignedSalesperson', 'name email');
    await lead.populate('createdBy', 'name email');

    return lead;
  }

  // Get activity timeline for a lead (notes + status history)
  async getActivity(leadId) {
    // Fetch notes
    const notes = await Note.find({ lead: leadId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Fetch lead to read statusHistory
    const lead = await Lead.findById(leadId).populate('statusHistory.changedBy', 'name email');

    const statusEvents = (lead?.statusHistory || []).map((ev) => ({
      type: 'status',
      from: ev.from,
      to: ev.to,
      changedBy: ev.changedBy || null,
      changedAt: ev.changedAt || null,
    }));

    const noteEvents = notes.map((n) => ({
      type: 'note',
      id: n._id,
      content: n.content,
      createdBy: n.createdBy,
      createdAt: n.createdAt,
    }));

    // Merge and sort by timestamp desc
    const combined = [
      ...statusEvents.map((s) => ({ ...s, timestamp: s.changedAt })),
      ...noteEvents.map((n) => ({ ...n, timestamp: n.createdAt })),
    ]
      .filter((x) => x.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return combined;
  }

  // Delete a lead
  async deleteLead(leadId) {
    const lead = await Lead.findByIdAndDelete(leadId);

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Delete associated notes
    await Note.deleteMany({ lead: leadId });

    return lead;
  }

  // Get lead statistics
  async getLeadStatistics() {
    const stats = await Lead.aggregate([
      {
        $facet: {
          totalLeads: [{ $count: 'count' }],
          newLeads: [{ $match: { status: 'New' } }, { $count: 'count' }],
          qualifiedLeads: [{ $match: { status: 'Qualified' } }, { $count: 'count' }],
          wonLeads: [{ $match: { status: 'Won' } }, { $count: 'count' }],
          lostLeads: [{ $match: { status: 'Lost' } }, { $count: 'count' }],
          totalEstimatedValue: [
            {
              $group: {
                _id: null,
                total: { $sum: '$estimatedDealValue' },
              },
            },
          ],
          totalWonValue: [
            {
              $match: { status: 'Won' },
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$estimatedDealValue' },
              },
            },
          ],
        },
      },
    ]);

    return {
      totalLeads: stats[0].totalLeads[0]?.count || 0,
      newLeads: stats[0].newLeads[0]?.count || 0,
      qualifiedLeads: stats[0].qualifiedLeads[0]?.count || 0,
      wonLeads: stats[0].wonLeads[0]?.count || 0,
      lostLeads: stats[0].lostLeads[0]?.count || 0,
      totalEstimatedDealValue: stats[0].totalEstimatedValue[0]?.total || 0,
      totalWonDealsValue: stats[0].totalWonValue[0]?.total || 0,
    };
  }
}

module.exports = new LeadService();
