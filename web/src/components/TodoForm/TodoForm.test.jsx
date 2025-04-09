import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import TodoForm from './TodoForm';

describe('TodoForm Component', () => {
  test('renders input and submit button', () => {
    render(<TodoForm onAdd={vi.fn()} />);

    // Check if the input field is rendered
    const input = screen.getByPlaceholderText('Add a new todo...');
    expect(input).toBeInTheDocument();

    // Check if the submit button is rendered
    const button = screen.getByText('Add');
    expect(button).toBeInTheDocument();
  });

  test('calls onAdd with input value when form is submitted', () => {
    const mockOnAdd = vi.fn();
    render(<TodoForm onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByText('Add');

    // Simulate user input
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(button);

    // Check if onAdd was called with the correct value
    expect(mockOnAdd).toHaveBeenCalledWith('New Todo');
  });
}); 