
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
import { Notification } from '@/hooks/use-notifications';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 px-1 min-w-5 h-5 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} unread
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
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffMins < 24 * 60) {
    return `${Math.floor(diffMins / 60)}h ago`;
  } else if (diffMins < 7 * 24 * 60) {
    return `${Math.floor(diffMins / (24 * 60))}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// Helper function to get avatar color based on notification type
function getAvatarColor(type: string): string {
  switch (type) {
    case 'success':
      return 'bg-green-500 text-white';
    case 'warning':
      return 'bg-yellow-500 text-white';
    case 'error':
      return 'bg-red-500 text-white';
    default:
      return 'bg-blue-500 text-white';
  }
}

// Helper function to get icon based on notification source
function getTypeIcon(notification: Notification): string {
  switch (notification.sourceType) {
    case 'message':
      return 'M';
    case 'order':
      return 'O';
    default:
      return 'S';
  }
}
