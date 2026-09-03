const express = require('express');
const User = require('../models/User');
const Designer = require('../models/Designer');
const HireRequest = require('../models/HireRequest');
const Review = require('../models/Review');
const Project = require('../models/Project');
const ContactMessage = require('../models/ContactMessage');
const { requireAuth, requireRole } = require('../middleware/auth');
const { requireObjectId, requireString } = require('../middleware/validation');

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

router.get('/overview', async (req, res, next) => {
  try {
    const [users, designers, hireRequests, projects, reviews] = await Promise.all([
      User.countDocuments(),
      Designer.countDocuments(),
      HireRequest.countDocuments({ status: 'pending' }),
      Project.countDocuments(),
      Review.countDocuments(),
    ]);

    const averageRating = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);

    const summary = {
      totalUsers: users,
      totalDesigners: designers,
      totalProjects: projects,
      pendingHireRequests: hireRequests,
      totalReviews: reviews,
      averageRating: averageRating[0]?.avg ? Number(averageRating[0].avg.toFixed(1)) : 0,
    };

    return res.json({ summary });
  } catch (error) {
    return next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash -__v').sort({ createdAt: -1 }).lean();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

router.patch('/users/:id/status', async (req, res, next) => {
  try {
    const user = await User.findById(requireObjectId(req.params.id, 'User ID'));
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (String(user._id) === String(req.user.id)) return res.status(400).json({ message: 'You cannot deactivate your own account.' });
    if (typeof req.body.isActive !== 'boolean') return res.status(400).json({ message: 'isActive must be a boolean.' });
    user.isActive = req.body.isActive;
    await user.save();
    return res.json({ user: { id: user.id, email: user.email, role: user.role, isActive: user.isActive } });
  } catch (error) { return next(error); }
});

router.get('/contact-messages', async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(100).lean();
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
});

router.patch('/contact-messages/:id/handled', async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(requireObjectId(req.params.id, 'Message ID'));
    if (!message) return res.status(404).json({ message: 'Message not found.' });
    message.handled = true;
    await message.save();
    return res.json({ message: 'Marked as handled.', contactMessage: message });
  } catch (error) {
    return next(error);
  }
});

router.get('/hire-requests', async (req, res, next) => {
  try {
    const requests = await HireRequest.find().sort({ createdAt: -1 }).populate('client', 'name email').populate('designer', 'user').lean();
    return res.json({ hireRequests: requests });
  } catch (error) {
    return next(error);
  }
});

router.patch('/hire-requests/:id/status', async (req, res, next) => {
  try {
    const request = await HireRequest.findById(requireObjectId(req.params.id, 'Hire request ID'));
    if (!request) return res.status(404).json({ message: 'Hire request not found.' });

    const nextStatus = requireString(req.body.status, 'Status', { max: 20 });
    if (!['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'].includes(nextStatus)) {
      return res.status(400).json({ message: 'Invalid hire request status.' });
    }
    request.status = nextStatus;
    await request.save();
    return res.json({ hireRequest: request });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
