const express = require('express');
const Designer = require('../models/Designer');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { pagination, requireObjectId, requireString, escapeRegex } = require('../middleware/validation');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = pagination(req.query);
    const { search, category, skill } = req.query;
    const filter = {};

    if (search) {
      const safeSearch = escapeRegex(String(search).slice(0, 100));
      filter.$or = [
        { bio: { $regex: safeSearch, $options: 'i' } },
        { skills: { $regex: safeSearch, $options: 'i' } },
        { categories: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    if (category) {
      filter.categories = { $in: [String(category)] };
    }

    if (skill) {
      filter.skills = { $in: [String(skill)] };
    }

    const [designers, total] = await Promise.all([
      Designer.find(filter)
      .populate('user', 'name email photo company role')
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip).limit(limit).lean(),
      Designer.countDocuments(filter),
    ]);

    return res.json({ designers, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const { bio, skills, categories, portfolio, experience, pricing, availability } = req.body;

    const existing = await Designer.findOne({ user: user._id });
    if (existing) {
      return res.status(400).json({ message: 'Designer profile already exists.' });
    }

    const designer = await Designer.create({
      user: user._id,
      bio: bio || '',
      skills: Array.isArray(skills) ? skills : [],
      categories: Array.isArray(categories) ? categories : [],
      portfolio: Array.isArray(portfolio) ? portfolio : [],
      experience: Number(experience) || 0,
      pricing: pricing || { hourly: 0, project: 0, currency: 'USD' },
      availability: availability || 'Available',
    });

    user.role = 'designer';
    await user.save();

    return res.status(201).json({ designer });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const designer = await Designer.findById(requireObjectId(req.params.id, 'Designer ID')).populate('user', 'name email photo company role').lean();
    if (!designer) return res.status(404).json({ message: 'Designer not found.' });
    return res.json({ designer });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const designer = await Designer.findById(requireObjectId(req.params.id, 'Designer ID'));
    if (!designer) return res.status(404).json({ message: 'Designer not found.' });
    if (String(designer.user) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'You can only update your own designer profile.' });

    const allowed = ['bio', 'skills', 'categories', 'portfolio', 'experience', 'pricing', 'availability'];
    for (const field of allowed) {
      if (req.body[field] !== undefined) designer[field] = req.body[field];
    }
    if (designer.bio !== undefined) designer.bio = requireString(designer.bio, 'Bio', { min: 0, max: 2000 });
    await designer.save();
    return res.json({ designer });
  } catch (error) { return next(error); }
});

router.post('/:id/portfolio', requireAuth, async (req, res, next) => {
  try {
    const designer = await Designer.findById(requireObjectId(req.params.id, 'Designer ID'));
    if (!designer) return res.status(404).json({ message: 'Designer not found.' });
    if (String(designer.user) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'You can only manage your own portfolio.' });
    const title = requireString(req.body.title, 'Portfolio title', { max: 160 });
    designer.portfolio.push({ title, description: req.body.description || '', imageUrl: req.body.imageUrl || '', link: req.body.link || '' });
    await designer.save();
    return res.status(201).json({ item: designer.portfolio[designer.portfolio.length - 1] });
  } catch (error) { return next(error); }
});

router.delete('/:id/portfolio/:itemId', requireAuth, async (req, res, next) => {
  try {
    const designer = await Designer.findById(requireObjectId(req.params.id, 'Designer ID'));
    if (!designer) return res.status(404).json({ message: 'Designer not found.' });
    if (String(designer.user) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'You can only manage your own portfolio.' });
    const item = designer.portfolio.id(requireObjectId(req.params.itemId, 'Portfolio item ID'));
    if (!item) return res.status(404).json({ message: 'Portfolio item not found.' });
    item.deleteOne();
    await designer.save();
    return res.json({ message: 'Portfolio item deleted.' });
  } catch (error) { return next(error); }
});

module.exports = router;
