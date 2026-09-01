const express = require('express');
const mongoose = require('mongoose');
const HireRequest = require('../models/HireRequest');
const Designer = require('../models/Designer');
const { requireAuth } = require('../middleware/auth');
const { requireObjectId, requireString, pagination } = require('../middleware/validation');
const { createNotification } = require('../services/notificationService');
const Project = require('../models/Project');

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { page, limit, skip } = pagination(req.query);
    const filter = {};
    if (req.user.role !== 'admin') {
      const designerProfile = await Designer.findOne({ user: req.user.id }).select('_id').lean();
      filter.$or = [{ client: req.user.id }];
      if (designerProfile) filter.$or.push({ designer: designerProfile._id });
    }
    const [requests, total] = await Promise.all([
      HireRequest.find(filter).populate('client', 'name email company').populate('designer').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      HireRequest.countDocuments(filter),
    ]);
    return res.json({ hireRequests: requests, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { designerId, projectTitle, description, budget, deadline } = req.body;

    if (!designerId || !projectTitle || !description) {
      return res.status(400).json({ message: 'Designer, project title, and description are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(designerId)) {
      return res.status(400).json({ message: 'Designer not found.' });
    }

    const designer = await Designer.findById(designerId);
    if (!designer) {
      return res.status(400).json({ message: 'Designer not found.' });
    }

    const request = await HireRequest.create({
      client: req.user.id,
      designer: designer._id,
      projectTitle: String(projectTitle).trim(),
      description: String(description).trim(),
      budget: Number(budget) || 0,
      deadline: deadline || '',
    });
    await createNotification({ user: designer.user, type: 'hire_request', message: `New hire request: ${request.projectTitle}.`, metadata: { hireRequestId: request.id } });

    return res.status(201).json({ hireRequest: request });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const request = await HireRequest.findById(requireObjectId(req.params.id, 'Hire request ID'));
    if (!request) return res.status(404).json({ message: 'Hire request not found.' });

    const requestDesigner = await Designer.findById(request.designer).select('user');
    const isClient = String(request.client) === String(req.user.id);
    const isDesignerUser = !!requestDesigner && String(requestDesigner.user) === String(req.user.id);
    if (req.user.role !== 'admin' && !isClient && !isDesignerUser) {
      return res.status(403).json({ message: 'You cannot update this hire request.' });
    }

    const nextStatus = requireString(req.body.status, 'Status', { max: 20 });
    const transitions = {
      pending: ['accepted', 'rejected', 'cancelled'], accepted: ['in_progress', 'cancelled'],
      rejected: [], in_progress: ['completed', 'cancelled'], completed: [], cancelled: [],
    };
    if (!transitions[request.status]?.includes(nextStatus)) return res.status(400).json({ message: `Cannot change request from ${request.status} to ${nextStatus}.` });
    if (['accepted', 'rejected'].includes(nextStatus) && req.user.role !== 'admin' && !isDesignerUser) {
      return res.status(403).json({ message: 'Only the designer can accept or reject this hire request.' });
    }
    request.status = nextStatus;
    await request.save();
    if (nextStatus === 'accepted') {
      const project = await Project.create({ client: request.client, designer: request.designer, hireRequest: request._id, title: request.projectTitle, description: request.description, budget: request.budget, deadline: request.deadline });
      await createNotification({ user: request.client, type: 'hire_accepted', message: `Your hire request was accepted. Project ${project.title} was created.`, metadata: { hireRequestId: request.id } });
      return res.json({ hireRequest: request, project });
    }
    const notifyUser = isClient ? requestDesigner?.user : request.client;
    if (notifyUser) {
      await createNotification({ user: notifyUser, type: `hire_${nextStatus}`, message: `Hire request status changed to ${nextStatus}.`, metadata: { hireRequestId: request.id } });
    }
    return res.json({ hireRequest: request });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
