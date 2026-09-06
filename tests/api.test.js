const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

const appFactory = require('../server/app');

let app;
let mongoServer;
let token;
let adminToken;

async function setupMongoMemory() {
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.NODE_ENV = 'test';
  process.env.CLIENT_URL = 'http://localhost:3000';

  // In CI, a real MongoDB runs as a Docker service (see .github/workflows/ci.yml)
  // — no binary download needed at all, which is what was hanging before.
  // Locally (or anywhere CI_MONGODB_URI isn't set), fall back to
  // mongodb-memory-server, which downloads its own binary on first use.
  if (process.env.CI_MONGODB_URI) {
    process.env.MONGODB_URI = process.env.CI_MONGODB_URI;
    app = await appFactory();
    return;
  }

  const mongoVersion = process.env.MONGOMS_VERSION || '7.0.3';

  // MongoMemoryServer.create() has no built-in timeout — if the binary
  // download stalls, the whole test run hangs silently instead of failing
  // with a clear error. Race it against a hard timeout so a stuck download
  // fails fast and loudly instead.
  mongoServer = await Promise.race([
    MongoMemoryServer.create({
      binary: { version: mongoVersion },
      instance: { dbName: 'srt-royal-test' },
    }),
    new Promise((_, reject) => setTimeout(
      () => reject(new Error(`MongoMemoryServer.create() did not finish within 120s (binary version ${mongoVersion}). This usually means the MongoDB binary download stalled — try a different MONGOMS_VERSION, or set CI_MONGODB_URI to point at a real MongoDB instance instead.`)),
      120000
    )),
  ]);

  process.env.MONGODB_URI = mongoServer.getUri();
  app = await appFactory();
}

test.before(async () => {
  await setupMongoMemory();
});

test.after(async () => {
  if (mongoServer) {
    try {
      await mongoServer.stop();
    } catch (error) {}
  }

  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
  }
});

test('registration creates a user and returns auth token', async () => {

  const res = await request(app)
    .post('/api/auth/signup')
    .send({
      name: 'Client One',
      email: 'client1@example.com',
      password: 'Password123!',
      role: 'client'
    });

  assert.equal(res.status, 201);
  assert.ok(res.body.token);
  assert.equal(res.body.user.email, 'client1@example.com');
  token = res.body.token;
});

test('login returns a valid token', async () => {

  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'client1@example.com',
      password: 'Password123!'
    });

  assert.equal(res.status, 200);
  assert.ok(res.body.token);
  token = res.body.token;
});

test('authenticated route returns current user', async () => {

  const res = await request(app)
    .get('/api/users/me')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.user.email, 'client1@example.com');
});

test('admin user can access dashboard stats', async () => {

  const adminRes = await request(app)
    .post('/api/auth/signup')
    .send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password123!',
      role: 'admin'
    });

  adminToken = adminRes.body.token;

  const res = await request(app)
    .get('/api/admin/overview')
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  assert.ok(res.body.summary);
});

test('client cannot access admin overview', async () => {

  const res = await request(app)
    .get('/api/admin/overview')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(res.status, 403);
});

test('designer creation works for authenticated users', async () => {

  const designerRes = await request(app)
    .post('/api/designers')
    .set('Authorization', `Bearer ${token}`)
    .send({
      bio: 'I build premium interfaces',
      skills: ['React', 'CSS'],
      categories: ['Web Design'],
      experience: 3,
      pricing: { hourly: 60 },
      availability: 'Available now'
    });

  assert.equal(designerRes.status, 201);
  assert.equal(designerRes.body.designer.bio, 'I build premium interfaces');
  assert.equal(designerRes.body.designer.status, 'pending', 'new designer profiles must start pending admin approval, not be public immediately');
  global.__testDesignerId = designerRes.body.designer._id || designerRes.body.designer.id;
});

test('pending (unapproved) designers are not publicly searchable', async () => {
  const res = await request(app).get('/api/designers?search=premium');

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.designers));
  assert.equal(res.body.designers.length, 0, 'an unapproved designer must not appear in the public listing');
});

