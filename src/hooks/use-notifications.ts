import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useNetworkStatus } from "@/hooks/use-network";
import { useHapticFeedback } from "@/hooks/use-haptics";
import { Notification, CreateNotificationParams } from "@/services/notifications/types";
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  createNotification 
} from "@/services/notifications";
import { 
  getNotificationsFromCache, 
  saveNotificationsToCache, 
  updateNotificationInCache, 
  addNotificationToCache 
} from "@/services/notifications/cache";
import { subscribeToNotifications } from "@/services/notifications/subscription";
import { mapDbNotificationToInternal } from "@/services/notifications/mappers";

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isOnline } = useNetworkStatus();
  const { successFeedback, warningFeedback } = useHapticFeedback();

  // Load notifications from cache or fetch from server
  useEffect(() => {
    const loadNotifications = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // First load from cache to show something immediately
      const cachedData = getNotificationsFromCache();
      if (cachedData) {
        setNotifications(cachedData);
        setUnreadCount(cachedData.filter(n => !n.isRead).length);
      }

      // If online, fetch fresh data
      if (isOnline) {
        try {
          // For demo purposes, use mock data instead of real API calls
          // This prevents errors when Supabase is not properly set up
          const mockNotifications: Notification[] = [
            {
              id: "1",
              title: "Welcome to SuiteSync",
              message: "Thank you for using our service scheduler!",
              type: "info",
              timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
              isRead: false,
              isUrgent: false,
              sourceType: "system"
            },
            {
              id: "2",
              title: "New Order",
              message: "Suite 203 placed a beverage order",
              type: "success",
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              isRead: false,
              isUrgent: true,
              sourceId: "203",
              sourceType: "order"
            }
          ];
          
          setNotifications(mockNotifications);
          setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
          
          // Update cache
          saveNotificationsToCache(mockNotifications);
          
          /* Commented out real API call to prevent errors
          const data = await fetchNotifications(userId);
          
          if (data) {
            const formattedNotifications = data.notifications.map(mapDbNotificationToInternal);
            
            setNotifications(formattedNotifications);
            setUnreadCount(formattedNotifications.filter(n => !n.isRead).length);
            
            // Update cache
            saveNotificationsToCache(formattedNotifications);
          }
          */
        } catch (error) {
          console.error("Error fetching notifications:", error);
          // We'll keep using the cached data if fetching fails
        }
      }
      
      setIsLoading(false);
    };

    loadNotifications();
  }, [userId, isOnline]);

  // Setup real-time notifications
  useEffect(() => {
    if (!userId || !isOnline) return;
    
    const cleanupSubscription = subscribeToNotifications(
      userId,
      (newNotification) => {
        // Add to state and update unread count
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      },
      successFeedback,
      warningFeedback
    );
    
    // Cleanup subscription
    return cleanupSubscription;
  }, [userId, isOnline, successFeedback, warningFeedback]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Update cache
    updateNotificationInCache(notificationId, { isRead: true });
    
    // If online, update in database
    if (isOnline && userId) {
      try {
        await markNotificationAsRead(notificationId);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
    
    setUnreadCount(0);
    
    // Update cache
    const cachedData = getNotificationsFromCache();
    if (cachedData) {
      saveNotificationsToCache(cachedData.map(n => ({ ...n, isRead: true })));
    }
    
    // If online, update in database
    if (isOnline && userId) {
      try {
        await markAllNotificationsAsRead(userId);
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
      }
    }
  };

  // Send a notification (for testing)
  const sendNotification = async (notification: CreateNotificationParams) => {
    if (!userId) return;
    
    // For demo purposes, always use the mock approach instead of real API calls
    // This prevents errors when Supabase is not properly set up
    try {
      // Create a mock notification with a random ID
      const newNotification: Notification = {
        id: Math.random().toString(36).substring(2, 11),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        timestamp: new Date().toISOString(),
        isRead: false,
        isUrgent: notification.is_urgent || false,
        sourceId: notification.source_id,
        sourceType: notification.source_type
      };
      
      // Add to state and update unread count
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast for urgent notifications
      if (newNotification.isUrgent) {
        warningFeedback?.();
        toast({
          title: "🔴 " + newNotification.title,
          description: newNotification.message,
          variant: "destructive",
        });
      } else {
        successFeedback?.();
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
      
      // Update cache
      addNotificationToCache(newNotification);
      
    } catch (error) {
      console.error("Error creating notification:", error);
    }
    
    /* Commented out real API implementation to prevent errors
    // If online, save to database first to get the ID
    if (isOnline) {
      try {
        const data = await createNotification(userId, notification);
        
        if (data) {
          const newNotification = mapDbNotificationToInternal(data);
          
          // Add to state and update unread count
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for urgent notifications
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
        }
      } catch (error) {
        console.error("Error saving notification:", error);
      }
    }
    */
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    sendNotification
  };
}
