
import { supabase } from "@/integrations/supabase/client";
import { NotificationData, CreateNotificationParams } from "./types";

/**
 * Fetch notifications for a user from Supabase
 */
export async function fetchNotifications(userId: string): Promise<NotificationData[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
  
  return data || [];
}

/**
 * Mark a notification as read in Supabase
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

/**
 * Mark all notifications for a user as read
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}

/**
 * Create a new notification in Supabase
 */
export async function createNotification(userId: string, notification: CreateNotificationParams): Promise<NotificationData> {
  const newNotification = {
    user_id: userId,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    is_urgent: notification.is_urgent || false,
    source_id: notification.source_id,
    source_type: notification.source_type,
    timestamp: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('notifications')
    .insert(newNotification)
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
  
  return data;
}
