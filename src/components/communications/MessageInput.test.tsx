import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import MessageInput from './MessageInput';

describe('MessageInput', () => {
  const mockSendMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in light mode', () => {
    render(
      <MessageInput onSendMessage={mockSendMessage} />
    );
    
    // Check that the textarea is rendered
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    
    // Check that the send button is rendered
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeInTheDocument();
    
    // Check that the priority checkbox is rendered
    const priorityCheckbox = screen.getByRole('checkbox', { name: /mark as priority/i });
    expect(priorityCheckbox).toBeInTheDocument();
  });

  it('renders correctly in dark mode', () => {
    render(
      <MessageInput onSendMessage={mockSendMessage} />,
      { theme: 'dark' }
    );
    
    // The component should have dark mode styling
    const container = screen.getByRole('textbox').closest('div');
    expect(container?.parentElement).toHaveClass('dark:border-gray-800');
  });

  it('handles message input correctly', () => {
    render(
      <MessageInput onSendMessage={mockSendMessage} />
    );
    
    // Type in the textarea
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    
    // Click the send button
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Check that the onSendMessage callback was called with the correct arguments
    expect(mockSendMessage).toHaveBeenCalledWith('Test message', false, undefined);
  });

  it('handles priority messages correctly', () => {
    render(
      <MessageInput onSendMessage={mockSendMessage} />
    );
    
    // Type in the textarea
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Priority message' } });
    
    // Check the priority checkbox
    const priorityCheckbox = screen.getByRole('checkbox', { name: /mark as priority/i });
    fireEvent.click(priorityCheckbox);
    
    // Click the send button
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Check that the onSendMessage callback was called with priority set to true
    expect(mockSendMessage).toHaveBeenCalledWith('Priority message', true, undefined);
  });

  it('disables the send button when no message is entered', () => {
    render(
      <MessageInput onSendMessage={mockSendMessage} />
    );
    
    // The send button should be disabled initially
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
    
    // Type in the textarea
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    
    // The send button should be enabled now
    expect(sendButton).not.toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(
      <MessageInput onSendMessage={mockSendMessage} />
    );
    
    // Check that the textarea has an aria-label
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-label', 'Message content');
    
    // Check that the send button has an aria-label
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toHaveAttribute('aria-label', 'Send message');
    
    // Check that the priority checkbox has an aria-label
    const priorityCheckbox = screen.getByRole('checkbox');
    expect(priorityCheckbox).toHaveAttribute('aria-label', 'Mark message as priority');
  });
});
