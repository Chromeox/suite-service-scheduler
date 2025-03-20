
import { NotificationData, Notification } from "./types";

/**
 * Convert from database format to internal format
 */
export function mapDbNotificationToInternal(dbNotification: NotificationData): Notification {
  return {
    id: dbNotification.id,
    title: dbNotification.title,
    message: dbNotification.message,
    type: dbNotification.type,
    timestamp: dbNotification.timestamp,
    isRead: dbNotification.is_read,
    isUrgent: dbNotification.is_urgent,
    sourceId: dbNotification.source_id,
    sourceType: dbNotification.source_type,
  };
}
