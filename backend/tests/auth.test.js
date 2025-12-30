const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Authentication Tests', () => {

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
  });

  // ================= SIGNUP =================

  test('Signup: should create a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'Test123',
        fullName: 'Test User'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('test@example.com');
    expect(res.body.data.token).toBeDefined();
  });

  test('Signup: invalid email rejected', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'invalid',
        password: 'Test123',
        fullName: 'Test User'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('Signup: weak password rejected', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: '123',
        fullName: 'Test User'
      });

    expect(res.status).toBe(400);
  });

  test('Signup: duplicate email rejected', async () => {
    await request(app).post('/api/auth/signup').send({
      email: 'test@example.com',
      password: 'Test123',
      fullName: 'Test User'
    });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'Test123',
        fullName: 'Another User'
      });

    expect(res.status).toBe(400);
  });

  // ================= LOGIN =================

  test('Login: valid credentials', async () => {
    await request(app).post('/api/auth/signup').send({
      email: 'test@example.com',
      password: 'Test123',
      fullName: 'Test User'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test123'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  test('Login: wrong password rejected', async () => {
    await request(app).post('/api/auth/signup').send({
      email: 'test@example.com',
      password: 'Test123',
      fullName: 'Test User'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPass'
      });

    expect(res.status).toBe(401);
  });

  test('Login: non-existent user rejected', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nouser@example.com',
        password: 'Test123'
      });

    expect(res.status).toBe(401);
  });

  test('Login: inactive user rejected', async () => {
    await request(app).post('/api/auth/signup').send({
      email: 'test@example.com',
      password: 'Test123',
      fullName: 'Test User'
    });

    await User.updateOne({ email: 'test@example.com' }, { status: 'inactive' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test123'
      });

    expect(res.status).toBe(403);
  });

  test('Logout: success', async () => {
    const signup = await request(app).post('/api/auth/signup').send({
      email: 'test@example.com',
      password: 'Test123',
      fullName: 'Test User'
    });

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${signup.body.data.token}`);

    expect(res.status).toBe(200);
  });
});
