
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "./types";
import { toast } from "@/hooks/use-toast";
import { addNotificationToCache } from "./cache";
import { RealtimeChannel } from "@supabase/supabase-js";

type NotificationHandler = (notification: Notification) => void;
type NotificationType = "info" | "success" | "warning" | "error";

/**
 * Type guard to validate if a payload is a valid Notification
 */
function isValidNotification(payload: unknown): payload is Notification {
  if (!payload || typeof payload !== 'object') return false;
  
  const notification = payload as Partial<Notification>;
  const validTypes: NotificationType[] = ['info', 'success', 'warning', 'error'];
  
  return (
    typeof notification.id === 'string' &&
    typeof notification.title === 'string' &&
    typeof notification.message === 'string' &&
    validTypes.includes(notification.type as NotificationType) &&
    typeof notification.isRead === 'boolean'
  );
}

/**
 * Subscribe to real-time notifications for a user
 * @param userId - The ID of the user to subscribe to notifications for
 * @param onNotification - Callback function to handle new notifications
 * @param successFeedback - Callback function for success feedback
 * @param warningFeedback - Callback function for warning feedback
 * @returns A cleanup function to unsubscribe from notifications
 */
/**
 * Subscribe to real-time notifications for a user
 * @param userId - The ID of the user to subscribe to notifications for
 * @param onNotification - Callback function to handle new notifications
 * @param successFeedback - Callback function for success feedback
 * @param warningFeedback - Callback function for warning feedback
 * @returns A cleanup function to unsubscribe from notifications
 */
export function subscribeToNotifications(
  userId: string, 
  onNotification: NotificationHandler,
  successFeedback: () => void,
  warningFeedback: () => void
): () => void {
  // Set up subscription to notifications channel
  const channel: RealtimeChannel = supabase
    .channel(`user-notifications-${userId}`)
    .on('broadcast', { event: 'notification' }, (payload) => {
      try {
        // Validate the notification payload
        if (!isValidNotification(payload.payload)) {
          console.error('Invalid notification payload:', payload.payload);
          return;
        }
        
        const newNotification: Notification = payload.payload;
        
        // Call the notification handler
        onNotification(newNotification);
        
        // Show toast and update cache
        handleNewNotification(newNotification, successFeedback, warningFeedback);
      } catch (error) {
        console.error('Error processing notification:', error);
      }
    })
    .subscribe();
  
  // Return cleanup function
  return () => supabase.removeChannel(channel);
}

/**
 * Handle a new notification by showing a toast and updating the cache
 */
function handleNewNotification(
  notification: Notification,
  successFeedback: () => void,
  warningFeedback: () => void
): void {
  // Show toast for notifications
  if (notification.isUrgent) {
    warningFeedback();
    toast({
      title: "🔴 " + notification.title,
      description: notification.message,
      variant: "destructive",
    });
  } else {
    successFeedback();
    toast({
      title: notification.title,
      description: notification.message,
    });
  }
  
  // Update cache
  addNotificationToCache(notification);
}
