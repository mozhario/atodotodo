import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Header from './Header';
import { audioService } from '../../services/AudioService';

// Mock the audioService
vi.mock('../../services/AudioService', () => ({
  audioService: {
    isEnabled: vi.fn(() => true),
    setEnabled: vi.fn(),
  },
}));

describe('Header Component', () => {
  test('renders the header with title and buttons', () => {
    const mockLogout = vi.fn();
    const { container } = render(<Header onLogout={mockLogout} />);

    // Check if the title is rendered
    expect(screen.getByText('a todo to do')).toBeInTheDocument();

    // Check if the audio toggle button is rendered
    const audioButton = screen.getByTitle('Disable sounds');
    expect(audioButton).toBeInTheDocument();

    // Check if the logout button is rendered
    const logoutButton = screen.getByTitle('Logout');
    expect(logoutButton).toBeInTheDocument();

    // Snapshot test
    expect(container).toMatchSnapshot();
  });

  test('toggles audio state when audio button is clicked', () => {
    const mockLogout = vi.fn();
    render(<Header onLogout={mockLogout} />);

    const audioButton = screen.getByTitle('Disable sounds');
    fireEvent.click(audioButton);

    // Check if the audioService.setEnabled was called
    expect(audioService.setEnabled).toHaveBeenCalledWith(false);
  });

  test('calls onLogout when logout button is clicked', () => {
    const mockLogout = vi.fn();
    render(<Header onLogout={mockLogout} />);

    const logoutButton = screen.getByTitle('Logout');
    fireEvent.click(logoutButton);

    // Check if the onLogout function was called
    expect(mockLogout).toHaveBeenCalled();
  });
}); 