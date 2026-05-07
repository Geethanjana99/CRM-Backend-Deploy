const LeadService = require('../services/LeadService');

class LeadController {
  // Create a new lead
  async createLead(req, res, next) {
    try {
      const { leadName, companyName, email, phoneNumber, leadSource, assignedSalesperson, status, estimatedDealValue } = req.body;

      // Validation
      const requiredFields = ['leadName', 'companyName', 'email', 'phoneNumber', 'leadSource', 'assignedSalesperson'];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        const AppError = require('../utils/AppError');
        return next(new AppError(400, `Please provide: ${missingFields.join(', ')}`));
      }

      const lead = await LeadService.createLead(
        {
          leadName,
          companyName,
          email,
          phoneNumber,
          leadSource,
          assignedSalesperson,
          status,
          estimatedDealValue,
        },
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all leads
  async getAllLeads(req, res, next) {
    try {
      const { status, leadSource, assignedSalesperson, search, page = 1, limit = 10 } = req.query;

      const result = await LeadService.getAllLeads(
        {
          status,
          leadSource,
          assignedSalesperson,
          search,
        },
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result.leads,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get lead by ID
  async getLeadById(req, res, next) {
    try {
      const { id } = req.params;

      const lead = await LeadService.getLeadById(id);

      res.status(200).json({
        success: true,
        data: lead,
      });
    } catch (error) {
      const AppError = require('../utils/AppError');
      return next(new AppError(404, error.message));
    }
  }

  // Update lead
  async updateLead(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const lead = await LeadService.updateLead(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Lead updated successfully',
        data: lead,
      });
    } catch (error) {
      if (error.message === 'Lead not found') {
        const AppError = require('../utils/AppError');
        return next(new AppError(404, error.message));
      }
      next(error);
    }
  }

  // Update lead status
  async updateLeadStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        const AppError = require('../utils/AppError');
        return next(new AppError(400, 'Please provide a status'));
      }

      const lead = await LeadService.updateLeadStatus(id, status, req.user?.id);

      res.status(200).json({
        success: true,
        message: 'Lead status updated successfully',
        data: lead,
      });
    } catch (error) {
      const AppError = require('../utils/AppError');
      return next(new AppError(404, error.message));
    }
  }

  // Delete lead
  async deleteLead(req, res, next) {
    try {
      const { id } = req.params;

      await LeadService.deleteLead(id);

      res.status(200).json({
        success: true,
        message: 'Lead deleted successfully',
      });
    } catch (error) {
      const AppError = require('../utils/AppError');
      return next(new AppError(404, error.message));
    }
  }

  // Get activity timeline for a lead
  async getActivity(req, res, next) {
    try {
      const { id } = req.params;

      const timeline = await LeadService.getActivity(id);

      res.status(200).json({
        success: true,
        data: timeline,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LeadController();
