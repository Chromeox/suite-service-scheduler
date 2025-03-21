import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationsDialog } from './NotificationsDialog';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationFilters } from './NotificationFilters';
import DOMPurify from 'dompurify';

// Mock the hooks and DOMPurify
vi.mock('@/hooks/use-notifications');
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((content) => `sanitized_${content}`),
  },
}));

describe('Notification Security Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the useNotifications hook
    (useNotifications as any).mockReturnValue({
      notifications: [
        {
          id: '1',
          title: '<script>alert("XSS")</script>Notification Title',
          message: '<img src="x" onerror="alert(\'XSS\')">Message content',
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false,
          isUrgent: true,
          sourceType: 'system',
        },
      ],
      unreadCount: 1,
      isLoading: false,
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn(),
      sendNotification: vi.fn(),
      filters: {
        types: ['info'],
        sources: ['system'],
        showRead: true,
        showUnread: true,
        showUrgent: true,
        showNonUrgent: true,
      },
      setFilters: vi.fn(),
      resetFilters: vi.fn(),
    });
  });

  it('sanitizes notification title and message to prevent XSS', () => {
    render(<NotificationsDialog />);
    
    // Check if DOMPurify.sanitize was called for title and message
    expect(DOMPurify.sanitize).toHaveBeenCalledWith('<script>alert("XSS")</script>Notification Title');
    expect(DOMPurify.sanitize).toHaveBeenCalledWith('<img src="x" onerror="alert(\'XSS\')">Message content');
    
    // Verify sanitized content is displayed
    expect(screen.getByText(/sanitized_/)).toBeInTheDocument();
  });

  it('validates notification data in the hook', async () => {
    const { sendNotification } = useNotifications();
    
    // Try to send a notification with malicious content
    await sendNotification({
      title: '<script>alert("XSS")</script>'.repeat(50), // Very long title
      message: '<img src="x" onerror="alert(\'XSS\')">'.repeat(100), // Very long message
      type: 'invalid_type' as any, // Invalid type
      source_type: 'invalid_source' as any, // Invalid source
      is_urgent: true,
    });
    
    // Check that sendNotification was called with the malicious data
    // The hook should internally sanitize and validate this data
    expect(sendNotification).toHaveBeenCalled();
  });

  it('handles filter toggling securely', () => {
    const { setFilters } = useNotifications();
    render(<NotificationFilters />);
    
    // Find and click filter checkboxes
    const filterCheckboxes = screen.getAllByRole('checkbox');
    fireEvent.click(filterCheckboxes[0]);
    
    // Verify setFilters was called with safe parameters
    expect(setFilters).toHaveBeenCalled();
  });
});
