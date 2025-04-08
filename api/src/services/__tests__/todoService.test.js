import { describe, it, expect, beforeEach, vi } from 'vitest';
import todoService from '../todoService.js';
import todoRepository from '../../repositories/todoRepository.js';

vi.mock('../../repositories/todoRepository.js');

describe('TodoService', () => {
  const mockUserId = 'user123';
  const mockTodoId = 'todo123';
  const mockTodo = {
    _id: mockTodoId,
    title: 'Test todo',
    completed: false,
    user: mockUserId,
    save: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllTodos', () => {
    it('returns todos for user', async () => {
      todoRepository.findAll.mockResolvedValue([mockTodo]);
      
      const result = await todoService.getAllTodos(mockUserId);
      
      expect(todoRepository.findAll).toHaveBeenCalledWith({ user: mockUserId });
      expect(result).toEqual([mockTodo]);
    });

    it('returns empty array when no todos', async () => {
      todoRepository.findAll.mockResolvedValue([]);
      
      const result = await todoService.getAllTodos(mockUserId);
      
      expect(result).toEqual([]);
    });

    it('handles repository errors', async () => {
      todoRepository.findAll.mockRejectedValue(new Error('DB error'));
      
      await expect(todoService.getAllTodos(mockUserId))
        .rejects
        .toThrow('DB error');
    });
  });

  describe('getTodoById', () => {
    it('returns todo if found', async () => {
      todoRepository.findById.mockResolvedValue(mockTodo);
      
      const result = await todoService.getTodoById(mockTodoId, mockUserId);
      
      expect(todoRepository.findById).toHaveBeenCalledWith(mockTodoId, { user: mockUserId });
      expect(result).toEqual(mockTodo);
    });

    it('throws if todo not found', async () => {
      todoRepository.findById.mockResolvedValue(null);
      
      await expect(todoService.getTodoById(mockTodoId, mockUserId))
        .rejects
        .toThrow();
    });

    it('throws if todo belongs to different user', async () => {
      const differentUserTodo = { ...mockTodo, user: 'different123' };
      todoRepository.findById.mockResolvedValue(differentUserTodo);
      
      await expect(todoService.getTodoById(mockTodoId, mockUserId))
        .rejects
        .toThrow();
    });
  });

  describe('createTodo', () => {
    const newTodoData = {
      title: 'New todo',
      user: mockUserId
    };

    it('creates todo with valid data', async () => {
      todoRepository.create.mockResolvedValue(mockTodo);
      
      const result = await todoService.createTodo(newTodoData);
      
      expect(todoRepository.create).toHaveBeenCalledWith(newTodoData);
      expect(result).toEqual(mockTodo);
    });

    it('throws if title missing', async () => {
      const invalidData = { user: mockUserId };
      
      await expect(todoService.createTodo(invalidData))
        .rejects
        .toThrow('Title is required');
    });

    it('throws if user missing', async () => {
      const invalidData = { title: 'Test' };
      
      await expect(todoService.createTodo(invalidData))
        .rejects
        .toThrow('User is required');
    });
  });

  describe('updateTodo', () => {
    const updateData = { title: 'Updated todo' };

    it('updates todo if found', async () => {
      todoRepository.update.mockResolvedValue({ ...mockTodo, ...updateData });
      
      const result = await todoService.updateTodo(mockTodoId, updateData, mockUserId);
      
      expect(todoRepository.update).toHaveBeenCalledWith(mockTodoId, updateData, { user: mockUserId });
      expect(result.title).toBe(updateData.title);
    });

    it('throws if todo not found', async () => {
      todoRepository.update.mockRejectedValue(new Error('Todo not found'));
      
      await expect(todoService.updateTodo(mockTodoId, updateData, mockUserId))
        .rejects
        .toThrow('Todo not found');
    });

    it('throws if trying to update different user todo', async () => {
      todoRepository.update.mockRejectedValue(new Error('Unauthorized'));
      
      await expect(todoService.updateTodo(mockTodoId, updateData, 'different123'))
        .rejects
        .toThrow('Unauthorized');
    });
  });

  describe('toggleTodoComplete', () => {
    it('toggles completed status', async () => {
      const todo = { ...mockTodo, save: vi.fn() };
      todoRepository.findById.mockResolvedValue(todo);
      todo.save.mockResolvedValue({ ...todo, completed: true });
      
      const result = await todoService.toggleTodoComplete(mockTodoId, mockUserId);
      
      expect(todo.completed).toBe(true);
      expect(todo.save).toHaveBeenCalled();
      expect(result.completed).toBe(true);
    });

    it('toggles back to incomplete', async () => {
      const todo = { ...mockTodo, completed: true, save: vi.fn() };
      todoRepository.findById.mockResolvedValue(todo);
      todo.save.mockResolvedValue({ ...todo, completed: false });
      
      const result = await todoService.toggleTodoComplete(mockTodoId, mockUserId);
      
      expect(todo.completed).toBe(false);
      expect(todo.save).toHaveBeenCalled();
      expect(result.completed).toBe(false);
    });

    it('throws if todo not found', async () => {
      todoRepository.findById.mockResolvedValue(null);
      
      await expect(todoService.toggleTodoComplete(mockTodoId, mockUserId))
        .rejects
        .toThrow();
    });

    it('throws if save fails', async () => {
      const todo = { ...mockTodo, save: vi.fn() };
      todoRepository.findById.mockResolvedValue(todo);
      todo.save.mockRejectedValue(new Error('Save failed'));
      
      await expect(todoService.toggleTodoComplete(mockTodoId, mockUserId))
        .rejects
        .toThrow('Save failed');
    });
  });

  describe('deleteTodo', () => {
    it('deletes todo if found', async () => {
      todoRepository.delete.mockResolvedValue(mockTodo);
      
      await todoService.deleteTodo(mockTodoId, mockUserId);
      
      expect(todoRepository.delete).toHaveBeenCalledWith(mockTodoId, { user: mockUserId });
    });

    it('throws if todo not found', async () => {
      todoRepository.delete.mockRejectedValue(new Error('Todo not found'));
      
      await expect(todoService.deleteTodo(mockTodoId, mockUserId))
        .rejects
        .toThrow('Todo not found');
    });

    it('throws if trying to delete different user todo', async () => {
      todoRepository.delete.mockRejectedValue(new Error('Unauthorized'));
      
      await expect(todoService.deleteTodo(mockTodoId, 'different123'))
        .rejects
        .toThrow('Unauthorized');
    });
  });
}); 