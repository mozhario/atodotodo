import BaseSerializer from './baseSerializer.js';

class TodoSerializer extends BaseSerializer {
  static toJSON(todo) {
    return {
      id: this.formatId(todo._id),
      title: todo.title,
      completed: todo.completed,
      createdAt: this.formatDate(todo.createdAt),
      updatedAt: this.formatDate(todo.updatedAt)
    };
  }

  static toJSONList(todos) {
    return todos.map(todo => this.toJSON(todo));
  }
}

export default TodoSerializer; 