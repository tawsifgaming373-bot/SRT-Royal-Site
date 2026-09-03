const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  designer: { type: mongoose.Schema.Types.ObjectId, ref: 'Designer', required: true },
  amount: { type: Number, required: true, min: 0 }, // gross amount, always server-derived from project.budget — never trust client input here
  paymentFee: { type: Number, default: 0, min: 0 },
  netAmount: { type: Number, required: true, min: 0 },
  developerShare: { type: Number, required: true, min: 0 },
  platformShare: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'BDT', uppercase: true, trim: true },
  transactionId: { type: String, trim: true, default: '' },
  gateway: { type: String, enum: ['bkash', 'nagad', 'sslcommerz', 'manual'], required: true },
  // 'manual' = admin manually confirmed this payment happened outside the platform
  // (bank transfer, cash, etc). Used only until a real gateway is wired up —
  // see server/services/paymentService.js for why.
  status: { type: String, enum: ['pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded'], default: 'pending' },
  confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // admin who manually confirmed, when gateway === 'manual'
  refundAmount: { type: Number, default: 0, min: 0 },
  completedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

paymentSchema.pre('save', function updateTimestamp(next) { this.updatedAt = Date.now(); next(); });
paymentSchema.index({ project: 1, createdAt: -1 });
paymentSchema.index({ designer: 1, status: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
