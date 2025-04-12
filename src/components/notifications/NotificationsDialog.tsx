import React, { useMemo, useCallback, memo, useState, useRef } from 'react';
// Using enhanced security utilities instead of direct DOMPurify import
import { sanitizeHtml, sanitizeUrl } from '@/utils/security';
import { Bell, BellOff, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Notification, NotificationType, NotificationSourceType } from '@/services/notifications/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NotificationBadge } from './NotificationBadge';
import { useVirtualizedList } from '@/hooks/use-virtualized-list';
import { useMemoizedCallback } from '@/hooks/use-memoized-callback';
import { NotificationFilters, NotificationFilterOptions } from './NotificationFilters';

interface NotificationsDialogProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading?: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

// Time constants for better performance
const MINUTE_IN_SECONDS = 60;
const HOUR_IN_SECONDS = 3600;
const DAY_IN_SECONDS = 86400;

/**
 * Map notification types to avatar colors for better performance
 * Using a constant map instead of a switch statement
 */
const AVATAR_COLORS: Record<NotificationType, string> = {
  info: 'bg-blue-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-500 text-white'
};

/**
 * Get avatar color based on notification type
 * Inlined for better performance
 */
const getAvatarColor = (type: NotificationType): string => AVATAR_COLORS[type];

// Map source types to icons for better performance
const SOURCE_TYPE_ICONS: Record<NotificationSourceType | 'default', string> = {
  message: 'M',
  order: 'O',
  system: 'S',
  default: 'N'
};

/**
 * Format a timestamp into a human-readable relative time
 * Memoized for better performance
 */
const formatNotificationTime = (() => {
  // Cache for memoization
  const cache = new Map<string, string>();
  // Constants for time calculations
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  
  // Clear cache periodically to prevent memory leaks
  setInterval(() => cache.clear(), 15 * MINUTE);
  
  return function(timestamp: string): string {
    // Return cached result if available and less than a minute old
    if (cache.has(timestamp)) {
      return cache.get(timestamp)!;
    }
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      
      let result: string;
      if (diffMs < MINUTE) {
        result = 'Just now';
      } else if (diffMs < HOUR) {
        const mins = Math.floor(diffMs / MINUTE);
        result = `${mins}m ago`;
      } else if (diffMs < DAY) {
        const hours = Math.floor(diffMs / HOUR);
        result = `${hours}h ago`;
      } else if (diffMs < WEEK) {
        const days = Math.floor(diffMs / DAY);
        result = `${days}d ago`;
      } else {
        result = date.toLocaleDateString();
      }
      
      // Cache the result
      cache.set(timestamp, result);
      return result;
    } catch (error) {
      console.error('Error formatting notification time:', error);
      return 'Unknown time';
    }
  };
})();

// Optimized helper function to get icon based on notification source
function getTypeIcon(notification: Notification): string {
  return notification.sourceType && notification.sourceType in SOURCE_TYPE_ICONS 
    ? SOURCE_TYPE_ICONS[notification.sourceType as NotificationSourceType] 
    : SOURCE_TYPE_ICONS.default;
}

// Memoized notification item component to prevent unnecessary re-renders
interface NotificationItemProps {
  notification: Notification;
  markAsRead: (id: string) => void;
}

