import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { setupTestSuite } from './setup.js';
import app from '../../app.js';
import Todo from '../../models/Todo.js';

describe('Todos API', () => {
  let authToken;
  let userId;
  let anotherUserToken;
  let anotherUserId;

  setupTestSuite();

  beforeEach(async () => {
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    authToken = userRes.body.token;
    userId = userRes.body.user.id;

    const anotherUserRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'anotheruser',
        password: 'password123'
      });
    anotherUserToken = anotherUserRes.body.token;
    anotherUserId = anotherUserRes.body.user.id;
  });

  describe('GET /api/todos', () => {
    it('returns user todos', async () => {
      await Todo.create([
        { title: 'Test todo 1', user: userId },
        { title: 'Test todo 2', user: userId }
      ]);

      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3); // 2 + 1 default todo
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('completed');
    });

    it('returns empty array for new user', async () => {
      await Todo.deleteMany({}); // Remove default todo

      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it('fails without auth token', async () => {
      const res = await request(app).get('/api/todos');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/todos', () => {
    it('creates new todo', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'New todo' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New todo');
      expect(res.body.completed).toBe(false);

      const todo = await Todo.findById(res.body.id);
      expect(todo).toBeTruthy();
      expect(todo.user.toString()).toBe(userId);
    });

    it('fails with empty title', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: '' });

      expect(res.status).toBe(400);
    });

    it('fails without auth token', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'New todo' });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/todos/:id', () => {
    let todoId;

    beforeEach(async () => {
      const todo = await Todo.create({
        title: 'Test todo',
        user: userId
      });
      todoId = todo._id.toString();
    });

    it('updates todo title', async () => {
      const res = await request(app)
        .patch(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated todo' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated todo');

      const todo = await Todo.findById(todoId);
      expect(todo.title).toBe('Updated todo');
    });

    it('fails to update another user todo', async () => {
      const res = await request(app)
        .patch(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .send({ title: 'Updated todo' });

      expect(res.status).toBe(404);
    });

    it('fails with non-existent todo', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .patch(`/api/todos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated todo' });

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/todos/:id/toggle', () => {
    let todoId;

    beforeEach(async () => {
      const todo = await Todo.create({
        title: 'Test todo',
        user: userId,
        completed: false
      });
      todoId = todo._id.toString();
    });

    it('toggles todo completion', async () => {
      const res = await request(app)
        .post(`/api/todos/${todoId}/toggle`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);

      const todo = await Todo.findById(todoId);
      expect(todo.completed).toBe(true);

      const res2 = await request(app)
        .post(`/api/todos/${todoId}/toggle`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res2.status).toBe(200);
      expect(res2.body.completed).toBe(false);
    });

    it('fails to toggle another user todo', async () => {
      const res = await request(app)
        .post(`/api/todos/${todoId}/toggle`)
        .set('Authorization', `Bearer ${anotherUserToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let todoId;

    beforeEach(async () => {
      const todo = await Todo.create({
        title: 'Test todo',
        user: userId
      });
      todoId = todo._id.toString();
    });

    it('deletes todo', async () => {
      const res = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(204);

      const todo = await Todo.findById(todoId);
      expect(todo).toBeNull();
    });

    it('fails to delete another user todo', async () => {
      const res = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`);

      expect(res.status).toBe(404);

      const todo = await Todo.findById(todoId);
      expect(todo).toBeTruthy();
    });

    it('fails with non-existent todo', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .delete(`/api/todos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('Todo Flow', () => {
    it('completes full todo lifecycle', async () => {
      const createRes = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test todo' });

      expect(createRes.status).toBe(201);
      const todoId = createRes.body.id;

      const updateRes = await request(app)
        .patch(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated todo' });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.title).toBe('Updated todo');

      const toggleRes = await request(app)
        .post(`/api/todos/${todoId}/toggle`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(toggleRes.status).toBe(200);
      expect(toggleRes.body.completed).toBe(true);

      const deleteRes = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteRes.status).toBe(204);

      const getRes = await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getRes.status).toBe(404);
    });
  });
}); 