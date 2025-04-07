import BaseRepository from './baseRepository.js';
import Todo from '../models/Todo.js';

class TodoRepository extends BaseRepository {
  constructor() {
    super(Todo);
  }
}

export default new TodoRepository(); 