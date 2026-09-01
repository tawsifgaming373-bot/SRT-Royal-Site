const express = require('express');
const Payment = require('../models/Payment');
const Project = require('../models/Project');
const { requireAuth } = require('../middleware/auth');
const { requireObjectId, requireString } = require('../middleware/validation');

const router = express.Router();
router.use(requireAuth);

router.post('/', async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: requireObjectId(req.body.projectId, 'Project ID'), client: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    const gateway = requireString(req.body.gateway, 'Payment gateway', { max: 20 }).toLowerCase();
    if (!['bkash', 'nagad', 'sslcommerz'].includes(gateway)) return res.status(400).json({ message: 'Unsupported payment gateway.' });
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: 'Payment amount must be greater than zero.' });
    const payment = await Payment.create({ user: req.user.id, project: project._id, amount, currency: req.body.currency || 'BDT', gateway, status: 'pending' });
    return res.status(202).json({ payment, message: 'Payment initialized and awaiting gateway confirmation.' });
  } catch (error) { return next(error); }
});

router.get('/project/:projectId', async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: requireObjectId(req.params.projectId, 'Project ID'), client: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    const payments = await Payment.find({ project: project._id }).sort({ createdAt: -1 }).lean();
    return res.json({ payments });
  } catch (error) { return next(error); }
});

module.exports = router;
