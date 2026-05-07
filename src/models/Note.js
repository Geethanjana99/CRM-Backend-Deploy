const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: [true, 'Please provide a lead ID'],
    },
    content: {
      type: String,
      required: [true, 'Please provide note content'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide creator information'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
noteSchema.index({ lead: 1 });
noteSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Note', noteSchema);
