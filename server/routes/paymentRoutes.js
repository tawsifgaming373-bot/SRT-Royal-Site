const express = require('express');
const Payment = require('../models/Payment');
const Project = require('../models/Project');
const { requireAuth, requireRole } = require('../middleware/auth');
const { requireObjectId, requireString } = require('../middleware/validation');
const { calculateRevenueSplit } = require('../config/businessRules');
const { assertGatewaySupported } = require('../services/paymentService');

const router = express.Router();
router.use(requireAuth);

/**
 * Start a payment for a project.
 *
 * SECURITY: the amount is ALWAYS taken from project.budget on the server —
 * never from the request body. A client cannot influence how much they end
 * up owing by editing what they send here. If a project has no budget set
 * yet, payment cannot start until that's fixed (by the designer/admin), not
 * by the client typing in a number.
 */
router.post('/', async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: requireObjectId(req.body.projectId, 'Project ID'), client: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    const gateway = requireString(req.body.gateway, 'Payment gateway', { max: 20 }).toLowerCase();
    try {
      assertGatewaySupported(gateway);
    } catch (gatewayError) {
      return res.status(gatewayError.statusCode || 400).json({ message: gatewayError.message });
    }

    const grossAmount = Number(project.budget);
    if (!Number.isFinite(grossAmount) || grossAmount <= 0) {
      return res.status(400).json({ message: 'This project has no confirmed budget yet, so payment cannot start. Ask the designer/admin to set a final price first.' });
    }

    const existingActive = await Payment.findOne({ project: project._id, status: { $in: ['pending', 'processing', 'paid'] } });
    if (existingActive) {
      return res.status(409).json({ message: 'A payment already exists for this project.', payment: existingActive });
    }

    const split = calculateRevenueSplit(grossAmount, 0);

    const payment = await Payment.create({
      user: req.user.id,
      project: project._id,
      designer: project.designer,
      amount: split.grossAmount,
      paymentFee: split.paymentFee,
      netAmount: split.netAmount,
      developerShare: split.developerShare,
      platformShare: split.platformShare,
      currency: req.body.currency || 'BDT',
      gateway,
      status: 'pending',
    });

    project.paymentStatus = 'pending';
    await project.save();

    return res.status(202).json({
      payment,
      message: gateway === 'manual'
        ? 'Payment recorded as pending. An admin will confirm it once proof of payment is received.'
        : 'Payment initialized and awaiting gateway confirmation.',
    });
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

/**
 * A designer's own earnings — every payment where they're the designer,
 * plus a running total of what's actually been paid out (status: 'paid').
 * Pending/failed payments show up too but don't count toward the total,
 * since that money hasn't actually been confirmed yet.
 */
router.get('/my-earnings', async (req, res, next) => {
  try {
    const Designer = require('../models/Designer');
    const designer = await Designer.findOne({ user: req.user.id }).select('_id').lean();
    if (!designer) return res.status(403).json({ message: 'Only designers have earnings.' });

    const payments = await Payment.find({ designer: designer._id })
      .sort({ createdAt: -1 })
      .populate('project', 'title')
      .populate('user', 'name')
      .lean();

    const totalEarned = payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.developerShare, 0);

    return res.json({ payments, totalEarned });
  } catch (error) { return next(error); }
});

/**
 * ADMIN ONLY — manually confirm a payment as received (bank transfer, bKash
 * SMS, cash, etc.), since no automated gateway is wired up yet. This is the
 * "development mode" the payment system runs in until a real gateway with
 * webhook verification is added. Only works on gateway === 'manual' payments,
 * and only an authenticated admin can call it — never the client, never a
 * plain "success" message sent from the browser.
 */
router.patch('/:id/confirm', requireRole('admin'), async (req, res, next) => {
  try {
    const payment = await Payment.findById(requireObjectId(req.params.id, 'Payment ID'));
    if (!payment) return res.status(404).json({ message: 'Payment not found.' });
    if (payment.gateway !== 'manual') {
      return res.status(400).json({ message: 'Only manually-recorded payments can be confirmed this way. Gateway-based payments must be confirmed via their webhook.' });
    }
    if (payment.status === 'paid') {
      return res.status(400).json({ message: 'This payment is already marked paid.' });
    }

    payment.status = 'paid';
    payment.confirmedBy = req.user.id;
    payment.completedAt = new Date();
    if (req.body.transactionId) payment.transactionId = String(req.body.transactionId).trim().slice(0, 100);
    await payment.save();

    const project = await Project.findById(payment.project);
    if (project) {
      project.paymentStatus = 'paid';
      await project.save();
    }

    return res.json({ payment, message: 'Payment confirmed as paid.' });
  } catch (error) { return next(error); }
});

module.exports = router;
