const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'BDT', uppercase: true, trim: true },
  transactionId: { type: String, trim: true, default: '' },
  gateway: { type: String, enum: ['bkash', 'nagad', 'sslcommerz'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

paymentSchema.pre('save', function updateTimestamp(next) { this.updatedAt = Date.now(); next(); });
paymentSchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
