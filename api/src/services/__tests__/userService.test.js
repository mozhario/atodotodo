import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '../userService.js';
import User from '../../models/User.js';
import Todo from '../../models/Todo.js';
import jwt from 'jsonwebtoken';
import { DEFAULT_TODOS } from '../../constants/todos.js';

// Mock dependencies
vi.mock('../../models/User.js');
vi.mock('../../models/Todo.js');
vi.mock('jsonwebtoken');

describe('UserService', () => {
  let userService;
  const mockUserId = 'user123';
  const mockUsername = 'testuser';
  const mockPassword = 'password123';
  const mockToken = 'mock_token';

  beforeEach(() => {
    userService = new UserService();
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('creates user with valid credentials', async () => {
      const mockUser = { _id: mockUserId, username: mockUsername };
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      Todo.create.mockResolvedValue({ title: DEFAULT_TODOS.FIRST_TODO });
      jwt.sign.mockReturnValue(mockToken);

      const result = await userService.register(mockUsername, mockPassword);

      expect(User.create).toHaveBeenCalledWith({ username: mockUsername, password: mockPassword });
      expect(Todo.create).toHaveBeenCalledWith({
        title: DEFAULT_TODOS.FIRST_TODO,
        completed: false,
        user: mockUserId
      });
      expect(result).toEqual({
        token: mockToken,
        user: { id: mockUserId, username: mockUsername }
      });
    });

    it('fails with empty username', async () => {
      await expect(userService.register('', mockPassword))
        .rejects
        .toThrow('Username is required');
    });

    it('fails with empty password', async () => {
      await expect(userService.register(mockUsername, ''))
        .rejects
        .toThrow('Password is required');
    });

    it('fails with existing username', async () => {
      User.findOne.mockResolvedValue({ username: mockUsername });
      await expect(userService.register(mockUsername, mockPassword))
        .rejects
        .toThrow('Username already exists');
    });

    it('fails when user creation fails', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockRejectedValue(new Error('Database error'));
      
      await expect(userService.register(mockUsername, mockPassword))
        .rejects
        .toThrow('Database error');
    });

    it('fails when todo creation fails', async () => {
      const mockUser = { _id: mockUserId, username: mockUsername };
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      Todo.create.mockRejectedValue(new Error('Todo creation failed'));

      await expect(userService.register(mockUsername, mockPassword))
        .rejects
        .toThrow('Todo creation failed');
    });
  });

  describe('login', () => {
    it('authenticates with valid credentials', async () => {
      const mockUser = {
        _id: mockUserId,
        username: mockUsername,
        validatePassword: vi.fn().mockResolvedValue(true)
      };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue(mockToken);

      const result = await userService.login(mockUsername, mockPassword);

      expect(mockUser.validatePassword).toHaveBeenCalledWith(mockPassword);
      expect(result).toEqual({
        token: mockToken,
        user: { id: mockUserId, username: mockUsername }
      });
    });

    it('fails with non-existent user', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(userService.login(mockUsername, mockPassword))
        .rejects
        .toThrow('Invalid credentials');
    });

    it('fails with wrong password', async () => {
      const mockUser = {
        validatePassword: vi.fn().mockResolvedValue(false)
      };
      User.findOne.mockResolvedValue(mockUser);

      await expect(userService.login(mockUsername, 'wrong'))
        .rejects
        .toThrow('Invalid credentials');
    });

    it('fails with empty username', async () => {
      await expect(userService.login('', mockPassword))
        .rejects
        .toThrow('Username is required');
    });

    it('fails with empty password', async () => {
      await expect(userService.login(mockUsername, ''))
        .rejects
        .toThrow('Password is required');
    });

    it('fails when password validation throws', async () => {
      const mockUser = {
        validatePassword: vi.fn().mockRejectedValue(new Error('Validation error'))
      };
      User.findOne.mockResolvedValue(mockUser);

      await expect(userService.login(mockUsername, mockPassword))
        .rejects
        .toThrow('Validation error');
    });
  });

  describe('token generation', () => {
    it('uses correct JWT parameters', async () => {
      const mockUser = { _id: mockUserId, username: mockUsername };
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      Todo.create.mockResolvedValue({});

      await userService.register(mockUsername, mockPassword);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUserId },
        expect.any(String),
        { expiresIn: '24h' }
      );
    });

    it('fails when token generation fails', async () => {
      const mockUser = { _id: mockUserId, username: mockUsername };
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      Todo.create.mockResolvedValue({});
      jwt.sign.mockImplementation(() => { throw new Error('Token generation failed'); });

      await expect(userService.register(mockUsername, mockPassword))
        .rejects
        .toThrow('Token generation failed');
    });
  });
}); 