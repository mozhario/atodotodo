import { useState } from 'react';
import './TodoItem.css';

function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [title, setTitle] = useState(todo.title);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const handleBlur = () => {
    if (title !== todo.title) {
      onUpdate(todo.id, title);
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="cursor-pointer"
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`edit-input ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}
      />
      <button 
        onClick={() => onDelete(todo.id)} 
        className="btn btn-danger ml-auto"
      >
        Delete
      </button>
    </li>
  );
}

export default TodoItem; 