import { useState } from 'react';
import './TodoForm.css';

function TodoForm({ onAdd }) {
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    onAdd(newTodo);
    setNewTodo('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo..."
        className="input"
      />
      <button type="submit" className="btn btn-primary">Add</button>
    </form>
  );
}

export default TodoForm; 