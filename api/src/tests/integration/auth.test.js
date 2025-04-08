import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { setupTestSuite } from './setup.js';
import app from '../../app.js';
import User from '../../models/User.js';

describe('Auth API', () => {
  setupTestSuite();

  describe('POST /api/auth/register', () => {
    it('registers new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.username).toBe('testuser');

      const user = await User.findById(res.body.user.id);
      expect(user).toBeTruthy();
      expect(user.username).toBe('testuser');
    });

    it('creates initial todo for new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      const todosRes = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${res.body.token}`);

      expect(todosRes.status).toBe(200);
      expect(todosRes.body).toHaveLength(1);
    });

    it('fails with existing username', async () => {
      await User.create({
        username: 'testuser',
        password: 'password123'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Username already exists');
    });

    it('fails with missing username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Username and password are required');
    });

    it('fails with missing password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Username and password are required');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        username: 'testuser',
        password: 'password123'
      });
    });

    it('logs in existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.username).toBe('testuser');
    });

    it('fails with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('fails with non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('fails with missing username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Username and password are required');
    });

    it('fails with missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Username and password are required');
    });
  });

  describe('Authentication Flow', () => {
    it('completes full auth flow', async () => {
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(registerRes.status).toBe(201);
      const registerToken = registerRes.body.token;

      const logoutByRemovingToken = true;
      if (logoutByRemovingToken) {
        const loginRes = await request(app)
          .post('/api/auth/login')
          .send({
            username: 'testuser',
            password: 'password123'
          });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body.token).toBeTruthy();
        expect(loginRes.body.token).not.toBe(registerToken);
      }
    });
  });
}); 