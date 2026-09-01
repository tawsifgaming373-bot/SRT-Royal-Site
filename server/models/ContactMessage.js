const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, default: '', trim: true, maxlength: 40 },
  subject: { type: String, default: '', trim: true, maxlength: 160 },
  message: { type: String, required: true, trim: true, maxlength: 4000 },
  handled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

contactMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
