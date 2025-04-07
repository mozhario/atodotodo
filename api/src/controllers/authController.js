import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Todo from '../models/Todo.js';
import { UserService } from '../services/userService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const userService = new UserService();

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await userService.register(username, password);
    res.status(201).json(result);
  } catch (error) {
    console.error('Register error:', error);
    res.status(error.message === 'Username already exists' ? 400 : 500)
      .json({ error: error.message || 'Error creating user' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await userService.login(username, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(error.message === 'Invalid credentials' ? 401 : 500)
      .json({ error: error.message || 'Error logging in' });
  }
}; 