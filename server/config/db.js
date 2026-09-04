const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Add it to your .env file.');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
  });

  console.log('✅ MongoDB connected');

  await runStartupMigrations();
}

/**
 * One-time, idempotent fixes that need to run against existing data.
 * Safe to run on every server start — each one only touches documents
 * that still need it, so after the first successful run they're no-ops.
 */
async function runStartupMigrations() {
  try {
    // Designer approval workflow (added later than the Designer model itself):
    // any designer profile that existed before this feature has no `status`
    // field at all. Treat those as already-approved so nobody who was already
    // publicly listed disappears from the site — only NEW applications go
    // through admin approval from now on.
    const Designer = require('../models/Designer');
    const result = await Designer.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'approved', reviewedAt: new Date() } }
    );
    if (result.modifiedCount > 0) {
      console.log(`✅ Migration: marked ${result.modifiedCount} pre-existing designer profile(s) as approved.`);
    }
  } catch (err) {
    console.error('⚠️  Startup migration failed (non-fatal):', err.message);
  }
}

module.exports = { connectDB };