const NotificationItem = memo(function NotificationItem({ 
  notification, 
  markAsRead 
}: NotificationItemProps) {
  const handleMarkAsRead = useCallback(() => {
    markAsRead(notification.id);
  }, [notification.id, markAsRead]);

  return (
    <div 
      className={`flex p-3 rounded-md transition-colors ${
        notification.isRead ? 'bg-background' : 'bg-muted/50'
      } ${notification.isUrgent ? 'border-l-2 border-red-500' : ''}`}
    >
      <Avatar className={`h-9 w-9 mr-3 ${getAvatarColor(notification.type)}`}>
        <AvatarFallback>{getTypeIcon(notification)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className={`text-sm font-medium ${notification.isUrgent ? 'text-red-500' : ''}`}>
            {/* Sanitize title to prevent XSS */}
            {typeof notification.title === 'string' ? sanitizeHtml(notification.title) : ''}
            {notification.isUrgent && (
              <Badge variant="destructive" className="ml-2">
                Urgent
              </Badge>
            )}
          </h4>
          <span className="text-xs text-muted-foreground">
            {formatNotificationTime(notification.timestamp)}
          </span>
        </div>
        <p className="text-sm mt-1 text-muted-foreground">
          {/* Sanitize message to prevent XSS */}
          {typeof notification.message === 'string' ? sanitizeHtml(notification.message) : ''}
        </p>
        <div className="flex justify-end mt-2">
          {!notification.isRead ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs" 
              onClick={handleMarkAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark as read
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center">
              <CheckCheck className="h-3 w-3 mr-1" />
              Read
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

// Virtualized list component for better performance with large notification lists
const VirtualizedNotificationList = memo(({ 
  notifications, 
  markAsRead 
}: { 
  notifications: Notification[]; 
  markAsRead: (id: string) => void 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use virtualized list hook to only render visible notifications
  const { visibleItems, totalHeight } = useVirtualizedList(
    notifications.length,
    containerRef as React.RefObject<HTMLElement>,
    { itemHeight: 100, overscan: 2 }
  );
  
  // Memoize the mark as read handler to prevent unnecessary re-renders
  const handleMarkAsRead = useMemoizedCallback(markAsRead, [markAsRead]);
  
  return (
    <div 
      ref={containerRef} 
      className="space-y-4 py-2 relative"
      style={{ height: '60vh', overflowY: 'auto' }}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        {visibleItems.map(index => {
          const notification = notifications[index];
          return (
            <div 
              key={notification.id}
              style={{
                position: 'absolute',
                top: `${index * 100}px`,
                width: '100%'
              }}
            >
              <NotificationItem 
                notification={notification} 
                markAsRead={handleMarkAsRead} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

// Optimized main component
/**
 * Optimized NotificationsDialog component with memoization
 */
export const NotificationsDialog = memo(function NotificationsDialog({
  notifications,
  unreadCount,
  isLoading = false,
  markAsRead,
  markAllAsRead,
}: NotificationsDialogProps) {
  // State for filters
  const [filters, setFilters] = useState<NotificationFilterOptions>({
    types: ['info', 'success', 'warning', 'error'],
    sources: ['message', 'order', 'system'],
    showRead: true,
    showUnread: true,
    showUrgent: true,
    showNonUrgent: true
  });
  
  // Check if any filters are active (not showing everything)
  const isFilterActive = useMemo(() => {
    return (
      filters.types.length < 4 || 
      filters.sources.length < 3 || 
      !filters.showRead || 
      !filters.showUnread || 
      !filters.showUrgent || 
      !filters.showNonUrgent
    );
  }, [filters]);
  
  // Handle filter changes with memoized callback to prevent unnecessary re-renders
  const handleFilterChange = useMemoizedCallback((newFilters: NotificationFilterOptions) => {
    setFilters(newFilters);
  }, []);
  
  // Reset filters to show everything - memoized to prevent unnecessary re-renders
  const resetFilters = useMemoizedCallback(() => {
    setFilters({
      types: ['info', 'success', 'warning', 'error'],
      sources: ['message', 'order', 'system'],
      showRead: true,
      showUnread: true,
      showUrgent: true,
      showNonUrgent: true
    });
  }, []);
  
  // Apply filters to notifications with optimized filtering logic
  const filteredNotifications = useMemo(() => {
    // Create filter predicates based on current filter state
    const typeFilter = new Set(filters.types);
    const sourceFilter = new Set(filters.sources);
    
    // Use a single pass through the array for better performance
    return notifications.filter(notification => {
      // Short-circuit evaluation for better performance
      return (
        // Type filter
        typeFilter.has(notification.type) &&
        // Source filter (if sourceType exists)
        (!notification.sourceType || sourceFilter.has(notification.sourceType)) &&
        // Read status filter
        ((notification.isRead && filters.showRead) || (!notification.isRead && filters.showUnread)) &&
        // Urgency filter
        ((notification.isUrgent && filters.showUrgent) || (!notification.isUrgent && filters.showNonUrgent))
      );
    });
  }, [notifications, filters]);
  // Memoize the notification list to prevent unnecessary re-renders
  const notificationsList = useMemo(() => {
    if (isLoading) {
      return (
        <div className="py-6 text-center text-muted-foreground">Loading...</div>
      );
    }
    
    if (filteredNotifications.length === 0) {
      return (
        <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
          <BellOff className="h-8 w-8 mb-2 opacity-50" />
          <p>
            {notifications.length === 0
              ? "No notifications at this time"
              : isFilterActive
              ? "No notifications match your filters"
              : "No notifications at this time"}
          </p>
          {isFilterActive && notifications.length > 0 && (
            <Button 
              variant="link" 
              size="sm" 
              className="mt-2"
              onClick={resetFilters}
            >
              Reset filters
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-4 py-2">
        {filteredNotifications.map((notification) => (
          <NotificationItem 
            key={notification.id}
            notification={notification}
            markAsRead={markAsRead}
          />
        ))}
      </div>
    );
  }, [filteredNotifications, isLoading, markAsRead]);
  
  // Memoize the dialog trigger to prevent unnecessary re-renders
  const dialogTrigger = useMemo(() => (
    <DialogTrigger asChild>
      <Button variant="outline" size="icon" className="relative">
        <Bell className="h-[1.2rem] w-[1.2rem]" />
        <NotificationBadge count={unreadCount} />
      </Button>
    </DialogTrigger>
  ), [unreadCount]);
  
  return (
    <Dialog>
      {dialogTrigger}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} {unreadCount === 1 ? 'notification' : 'notifications'}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            <span>Stay updated with important messages and alerts</span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex items-center gap-1" 
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-3 w-3" />
                  Mark all as read
                </Button>
              )}
              <NotificationFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
                isActive={isFilterActive}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] overflow-y-auto">
          <div className="p-4">
            {notificationsList}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});


