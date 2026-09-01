const mongoose = require('mongoose');

const hireRequestSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Designer',
    required: true,
  },
  projectTitle: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  budget: { type: Number, min: 0, default: 0 },
  deadline: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

hireRequestSchema.pre('save', function(next){ this.updatedAt = Date.now(); next(); });
hireRequestSchema.index({ client: 1, designer: 1, status: 1 });

module.exports = mongoose.model('HireRequest', hireRequestSchema);
