const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  link: { type: String, default: '' },
}, { _id: true, timestamps: true });

const designerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: '',
    trim: true,
  },
  skills: [{ type: String, trim: true }],
  categories: [{ type: String, trim: true }],
  portfolio: [portfolioItemSchema],
  pricing: {
    hourly: { type: Number, default: 0 },
    project: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  experience: {
    type: Number,
    default: 0,
    min: 0,
  },
  availability: {
    type: String,
    default: 'Available',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
  rejectionReason: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

designerSchema.pre('save', function(next){ this.updatedAt = Date.now(); next(); });

designerSchema.index({ rating: -1 });
designerSchema.index({ skills: 1 });
designerSchema.index({ categories: 1 });
designerSchema.index({ status: 1 });

module.exports = mongoose.model('Designer', designerSchema);
