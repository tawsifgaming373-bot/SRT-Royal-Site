const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const morgan = require('morgan');

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const designerRoutes = require('./routes/designerRoutes');
const hireRequestRoutes = require('./routes/hireRequestRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { validateEnvironment } = require('./config/env');
const notificationRoutes = require('./routes/notificationRoutes');
const projectRoutes = require('./routes/projectRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

async function createApp() {
  validateEnvironment();
  if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'development-secret-change-me';

  if (process.env.MONGODB_URI) {
    await connectDB(process.env.MONGODB_URI);
  }

  const app = express();
  app.set('trust proxy', 1);

  app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  }));

  app.use(cors({
    origin: process.env.CLIENT_URL || false,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please wait a moment and try again.' },
  });
  app.use('/api/', apiLimiter);

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/designers', designerRoutes);
  app.use('/api/hire-requests', hireRequestRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/payments', paymentRoutes);

  app.get('/api/health', (req, res) => {
    const databaseReady = mongoose.connection.readyState === 1;
    res.json({
      status: databaseReady || !process.env.MONGODB_URI ? 'healthy' : 'degraded',
      database: databaseReady ? 'connected' : 'not-connected',
      env: process.env.NODE_ENV || 'development',
      features: {
        googleOAuth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        githubOAuth: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
        passwordResetEmail: !!(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
      },
      timestamp: new Date().toISOString(),
    });
  });

  app.use(express.static(path.join(__dirname, '../public')));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    return res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
module.exports.createApp = createApp;
