import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Todo from '../models/Todo.js';
import { DEFAULT_TODOS } from '../constants/todos.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class UserService {
  async register(username, password) {
    if (!username?.trim()) {
      throw new Error('Username is required');
    }
    if (!password?.trim()) {
      throw new Error('Password is required');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const user = await User.create({ username, password });
    
    // Create initial todo
    await Todo.create({
      title: DEFAULT_TODOS.FIRST_TODO,
      completed: false,
      user: user._id
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
    
    return {
      token,
      user: {
        id: user._id,
        username: user.username
      }
    };
  }

  async login(username, password) {
    if (!username?.trim()) {
      throw new Error('Username is required');
    }
    if (!password?.trim()) {
      throw new Error('Password is required');
    }

    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
    
    return {
      token,
      user: {
        id: user._id,
        username: user.username
      }
    };
  }

  async generateToken(userId) {
    return jwt.sign(
        { 
          id: user._id, 
          username: user.username,
          // Add a unique identifier to each token
          nonce: Math.random().toString(36).substring(2),
          // or use a timestamp
          iat: Date.now()
        }, 
        JWT_SECRET,
        { expiresIn: '24h' }
      );
  }
} 