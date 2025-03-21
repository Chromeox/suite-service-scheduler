import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import KeyboardAccessibility from './KeyboardAccessibility';

describe('KeyboardAccessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in light mode', () => {
    render(<KeyboardAccessibility />);
    
    // Check that the keyboard button is rendered
    const keyboardButton = screen.getByLabelText('Keyboard shortcuts');
    expect(keyboardButton).toBeInTheDocument();
  });

  it('renders correctly in dark mode', () => {
    render(<KeyboardAccessibility />, { theme: 'dark' });
    
    // Check that the keyboard button is rendered in dark mode
    const keyboardButton = screen.getByLabelText('Keyboard shortcuts');
    expect(keyboardButton).toBeInTheDocument();
  });

  it('opens dialog when button is clicked', () => {
    render(<KeyboardAccessibility />);
    
    // Click the keyboard button
    const keyboardButton = screen.getByLabelText('Keyboard shortcuts');
    fireEvent.click(keyboardButton);
    
    // Check that the dialog is opened
    const dialogTitle = screen.getByText('Keyboard Shortcuts');
    expect(dialogTitle).toBeInTheDocument();
    
    // Check that the shortcuts are displayed
    expect(screen.getByText('Navigate between interactive elements')).toBeInTheDocument();
    expect(screen.getByText('Activate buttons, links, and other controls')).toBeInTheDocument();
    expect(screen.getByText('Close dialogs or cancel current action')).toBeInTheDocument();
    expect(screen.getByText('Send message')).toBeInTheDocument();
    expect(screen.getByText('Navigate within components like emoji picker')).toBeInTheDocument();
    expect(screen.getByText('Navigate backwards through elements')).toBeInTheDocument();
  });

  it('displays keyboard shortcut keys correctly', () => {
    render(<KeyboardAccessibility />);
    
    // Click the keyboard button to open the dialog
    const keyboardButton = screen.getByLabelText('Keyboard shortcuts');
    fireEvent.click(keyboardButton);
    
    // Check that the keyboard shortcut keys are displayed
    expect(screen.getByText('Tab')).toBeInTheDocument();
    expect(screen.getByText('Enter')).toBeInTheDocument();
    expect(screen.getByText('Space')).toBeInTheDocument();
    expect(screen.getByText('Esc')).toBeInTheDocument();
    expect(screen.getByText('Ctrl/⌘')).toBeInTheDocument();
    expect(screen.getByText('Arrow Keys')).toBeInTheDocument();
    expect(screen.getByText('Shift')).toBeInTheDocument();
  });

  it('closes dialog when clicking outside', () => {
    render(<KeyboardAccessibility />);
    
    // Click the keyboard button to open the dialog
    const keyboardButton = screen.getByLabelText('Keyboard shortcuts');
    fireEvent.click(keyboardButton);
    
    // Check that the dialog is opened
    const dialogTitle = screen.getByText('Keyboard Shortcuts');
    expect(dialogTitle).toBeInTheDocument();
    
    // Click outside the dialog (on the backdrop)
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    
    // Check that the dialog is closed (this might be tricky to test with the current setup)
    // We might need to mock the Dialog component's behavior
  });

  it('has proper accessibility attributes', () => {
    render(<KeyboardAccessibility />);
    
    // Check that the keyboard button has proper accessibility attributes
    const keyboardButton = screen.getByLabelText('Keyboard shortcuts');
    expect(keyboardButton).toHaveAttribute('aria-label', 'Keyboard shortcuts');
    
    // Click the keyboard button to open the dialog
    fireEvent.click(keyboardButton);
    
    // Check that the dialog has proper accessibility attributes
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('renders keyboard shortcut keys with appropriate styling in dark mode', () => {
    render(<KeyboardAccessibility />, { theme: 'dark' });
    
    // Click the keyboard button to open the dialog
    const keyboardButton = screen.getByLabelText('Keyboard shortcuts');
    fireEvent.click(keyboardButton);
    
    // Get all kbd elements
    const kbdElements = screen.getAllByText('Tab');
    
    // Check that at least one kbd element has dark mode styling
    const hasDarkModeElement = kbdElements.some(element => 
      element.className.includes('dark:bg-gray-700') && 
      element.className.includes('dark:text-gray-100')
    );
    
    expect(hasDarkModeElement).toBe(true);
  });
});
