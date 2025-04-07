import BaseService from './baseService.js';
import Todo from '../models/Todo.js';

class TodoService extends BaseService {
  constructor() {
    super(Todo);
  }

  async toggleComplete(id) {
    const todo = await this.getById(id);
    todo.completed = !todo.completed;
    return todo.save();
  }
}

export default new TodoService(); 