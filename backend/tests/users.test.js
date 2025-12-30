const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('User Management Tests', () => {
  let token;

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
    const signup = await request(app).post('/api/auth/signup').send({
      email: 'test@example.com',
      password: 'Test123',
      fullName: 'Test User'
    });
    token = signup.body.data.token;
  });

  test('Get profile: authorized', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  test('Get profile: unauthorized', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.status).toBe(401);
  });

  test('Update profile: success', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'Updated User',
        email: 'updated@example.com'
      });

    expect(res.status).toBe(200);
  });

  test('Update profile: duplicate email rejected', async () => {
    await request(app).post('/api/auth/signup').send({
      email: 'other@example.com',
      password: 'Test123',
      fullName: 'Other'
    });

    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'other@example.com' });

    expect(res.status).toBe(400);
  });

  test('Change password: success', async () => {
    const res = await request(app)
      .put('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'Test123',
        newPassword: 'NewPass123'
      });

    expect(res.status).toBe(200);
  });

  test('Change password: unauthorized', async () => {
    const res = await request(app)
      .put('/api/users/change-password')
      .send({
        currentPassword: 'Test123',
        newPassword: 'NewPass123'
      });

    expect(res.status).toBe(401);
  });
});
