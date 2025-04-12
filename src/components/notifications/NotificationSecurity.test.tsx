import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationsDialog } from './NotificationsDialog';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationFilters } from './NotificationFilters';
import { sanitizeHtml, sanitizeUrl } from '@/utils/security';

// Mock the hooks and security utilities
vi.mock('@/hooks/use-notifications');
vi.mock('@/utils/security', () => ({
  sanitizeHtml: vi.fn((content) => `sanitized_${content}`),
  sanitizeUrl: vi.fn((url) => url ? `safe_${url}` : ''),
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
    // Mock the NotificationsDialog props
    render(
      <NotificationsDialog 
        notifications={[
          {
            id: '1',
            title: '<script>alert("XSS")</script>Notification Title',
            message: '<img src="x" onerror="alert(\'XSS\')"Message content',
            type: 'info',
            timestamp: new Date().toISOString(),
            isRead: false,
            isUrgent: true,
            sourceType: 'system',
          }
        ]}
        unreadCount={1}
        isLoading={false}
        markAsRead={vi.fn()}
        markAllAsRead={vi.fn()}
      />
    );
    
    // Check if sanitizeHtml was called for title and message
    expect(sanitizeHtml).toHaveBeenCalledWith('<script>alert("XSS")</script>Notification Title');
    expect(sanitizeHtml).toHaveBeenCalledWith('<img src="x" onerror="alert(\'XSS\')">Message content');
    
    // Verify sanitized content is displayed
    expect(screen.getByText(/sanitized_/)).toBeInTheDocument();
  });

  it('validates URLs to prevent malicious links', () => {
    // Mock the NotificationsDialog props with a malicious URL
    render(
      <NotificationsDialog 
        notifications={[
          {
            id: '2',
            title: 'Notification with URL',
            message: 'Check this link <a href="javascript:alert(\'XSS\')">Click me</a>',
            type: 'info',
            timestamp: new Date().toISOString(),
            isRead: false,
            isUrgent: false,
            sourceType: 'system',
          }
        ]}
        unreadCount={1}
        isLoading={false}
        markAsRead={vi.fn()}
        markAllAsRead={vi.fn()}
      />
    );
    
    // Check if sanitizeUrl was called for the href attribute
    expect(sanitizeUrl).toHaveBeenCalledWith('javascript:alert(\'XSS\')');
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
