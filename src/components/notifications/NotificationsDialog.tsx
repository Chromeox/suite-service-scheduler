
import React from 'react';
import { Bell, BellOff, Check, CheckCheck, Trash } from 'lucide-react';
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
import { Notification } from '@/services/notifications/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NotificationBadge } from './NotificationBadge';

interface NotificationsDialogProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading?: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export function NotificationsDialog({
  notifications,
  unreadCount,
  isLoading = false,
  markAsRead,
  markAllAsRead,
}: NotificationsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <NotificationBadge count={unreadCount} />
        </Button>
      </DialogTrigger>
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
          <DialogDescription className="flex justify-between">
            <span>Stay updated with important messages and alerts</span>
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
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-6 text-center text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
              <BellOff className="h-8 w-8 mb-2 opacity-50" />
              <p>No notifications at this time</p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
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
                        {notification.title}
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
                    <p className="text-sm mt-1 text-muted-foreground">{notification.message}</p>
                    <div className="flex justify-end mt-2">
                      {!notification.isRead ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => markAsRead(notification.id)}
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
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to format timestamp
function formatNotificationTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const HOUR = 60;
  const DAY = HOUR * 24;
  const WEEK = DAY * 7;
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < HOUR) return `${diffMins}m ago`;
  if (diffMins < DAY) return `${Math.floor(diffMins / HOUR)}h ago`;
  if (diffMins < WEEK) return `${Math.floor(diffMins / DAY)}d ago`;
  return date.toLocaleDateString();
}

// Map notification types to avatar colors for better performance
const AVATAR_COLORS: Record<"info" | "success" | "warning" | "error", string> = {
  info: 'bg-blue-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-500 text-white'
};

// Helper function to get avatar color based on notification type
function getAvatarColor(type: "info" | "success" | "warning" | "error"): string {
  return AVATAR_COLORS[type];
}

// Map source types to icons for better performance
const SOURCE_TYPE_ICONS: Record<string, string> = {
  message: 'M',
  order: 'O',
  system: 'S'
};

// Helper function to get icon based on notification source
function getTypeIcon(notification: Notification): string {
  return notification.sourceType ? SOURCE_TYPE_ICONS[notification.sourceType] : 'S';
}