test('admin can approve a pending designer, after which it becomes publicly searchable', async () => {
  const approveRes = await request(app)
    .patch(`/api/admin/designers/${global.__testDesignerId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ status: 'approved' });

  assert.equal(approveRes.status, 200);

  const res = await request(app).get('/api/designers?search=premium');
  assert.equal(res.status, 200);
  assert.ok(res.body.designers.length >= 1, 'an approved designer must appear in the public listing');
});

test('hire request creation works for authenticated client', async () => {

  const res = await request(app)
    .post('/api/hire-requests')
    .set('Authorization', `Bearer ${token}`)
    .send({
      designerId: 'invalid-id',
      projectTitle: 'Landing Page',
      description: 'Need a product landing page',
      budget: 1200,
      deadline: '2026-10-01'
    });

  assert.equal(res.status, 400);
  assert.match(res.body.message, /designer/i);
});

test('admin can moderate a review status', async () => {

  const reviewRes = await request(app)
    .post('/api/reviews')
    .set('Authorization', `Bearer ${token}`)
    .send({
      designerId: 'does-not-matter',
      project: 'Project-1',
      rating: 5,
      comment: 'Great work!'
    });

  assert.equal(reviewRes.status, 404);
  assert.ok(reviewRes.body.message);
});

test('invalid tokens cannot access protected routes', async () => {
  const res = await request(app)
    .get('/api/users/me')
    .set('Authorization', 'Bearer invalid-token');

  assert.equal(res.status, 401);
});

test('duplicate signup is rejected', async () => {
  const res = await request(app)
    .post('/api/auth/signup')
    .send({ name: 'Duplicate', email: 'client1@example.com', password: 'Password123!' });

  assert.equal(res.status, 400);
  assert.match(res.body.message, /already exists/i);
});

test('profile updates cannot change the user role', async () => {
  const before = await request(app)
    .get('/api/users/me')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(before.status, 200);
  const roleBefore = before.body.user.role;
  const res = await request(app)
    .put('/api/users/profile')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Updated Client', role: 'admin' });

  assert.equal(res.status, 200);
  assert.equal(res.body.user.name, 'Updated Client');
  assert.equal(res.body.user.role, roleBefore);
});

test('protected endpoints reject missing authentication', async () => {
  const res = await request(app).get('/api/notifications');

  assert.equal(res.status, 401);
});

// ── Payment revenue-split security tests ──
// Verifies the core financial rule from the product spec: the client can
// NEVER control the amount they're charged or the developer/platform split.
// Only the server-derived project.budget feeds the calculation.

test('payment amount is derived from project.budget, never from the client, and splits 50/50', async () => {
  const Project = require('../server/models/Project');
  const User = require('../server/models/User');
  const Designer = require('../server/models/Designer');

  const paymentClient = await request(app).post('/api/auth/signup').send({
    name: 'Payment Client', email: 'payclient@example.com', password: 'Password123!', role: 'client',
  });
  const clientToken = paymentClient.body.token;
  const clientId = paymentClient.body.user.id || paymentClient.body.user._id;

  const designerUser = await User.create({ name: 'Pay Designer', email: 'paydesigner@example.com', passwordHash: 'x', role: 'designer' });
  const designer = await Designer.create({ user: designerUser._id, bio: 'test' });

  const project = await Project.create({
    client: clientId,
    designer: designer._id,
    title: 'Test Project',
    budget: 200, // this is the ONLY source of truth for payment amount
  });

  // Client attempts to tamper: sends amount=1 hoping to pay $1 instead of $200.
  const res = await request(app)
    .post('/api/payments')
    .set('Authorization', `Bearer ${clientToken}`)
    .send({ projectId: project._id.toString(), gateway: 'manual', amount: 1 });

  assert.equal(res.status, 202);
  assert.equal(res.body.payment.amount, 200, 'amount must come from project.budget, not the tampered request body');
  assert.equal(res.body.payment.developerShare, 100);
  assert.equal(res.body.payment.platformShare, 100);
  assert.equal(res.body.payment.developerShare + res.body.payment.platformShare, res.body.payment.netAmount);

  global.__testPaymentId = res.body.payment._id || res.body.payment.id;
  global.__testClientToken = clientToken;
});

test('unconfigured gateways are rejected with 501, not silently accepted', async () => {
  const Project = require('../server/models/Project');
  const project = await Project.findOne({ title: 'Test Project' });

  const res = await request(app)
    .post('/api/payments')
    .set('Authorization', `Bearer ${global.__testClientToken}`)
    .send({ projectId: project._id.toString(), gateway: 'sslcommerz' });

  assert.equal(res.status, 501);
  assert.match(res.body.message, /not connected/i);
});

test('non-admin cannot confirm a manual payment', async () => {
  const res = await request(app)
    .patch(`/api/payments/${global.__testPaymentId}/confirm`)
    .set('Authorization', `Bearer ${global.__testClientToken}`)
    .send({});

  assert.equal(res.status, 403);
});

test('admin can confirm a manual payment, which marks the project paid', async () => {
  const res = await request(app)
    .patch(`/api/payments/${global.__testPaymentId}/confirm`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ transactionId: 'MANUAL-TEST-1' });

  assert.equal(res.status, 200);
  assert.equal(res.body.payment.status, 'paid');
  assert.equal(res.body.payment.transactionId, 'MANUAL-TEST-1');

  const Project = require('../server/models/Project');
  const project = await Project.findOne({ title: 'Test Project' });
  assert.equal(project.paymentStatus, 'paid');
});

test('admin revenue endpoint reflects the confirmed payment', async () => {
  const res = await request(app)
    .get('/api/admin/revenue')
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.totalRevenue, 200);
  assert.equal(res.body.developerEarnings, 100);
  assert.equal(res.body.platformEarnings, 100);
});

// ── Designer earnings endpoint ──
test('designer earnings endpoint returns their confirmed payments and excludes others', async () => {
  const jwt = require('jsonwebtoken');
  const User = require('../server/models/User');
  const designerUser = await User.findOne({ email: 'paydesigner@example.com' });
  const designerToken = jwt.sign({ id: designerUser._id.toString(), email: designerUser.email, role: designerUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const res = await request(app)
    .get('/api/payments/my-earnings')
    .set('Authorization', `Bearer ${designerToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.totalEarned, 100, 'should equal the developerShare of the one confirmed payment');
  assert.equal(res.body.payments.length, 1);
});

test('a client (not a designer) gets 403 from the earnings endpoint', async () => {
  const res = await request(app)
    .get('/api/payments/my-earnings')
    .set('Authorization', `Bearer ${global.__testClientToken}`);

  assert.equal(res.status, 403);
});
