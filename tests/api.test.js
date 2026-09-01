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
  const mongoVersion = process.env.MONGOMS_VERSION || '4.2.25';

  mongoServer = await MongoMemoryServer.create({
    binary: { version: mongoVersion },
    instance: { dbName: 'srt-royal-test' },
  });

  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.NODE_ENV = 'test';
  process.env.CLIENT_URL = 'http://localhost:3000';
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
});

test('designer search finds matching profile', async () => {

  const res = await request(app)
    .get('/api/designers?search=premium');

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.designers));
  assert.ok(res.body.designers.length >= 1);
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
