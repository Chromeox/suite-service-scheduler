
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "./types";
import { toast } from "@/hooks/use-toast";
import { addNotificationToCache } from "./cache";

type NotificationHandler = (notification: Notification) => void;

/**
 * Subscribe to real-time notifications for a user
 */
export function subscribeToNotifications(
  userId: string, 
  onNotification: NotificationHandler,
  successFeedback: () => void,
  warningFeedback: () => void
) {
  // Set up subscription to notifications channel
  const channel = supabase
    .channel(`user-notifications-${userId}`)
    .on('broadcast', { event: 'notification' }, (payload) => {
      const newNotification = payload.payload as Notification;
      
      // Call the notification handler
      onNotification(newNotification);
      
      // Show toast for notifications
      if (newNotification.isUrgent) {
        warningFeedback();
        toast({
          title: "🔴 " + newNotification.title,
          description: newNotification.message,
          variant: "destructive",
        });
      } else {
        successFeedback();
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
      
      // Update cache
      addNotificationToCache(newNotification);
    })
    .subscribe();
  
  // Return cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
}
