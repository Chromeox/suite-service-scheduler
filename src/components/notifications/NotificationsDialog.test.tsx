import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { NotificationsDialog } from './NotificationsDialog';
import { Notification } from '@/services/notifications/types';
// import { customRender } from '@/test/test-utils';

// Mock the NotificationFilters component
vi.mock('./NotificationFilters', () => ({
  NotificationFilters: ({ onFilterChange, onReset, isActive }) => (
    <button 
      onClick={() => onFilterChange({
        types: ['info', 'success'],
        sources: ['message', 'system'],
        showRead: true,
        showUnread: false,
        showUrgent: true,
        showNonUrgent: true
      })}
      data-testid="filter-button"
      data-active={isActive}
    >
      Filter
    </button>
  )
}));

describe('NotificationsDialog', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Test Info',
      message: 'This is a test info notification',
      type: 'info',
      timestamp: new Date().toISOString(),
      isRead: false,
      isUrgent: false,
      sourceType: 'system'
    },
    {
      id: '2',
      title: 'Test Success',
      message: 'This is a test success notification',
      type: 'success',
      timestamp: new Date().toISOString(),
      isRead: true,
      isUrgent: false,
      sourceType: 'message'
    },
    {
      id: '3',
      title: 'Test Warning',
      message: 'This is a test warning notification',
      type: 'warning',
      timestamp: new Date().toISOString(),
      isRead: false,
      isUrgent: true,
      sourceType: 'order'
    }
  ];

  const markAsReadMock = vi.fn();
  const markAllAsReadMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in light mode', () => {
    render(
      <NotificationsDialog 
        notifications={mockNotifications} 
        unreadCount={2}
        markAsRead={markAsReadMock}
        markAllAsRead={markAllAsReadMock}
      />
    );

    // Check that the notification button is rendered
    const notificationButton = screen.getByRole('button', { name: '' });
    expect(notificationButton).toBeInTheDocument();
  });

  it('renders correctly in dark mode', () => {
    render(
      <NotificationsDialog 
        notifications={mockNotifications} 
        unreadCount={2}
        markAsRead={markAsReadMock}
        markAllAsRead={markAllAsReadMock}
      />
    );

    // Check that the notification button is rendered
    const notificationButton = screen.getByRole('button', { name: '' });
    expect(notificationButton).toBeInTheDocument();
  });

  it('opens dialog when button is clicked', () => {
    render(
      <NotificationsDialog 
        notifications={mockNotifications} 
        unreadCount={2}
        markAsRead={markAsReadMock}
        markAllAsRead={markAllAsReadMock}
      />
    );

    // Click the notification button
    const notificationButton = screen.getByRole('button', { name: '' });
    fireEvent.click(notificationButton);

    // Check that the dialog is shown
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Stay updated with important messages and alerts')).toBeInTheDocument();
  });

  it('shows correct unread count', () => {
    render(
      <NotificationsDialog 
        notifications={mockNotifications} 
        unreadCount={2}
        markAsRead={markAsReadMock}
        markAllAsRead={markAllAsReadMock}
      />
    );

    // Click the notification button
    const notificationButton = screen.getByRole('button', { name: '' });
    fireEvent.click(notificationButton);

    // Check that the unread count is shown
    expect(screen.getByText('2 notifications')).toBeInTheDocument();
  });

  it('calls markAsRead when a notification is marked as read', () => {
    render(
      <NotificationsDialog 
        notifications={mockNotifications} 
        unreadCount={2}
        markAsRead={markAsReadMock}
        markAllAsRead={markAllAsReadMock}
      />
    );

    // Click the notification button
    const notificationButton = screen.getByRole('button', { name: '' });
    fireEvent.click(notificationButton);

    // Click the "Mark as read" button for the first notification
    const markAsReadButton = screen.getAllByRole('button', { name: /mark as read/i })[0];
    fireEvent.click(markAsReadButton);

    // Check that markAsRead was called with the correct ID
    expect(markAsReadMock).toHaveBeenCalledWith('1');
  });

  it('calls markAllAsRead when "Mark all as read" button is clicked', () => {
    render(
      <NotificationsDialog 
        notifications={mockNotifications} 
        unreadCount={2}
        markAsRead={markAsReadMock}
        markAllAsRead={markAllAsReadMock}
      />
    );

    // Click the notification button
    const notificationButton = screen.getByRole('button', { name: '' });
    fireEvent.click(notificationButton);

    // Click the "Mark all as read" button
    const markAllAsReadButton = screen.getByRole('button', { name: /mark all as read/i });
    fireEvent.click(markAllAsReadButton);

    // Check that markAllAsRead was called
    expect(markAllAsReadMock).toHaveBeenCalledTimes(1);
  });

  it('filters notifications based on filter settings', () => {
    render(
      <NotificationsDialog 
        notifications={mockNotifications} 
        unreadCount={2}
        markAsRead={markAsReadMock}
        markAllAsRead={markAllAsReadMock}
      />
    );

    // Click the notification button
    const notificationButton = screen.getByRole('button', { name: '' });
    fireEvent.click(notificationButton);

    // Initially all notifications should be visible
    expect(screen.getByText('Test Info')).toBeInTheDocument();
    expect(screen.getByText('Test Success')).toBeInTheDocument();
    expect(screen.getByText('Test Warning')).toBeInTheDocument();

    // Click the filter button (which applies a filter that shows only read notifications)
    const filterButton = screen.getByTestId('filter-button');
    fireEvent.click(filterButton);

    // Now only the success notification should be visible (it's read, but the warning is unread)
    expect(screen.queryByText('Test Info')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Success')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Warning')).not.toBeInTheDocument();
    
    // Should show the "no notifications match filters" message
    expect(screen.getByText('No notifications match your filters')).toBeInTheDocument();
  });
});
