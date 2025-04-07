import BaseController from './baseController.js';
import todoService from '../services/todoService.js';
import TodoSerializer from '../serializers/todoSerializer.js';

class TodoController extends BaseController {
  constructor() {
    super(todoService, TodoSerializer);
  }

  async toggleComplete(req, res) {
    try {
      const todo = await todoService.toggleComplete(req.params.id);
      res.json(TodoSerializer.toJSON(todo));
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