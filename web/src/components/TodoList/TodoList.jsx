import TodoItem from './TodoItem/TodoItem';
import './TodoList.css';

function TodoList({ todos, onToggle, onUpdate, onDelete }) {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TodoList; 