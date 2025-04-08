import todoRepository from '../repositories/todoRepository.js';

class TodoService {
  async getAllTodos(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return todoRepository.findAll({ user: userId });
  }

  async getTodoById(id, userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const todo = await todoRepository.findById(id, { user: userId });
    if (!todo) {
      throw new Error('Todo not found');
    }
    if (todo.user !== userId) {
      throw new Error('Unauthorized access to todo');
    }
    return todo;
  }

  async createTodo(data) {
    if (!data.title?.trim()) {
      throw new Error('Title is required');
    }
    if (!data.user) {
      throw new Error('User is required');
    }
    return todoRepository.create(data);
  }

  async updateTodo(id, data, userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (data.title !== undefined && !data.title?.trim()) {
      throw new Error('Title cannot be empty');
    }
    return todoRepository.update(id, data, { user: userId });
  }

  async toggleTodoComplete(id, userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const todo = await todoRepository.findById(id, { user: userId });
    todo.completed = !todo.completed;
    return todo.save();
  }

  async deleteTodo(id, userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return todoRepository.delete(id, { user: userId });
  }
}

export default new TodoService(); 