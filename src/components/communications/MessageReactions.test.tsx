import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import MessageReactions from './MessageReactions';
import { MessageReaction } from '@/services/chat/types';

describe('MessageReactions', () => {
  const mockAddReaction = vi.fn();
  const messageId = 'test-message-1';
  const currentUserId = 'user-1';
  
  const reactions: MessageReaction[] = [
    {
      id: 'reaction-1',
      message_id: messageId,
      user_id: 'user-2',
      emoji: '👍',
      created_at: '2023-01-01T00:00:00Z',
      user: {
        id: 'user-2',
        name: 'Test User 2',
        avatar: null,
      },
    },
    {
      id: 'reaction-2',
      message_id: messageId,
      user_id: currentUserId,
      emoji: '❤️',
      created_at: '2023-01-01T00:00:00Z',
      user: {
        id: currentUserId,
        name: 'Current User',
        avatar: null,
      },
    },
    {
      id: 'reaction-3',
      message_id: messageId,
      user_id: 'user-3',
      emoji: '❤️',
      created_at: '2023-01-01T00:00:00Z',
      user: {
        id: 'user-3',
        name: 'Test User 3',
        avatar: null,
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in light mode', () => {
    render(
      <MessageReactions
        reactions={reactions}
        messageId={messageId}
        currentUserId={currentUserId}
        onAddReaction={mockAddReaction}
      />
    );
    
    // Check that reaction buttons are rendered
    const thumbsUpButton = screen.getByLabelText('👍 reaction with 1 person');
    expect(thumbsUpButton).toBeInTheDocument();
    
    const heartButton = screen.getByLabelText('❤️ reaction with 2 people');
    expect(heartButton).toBeInTheDocument();
    
    // Check that the add reaction button is rendered
    const addReactionButton = screen.getByLabelText('Add reaction');
    expect(addReactionButton).toBeInTheDocument();
  });

  it('renders correctly in dark mode', () => {
    render(
      <MessageReactions
        reactions={reactions}
        messageId={messageId}
        currentUserId={currentUserId}
        onAddReaction={mockAddReaction}
      />,
      { theme: 'dark' }
    );
    
    // Check that reaction buttons are rendered in dark mode
    const thumbsUpButton = screen.getByLabelText('👍 reaction with 1 person');
    expect(thumbsUpButton).toBeInTheDocument();
  });

  it('highlights reactions from the current user', () => {
    render(
      <MessageReactions
        reactions={reactions}
        messageId={messageId}
        currentUserId={currentUserId}
        onAddReaction={mockAddReaction}
      />
    );
    
    // The heart reaction should be highlighted because the current user reacted with it
    const heartButton = screen.getByLabelText('❤️ reaction with 2 people');
    expect(heartButton).toHaveClass('bg-primary/10');
    expect(heartButton).toHaveClass('text-primary');
    
    // The thumbs up reaction should not be highlighted
    const thumbsUpButton = screen.getByLabelText('👍 reaction with 1 person');
    expect(thumbsUpButton).not.toHaveClass('bg-primary/10');
    expect(thumbsUpButton).not.toHaveClass('text-primary');
  });

  it('calls onAddReaction when a reaction is clicked', () => {
    render(
      <MessageReactions
        reactions={reactions}
        messageId={messageId}
        currentUserId={currentUserId}
        onAddReaction={mockAddReaction}
      />
    );
    
    // Click the thumbs up reaction
    const thumbsUpButton = screen.getByLabelText('👍 reaction with 1 person');
    fireEvent.click(thumbsUpButton);
    
    // Check that onAddReaction was called with the correct arguments
    expect(mockAddReaction).toHaveBeenCalledWith(messageId, '👍');
  });

  it('opens emoji picker when add reaction button is clicked', () => {
    render(
      <MessageReactions
        reactions={reactions}
        messageId={messageId}
        currentUserId={currentUserId}
        onAddReaction={mockAddReaction}
      />
    );
    
    // Click the add reaction button
    const addReactionButton = screen.getByLabelText('Add reaction');
    fireEvent.click(addReactionButton);
    
    // Check that the emoji picker is rendered
    const emojiButtons = screen.getAllByRole('button');
    expect(emojiButtons.length).toBeGreaterThan(3); // At least the 2 reaction buttons + add button + emojis
  });

  it('adds a reaction when an emoji is selected from the picker', () => {
    render(
      <MessageReactions
        reactions={reactions}
        messageId={messageId}
        currentUserId={currentUserId}
        onAddReaction={mockAddReaction}
      />
    );
    
    // Click the add reaction button to open the picker
    const addReactionButton = screen.getByLabelText('Add reaction');
    fireEvent.click(addReactionButton);
    
    // Find and click on an emoji button (e.g., the clap emoji)
    const clapEmojiButton = screen.getByLabelText('Add 👏 reaction');
    fireEvent.click(clapEmojiButton);
    
    // Check that onAddReaction was called with the correct arguments
    expect(mockAddReaction).toHaveBeenCalledWith(messageId, '👏');
  });

  it('has proper accessibility attributes', () => {
    render(
      <MessageReactions
        reactions={reactions}
        messageId={messageId}
        currentUserId={currentUserId}
        onAddReaction={mockAddReaction}
      />
    );
    
    // Check that reaction buttons have proper accessibility attributes
    const thumbsUpButton = screen.getByLabelText('👍 reaction with 1 person');
    expect(thumbsUpButton).toHaveAttribute('role', 'button');
    expect(thumbsUpButton).toHaveAttribute('tabIndex', '0');
    
    // Check that the add reaction button has proper accessibility attributes
    const addReactionButton = screen.getByLabelText('Add reaction');
    expect(addReactionButton).toHaveAttribute('aria-label', 'Add reaction');
  });
});
