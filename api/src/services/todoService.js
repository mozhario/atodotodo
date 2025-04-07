import todoRepository from '../repositories/todoRepository.js';

class TodoService {
  async getAllTodos(userId) {
    return todoRepository.findAll({ user: userId });
  }

  async getTodoById(id, userId) {
    return todoRepository.findById(id, { user: userId });
  }

  async createTodo(data) {
    return todoRepository.create(data);
  }

  async updateTodo(id, data, userId) {
    return todoRepository.update(id, data, { user: userId });
  }

  async toggleTodoComplete(id, userId) {
    const todo = await todoRepository.findById(id, { user: userId });
    todo.completed = !todo.completed;
    return todo.save();
  }

  async deleteTodo(id, userId) {
    return todoRepository.delete(id, { user: userId });
  }
}

export default new TodoService(); 