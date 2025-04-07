import todoService from '../services/todoService.js';
import TodoSerializer from '../serializers/todoSerializer.js';

class TodoController {
  async getAll(req, res) {
    try {
      const todos = await todoService.getAllTodos(req.user._id);
      res.json(TodoSerializer.toJSONList(todos));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const todo = await todoService.getTodoById(req.params.id, req.user._id);
      res.json(TodoSerializer.toJSON(todo));
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async create(req, res) {
    try {
      const todo = await todoService.createTodo({
        ...req.body,
        user: req.user._id
      });
      res.status(201).json(TodoSerializer.toJSON(todo));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const todo = await todoService.updateTodo(
        req.params.id,
        req.body,
        req.user._id
      );
      res.json(TodoSerializer.toJSON(todo));
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async toggleComplete(req, res) {
    try {
      const todo = await todoService.toggleTodoComplete(req.params.id, req.user._id);
      res.json(TodoSerializer.toJSON(todo));
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async delete(req, res) {
    try {
      await todoService.deleteTodo(req.params.id, req.user._id);
      res.status(204).send();
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }
}

export default new TodoController(); 