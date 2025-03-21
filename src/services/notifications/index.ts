
import { supabase } from "@/integrations/supabase/client";
import { NotificationData, CreateNotificationParams, FetchNotificationsParams } from "./types";

/**
 * Fetch notifications for a user from Supabase with pagination support
 * @param userId - The user ID to fetch notifications for
 * @param params - Optional pagination and filtering parameters
 * @returns A promise that resolves to an array of notifications and total count
 */
export async function fetchNotifications(
  userId: string,
  params?: FetchNotificationsParams
): Promise<{ notifications: NotificationData[]; totalCount: number }> {
  // Default pagination values
  const {
    page = 1,
    pageSize = 10,
    filterType,
    filterRead,
    filterUrgent
  } = params || {};

  // Calculate range for pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Start building the query
  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .range(from, to);

  // Apply filters if provided
  if (filterType) {
    query = query.eq('type', filterType);
  }

  if (filterRead !== undefined) {
    query = query.eq('is_read', filterRead);
  }

  if (filterUrgent !== undefined) {
    query = query.eq('is_urgent', filterUrgent);
  }

  // Execute the query
  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
  
  return {
    notifications: (data as NotificationData[]) || [],
    totalCount: count || 0
  };
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
 * @param userId - The user ID to mark notifications as read for
 * @param filterType - Optional notification type to filter by
 */
export async function markAllNotificationsAsRead(
  userId: string,
  filterType?: string
): Promise<void> {
  let query = supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId);
  
  // Apply type filter if provided
  if (filterType) {
    query = query.eq('type', filterType);
  }

  const { error } = await query;

  if (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}

/**
 * Create a new notification in Supabase
 * @param userId - The user ID to create the notification for
 * @param notification - The notification data to create
 * @returns A promise that resolves to the created notification
 */
export async function createNotification(
  userId: string, 
  notification: CreateNotificationParams
): Promise<NotificationData> {
  const newNotification = {
    user_id: userId,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    is_urgent: notification.is_urgent || false,
    source_id: notification.source_id,
    source_type: notification.source_type,
    timestamp: new Date().toISOString(),
    is_read: false,
    created_at: new Date().toISOString()
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
  
  // Cast the type to ensure it matches NotificationData
  return data as NotificationData;
}

/**
 * Count unread notifications for a user
 * @param userId - The user ID to count notifications for
 * @returns A promise that resolves to the count of unread notifications
 */
export async function countUnreadNotifications(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error("Error counting unread notifications:", error);
    throw error;
  }
  
  return count || 0;
}

/**
 * Delete a notification
 * @param notificationId - The ID of the notification to delete
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
}
