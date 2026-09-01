const express = require('express');
const Review = require('../models/Review');
const Designer = require('../models/Designer');
const Project = require('../models/Project');
const { requireObjectId, isValidObjectId, requireString, pagination } = require('../middleware/validation');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = pagination(req.query);
    const filter = req.query.status ? { moderationStatus: String(req.query.status) } : { moderationStatus: 'approved' };
    const [reviews, total] = await Promise.all([
      Review.find(filter).populate('client', 'name').populate('designer', 'user').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Review.countDocuments(filter),
    ]);
    return res.json({ reviews, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { project, rating, comment } = req.body;

    if (!project || !rating || !comment) {
      return res.status(400).json({ message: 'Project, rating, and comment are required.' });
    }
    if (!isValidObjectId(project)) return res.status(404).json({ message: 'Completed project not found.' });
    const projectRecord = await Project.findOne({ _id: requireObjectId(project, 'Project ID'), client: req.user.id });
    if (!projectRecord) return res.status(404).json({ message: 'Completed project not found.' });
    if (projectRecord.status !== 'completed') return res.status(400).json({ message: 'Reviews are only allowed for completed projects.' });
    const designer = await Designer.findById(projectRecord.designer);
    if (!designer) return res.status(404).json({ message: 'Designer not found.' });

    const review = await Review.create({
      client: req.user.id,
      designer: designer._id,
      project: projectRecord._id,
      rating: Number(rating),
      comment: requireString(comment, 'Comment', { max: 2000 }),
    });

    const ratings = await Review.find({ designer: designer._id, moderationStatus: 'approved' });
    const average = ratings.reduce((total, item) => total + item.rating, 0) / ratings.length;
    designer.rating = Number((average || 0).toFixed(1));
    designer.ratingCount = ratings.length;
    await designer.save();

    return res.status(201).json({ review });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id/moderate', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const review = await Review.findById(requireObjectId(req.params.id, 'Review ID'));
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    if (!['pending', 'approved', 'rejected'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid moderation status.' });
    review.moderationStatus = req.body.status;
    await review.save();
    return res.json({ review });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
