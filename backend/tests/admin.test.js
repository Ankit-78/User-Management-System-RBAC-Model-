const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Admin Tests', () => {
  let adminToken, userId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});

    const admin = new User({
      email: 'admin@example.com',
      password: 'Admin123',
      fullName: 'Admin',
      role: 'admin'
    });
    await admin.save();

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Admin123' });

    adminToken = adminLogin.body.data.token;

    const user = await request(app).post('/api/auth/signup').send({
      email: 'user@example.com',
      password: 'User123',
      fullName: 'User'
    });

    userId = user.body.data.user.id;
  });

  test('Admin can list users', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  test('Non-admin cannot list users', async () => {
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'User123' });

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userLogin.body.data.token}`);

    expect(res.status).toBe(403);
  });

  test('Admin can activate user', async () => {
    await User.findByIdAndUpdate(userId, { status: 'inactive' });

    const res = await request(app)
      .put(`/api/admin/users/${userId}/activate`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  test('Admin can deactivate user', async () => {
    const res = await request(app)
      .put(`/api/admin/users/${userId}/deactivate`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  test('Admin cannot activate non-existent user', async () => {
    const res = await request(app)
      .put('/api/admin/users/507f1f77bcf86cd799439011/activate')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  test('Admin cannot deactivate non-existent user', async () => {
    const res = await request(app)
      .put('/api/admin/users/507f1f77bcf86cd799439011/deactivate')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
