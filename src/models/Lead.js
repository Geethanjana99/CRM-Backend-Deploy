const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    leadName: {
      type: String,
      required: [true, 'Please provide a lead name'],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    leadSource: {
      type: String,
      enum: ['Website', 'Email', 'Phone Call', 'Referral', 'LinkedIn', 'Event', 'Other'],
      required: [true, 'Please provide a lead source'],
    },
    assignedSalesperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please assign a salesperson'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
      default: 'New',
    },
    statusHistory: [
      {
        from: { type: String },
        to: { type: String },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date },
      },
    ],
    estimatedDealValue: {
      type: Number,
      default: 0,
      min: [0, 'Estimated deal value cannot be negative'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
leadSchema.index({ status: 1 });
leadSchema.index({ leadSource: 1 });
leadSchema.index({ assignedSalesperson: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ leadName: 'text', companyName: 'text', email: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
