const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  designer: { type: mongoose.Schema.Types.ObjectId, ref: 'Designer', required: true },
  hireRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'HireRequest' },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'pending', 'paid', 'refunded'],
    default: 'unpaid',
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  budget: { type: Number, default: 0 },
  deadline: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSchema.pre('save', function(next){ this.updatedAt = Date.now(); next(); });
projectSchema.index({ client: 1, designer: 1, status: 1 });

module.exports = mongoose.model('Project', projectSchema);
