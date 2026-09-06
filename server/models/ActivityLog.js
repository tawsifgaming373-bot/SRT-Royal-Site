const mongoose = require('mongoose');

/**
 * A record of a significant platform action, for the admin's audit trail.
 *
 * NEVER log secrets here: passwords, password hashes, JWT secrets, API keys,
 * payment card/account numbers, auth tokens, or password-reset tokens. Only
 * pass IDs and short descriptive metadata into metadata — never raw request
 * bodies, which could accidentally include something sensitive.
 */
const activityLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null for system/automated actions
  actorRole: { type: String, enum: ['client', 'designer', 'admin', 'system'], required: true },
  action: { type: String, required: true, trim: true, maxlength: 60 }, // e.g. 'hire_request.accepted', 'payment.confirmed'
  targetType: { type: String, required: true, trim: true, maxlength: 40 }, // e.g. 'HireRequest', 'Payment', 'Designer'
  targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ targetType: 1, targetId: 1 });
activityLogSchema.index({ actor: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
