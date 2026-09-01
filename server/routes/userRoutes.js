const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { sanitizeUser } = require('../controllers/authController');
const bcrypt = require('bcryptjs');
const { requireString, isValidEmail } = require('../middleware/validation');

const router = express.Router();

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.put('/profile', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (req.body.name !== undefined) user.name = requireString(req.body.name, 'Name', { max: 120 });
    if (req.body.email !== undefined) {
      if (!isValidEmail(req.body.email)) return res.status(400).json({ message: 'A valid email is required.' });
      const email = String(req.body.email).trim().toLowerCase();
      const duplicate = await User.findOne({ email, _id: { $ne: user._id } });
      if (duplicate) return res.status(409).json({ message: 'An account with this email already exists.' });
      user.email = email;
    }
    if (req.body.company !== undefined) user.company = String(req.body.company).trim();
    if (req.body.phone !== undefined) user.phone = String(req.body.phone).trim();
    if (req.body.photo !== undefined) {
      if (typeof req.body.photo !== 'string' || req.body.photo.length > 2048 || !/^https:\/\//i.test(req.body.photo)) return res.status(400).json({ message: 'Profile photo must be an HTTPS image URL from configured storage.' });
      user.photo = req.body.photo.trim();
    }

    await user.save();
    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.patch('/password', requireAuth, async (req, res, next) => {
  try {
    const currentPassword = requireString(req.body.currentPassword, 'Current password', { max: 200 });
    const newPassword = requireString(req.body.newPassword, 'New password', { min: 8, max: 200 });
    const user = await User.findById(req.user.id);
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) return res.status(400).json({ message: 'Current password is incorrect.' });
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    return res.json({ message: 'Password changed successfully.' });
  } catch (error) { return next(error); }
});

module.exports = router;
