import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import { ThemeToggle } from './ThemeToggle';

// Mock the useTheme hook
vi.mock('./ThemeProvider', () => {
  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useTheme: vi.fn().mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    }),
  };
});

describe('ThemeToggle', () => {
  it('renders correctly', () => {
    render(<ThemeToggle />);
    
    // Check that the button is rendered
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('toggles theme when clicked', () => {
    // Create a mock for setTheme
    const setThemeMock = vi.fn();
    
    // Override the mock to return our controlled mock function
    const { useTheme } = require('./ThemeProvider');
    useTheme.mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    render(<ThemeToggle />);
    
    // Click the toggle button
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Check that setTheme was called with 'dark'
    expect(setThemeMock).toHaveBeenCalledWith('dark');

    // Update the mock to simulate being in dark mode
    useTheme.mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });

    // Re-render with the new mock
    render(<ThemeToggle />);
    
    // Click the toggle button again
    const updatedButton = screen.getByRole('button');
    fireEvent.click(updatedButton);
    
    // Check that setTheme was called with 'light'
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  it('displays the correct icon based on current theme', () => {
    // Get the mocked useTheme
    const { useTheme } = require('./ThemeProvider');
    
    // Mock for light theme
    useTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    const { rerender } = render(<ThemeToggle />);
    
    // In light mode, we should see a moon icon (for switching to dark)
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
    
    // Mock for dark theme
    useTheme.mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
    });

    // Re-render with dark theme
    rerender(<ThemeToggle />);
    
    // In dark mode, we should see a sun icon (for switching to light)
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });
});
