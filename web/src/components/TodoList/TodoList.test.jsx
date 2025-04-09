import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import TodoList from './TodoList';

vi.mock('./TodoItem/TodoItem', () => ({
  __esModule: true,
  default: ({ todo, onToggle, onUpdate, onDelete }) => (
    <li data-testid="todo-item">
      <span>{todo.text}</span>
      <button onClick={() => onToggle(todo.id)}>Toggle</button>
      <button onClick={() => onUpdate(todo.id)}>Update</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  ),
}));

describe('TodoList Component', () => {
  test('renders a list of todos', () => {
    const todos = [
      { id: 1, text: 'Learn React' },
      { id: 2, text: 'Write Tests' },
    ];
    const mockToggle = vi.fn();
    const mockUpdate = vi.fn();
    const mockDelete = vi.fn();

    render(
      <TodoList 
        todos={todos} 
        onToggle={mockToggle} 
        onUpdate={mockUpdate} 
        onDelete={mockDelete} 
      />
    );

    // Check if the correct number of TodoItem components are rendered
    const todoItems = screen.getAllByTestId('todo-item');
    expect(todoItems).toHaveLength(todos.length);

    // Check if the todo texts are rendered
    expect(screen.getByText('Learn React')).toBeInTheDocument();
    expect(screen.getByText('Write Tests')).toBeInTheDocument();
  });
}); 