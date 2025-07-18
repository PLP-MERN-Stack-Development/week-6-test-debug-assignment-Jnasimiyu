/**
 * Bug model schema
 * Defines the structure and validation for bug documents
 */

const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Bug title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Bug description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  severity: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'critical'],
      message: 'Severity must be one of: low, medium, high, critical'
    },
    default: 'medium'
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'in-progress', 'resolved', 'closed'],
      message: 'Status must be one of: open, in-progress, resolved, closed'
    },
    default: 'open'
  },
  assignedTo: {
    type: String,
    trim: true,
    maxlength: [50, 'Assignee name cannot exceed 50 characters']
  },
  reportedBy: {
    type: String,
    required: [true, 'Reporter name is required'],
    trim: true,
    minlength: [2, 'Reporter name must be at least 2 characters'],
    maxlength: [50, 'Reporter name cannot exceed 50 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  reproductionSteps: {
    type: String,
    trim: true,
    maxlength: [500, 'Reproduction steps cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted creation date
bugSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Indexes
bugSchema.index({ status: 1, severity: 1 });
bugSchema.index({ createdAt: -1 });

// Pre-save middleware
bugSchema.pre('save', function(next) {
  if (this.severity) this.severity = this.severity.toLowerCase();
  if (this.status) this.status = this.status.toLowerCase();
  if (Array.isArray(this.tags)) {
    this.tags = this.tags.filter(tag => tag.trim().length > 0);
  }
  next();
});

// Static method to get bugs by status
bugSchema.statics.findByStatus = function(status) {
  return this.find({ status: status.toLowerCase() });
};

// Instance method to mark as resolved
bugSchema.methods.markAsResolved = function() {
  this.status = 'resolved';
  return this.save();
};

module.exports = mongoose.model('Bug', bugSchema);
