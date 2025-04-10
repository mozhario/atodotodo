import api from './api';

export const todoService = {
  async getUserTodos() {
    const response = await api.get('/todos');
    return response.data;
  },

  async createTodo(title) {
    const response = await api.post('/todos', { title });
    return response.data;
  },

  async toggleTodoCompletion(id) {
    const response = await api.post(`/todos/${id}/toggle`);
    return response.data;
  },

  async updateTodoTitle(id, title) {
    const response = await api.patch(`/todos/${id}`, { title });
    return response.data;
  },

  async removeTodo(id) {
    await api.delete(`/todos/${id}`);
    return id;
  }
}; 