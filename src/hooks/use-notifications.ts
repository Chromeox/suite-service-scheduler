import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useNetworkStatus } from "@/hooks/use-network";
import { supabase } from "@/integrations/supabase/client";
import { useHapticFeedback } from "@/hooks/use-haptics";
import { NotificationData, CreateNotificationParams } from "@/services/notifications/types";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  isRead: boolean;
  isUrgent: boolean;
  sourceId?: string;
  sourceType?: "message" | "order" | "system";
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isOnline } = useNetworkStatus();
  const { successFeedback, warningFeedback } = useHapticFeedback();

  // Local storage keys
  const NOTIFICATIONS_CACHE_KEY = "suitesync_notifications_cache";

  // Convert from database format to internal format
  const mapDbNotificationToNotification = (dbNotification: NotificationData): Notification => ({
    id: dbNotification.id,
    title: dbNotification.title,
    message: dbNotification.message,
    type: dbNotification.type,
    timestamp: dbNotification.timestamp,
    isRead: dbNotification.is_read,
    isUrgent: dbNotification.is_urgent,
    sourceId: dbNotification.source_id,
    sourceType: dbNotification.source_type,
  });

  // Load notifications from cache or fetch from server
  useEffect(() => {
    const loadNotifications = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // First load from cache to show something immediately
      const cachedData = localStorage.getItem(NOTIFICATIONS_CACHE_KEY);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData) as Notification[];
          setNotifications(parsed);
          setUnreadCount(parsed.filter(n => !n.isRead).length);
        } catch (e) {
          console.error("Error parsing cached notifications:", e);
        }
      }

      // If online, fetch fresh data
      if (isOnline) {
        try {
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false });

          if (error) throw error;
          
          if (data) {
            const formattedNotifications = data.map(mapDbNotificationToNotification);
            
            setNotifications(formattedNotifications);
            setUnreadCount(formattedNotifications.filter(n => !n.isRead).length);
            
            // Update cache
            localStorage.setItem(NOTIFICATIONS_CACHE_KEY, JSON.stringify(formattedNotifications));
          }
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
    
    // Set up subscription to notifications channel
    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on('broadcast', { event: 'notification' }, (payload) => {
        const newNotification = payload.payload as Notification;
        
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
        const cachedData = localStorage.getItem(NOTIFICATIONS_CACHE_KEY);
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData) as Notification[];
            localStorage.setItem(
              NOTIFICATIONS_CACHE_KEY, 
              JSON.stringify([newNotification, ...parsed])
            );
          } catch (e) {
            console.error("Error updating cached notifications:", e);
          }
        }
      })
      .subscribe();
    
    // Cleanup channel subscription
    return () => {
      supabase.removeChannel(channel);
    };
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
    const cachedData = localStorage.getItem(NOTIFICATIONS_CACHE_KEY);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData) as Notification[];
        localStorage.setItem(
          NOTIFICATIONS_CACHE_KEY, 
          JSON.stringify(parsed.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          ))
        );
      } catch (e) {
        console.error("Error updating cached notifications:", e);
      }
    }
    
    // If online, update in database
    if (isOnline && userId) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notificationId);
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
    const cachedData = localStorage.getItem(NOTIFICATIONS_CACHE_KEY);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData) as Notification[];
        localStorage.setItem(
          NOTIFICATIONS_CACHE_KEY, 
          JSON.stringify(parsed.map(n => ({ ...n, isRead: true })))
        );
      } catch (e) {
        console.error("Error updating cached notifications:", e);
      }
    }
    
    // If online, update in database
    if (isOnline && userId) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', userId);
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
      }
    }
  };

  // Send a notification (for testing)
  const sendNotification = async (notification: CreateNotificationParams) => {
    if (!userId) return;
    
    const newDbNotification = {
      user_id: userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      is_urgent: notification.is_urgent || false,
      source_id: notification.source_id,
      source_type: notification.source_type
    };
    
    // If online, save to database first to get the ID
    if (isOnline) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .insert(newDbNotification)
          .select()
          .single();

        if (error) throw error;
        
        if (data) {
          const newNotification = mapDbNotificationToNotification(data);
          
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
          const cachedData = localStorage.getItem(NOTIFICATIONS_CACHE_KEY);
          if (cachedData) {
            try {
              const parsed = JSON.parse(cachedData) as Notification[];
              localStorage.setItem(
                NOTIFICATIONS_CACHE_KEY, 
                JSON.stringify([newNotification, ...parsed])
              );
            } catch (e) {
              console.error("Error updating cached notifications:", e);
            }
          }
        }
      } catch (error) {
        console.error("Error saving notification:", error);
      }
    } else {
      // If offline, create with a temporary ID
      const tempNotification: Notification = {
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
      setNotifications(prev => [tempNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast for urgent notifications
      if (tempNotification.isUrgent) {
        warningFeedback();
        toast({
          title: "🔴 " + tempNotification.title,
          description: tempNotification.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: tempNotification.title,
          description: tempNotification.message,
        });
      }
      
      // Update cache
      const cachedData = localStorage.getItem(NOTIFICATIONS_CACHE_KEY);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData) as Notification[];
          localStorage.setItem(
            NOTIFICATIONS_CACHE_KEY, 
            JSON.stringify([tempNotification, ...parsed])
          );
        } catch (e) {
          console.error("Error updating cached notifications:", e);
        }
      }
    }
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
