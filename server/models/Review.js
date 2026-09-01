const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  designer: { type: mongoose.Schema.Types.ObjectId, ref: 'Designer', required: true },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
  },
  createdAt: { type: Date, default: Date.now },
});

reviewSchema.index({ designer: 1, client: 1, project: 1 }, { unique: true });
reviewSchema.index({ designer: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
