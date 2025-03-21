
import { Notification } from "./types";

// Local storage key
const NOTIFICATIONS_CACHE_KEY = "suitesync_notifications_cache";
type NotificationType = "info" | "success" | "warning" | "error";

/**
 * Type guard to validate if parsed data is an array of Notifications
 */
function isNotificationArray(data: unknown): data is Notification[] {
  if (!Array.isArray(data)) return false;
  
  const validTypes: NotificationType[] = ['info', 'success', 'warning', 'error'];
  
  return data.every(item => {
    if (!item || typeof item !== 'object') return false;
    
    const notification = item as Partial<Notification>;
    return (
      typeof notification.id === 'string' &&
      typeof notification.title === 'string' &&
      typeof notification.message === 'string' &&
      validTypes.includes(notification.type as NotificationType) &&
      typeof notification.isRead === 'boolean'
    );
  });
}

/**
 * Load notifications from cache
 * @returns An array of notifications or null if no cache exists or is invalid
 */
export function getNotificationsFromCache(): Notification[] | null {
  const cachedData = localStorage.getItem(NOTIFICATIONS_CACHE_KEY);
  if (!cachedData) return null;
  
  try {
    const parsedData = JSON.parse(cachedData);
    
    // Validate the parsed data
    if (!isNotificationArray(parsedData)) {
      console.error("Invalid notification cache format");
      return null;
    }
    
    return parsedData;
  } catch (e) {
    console.error("Error parsing cached notifications:", e);
    return null;
  }
}

/**
 * Save notifications to cache
 */
export function saveNotificationsToCache(notifications: Notification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_CACHE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error("Error saving notifications to cache:", e);
  }
}

/**
 * Update a notification in the cache
 * @param notificationId - The ID of the notification to update
 * @param updates - Partial notification object with fields to update
 * @returns boolean indicating if the update was successful
 */
export function updateNotificationInCache(notificationId: string, updates: Partial<Notification>): boolean {
  const cachedData = getNotificationsFromCache();
  if (!cachedData) return false;
  
  // Validate that the notification exists in cache
  const notificationExists = cachedData.some(n => n.id === notificationId);
  if (!notificationExists) {
    console.warn(`Notification with ID ${notificationId} not found in cache`);
    return false;
  }
  
  const updatedNotifications = cachedData.map(n => 
    n.id === notificationId ? { ...n, ...updates } : n
  );
  
  saveNotificationsToCache(updatedNotifications);
  return true;
}

/**
 * Add a notification to the cache
 * @param notification - The notification to add to the cache
 * @returns boolean indicating if the add operation was successful
 */
export function addNotificationToCache(notification: Notification): boolean {
  try {
    // Validate required notification fields
    const { id, title, message } = notification;
    if (!id || !title || !message) {
      console.error('Invalid notification object:', notification);
      return false;
    }
    
    const cachedData = getNotificationsFromCache() || [];
    
    // Check for duplicates and update if found
    if (cachedData.some(n => n.id === id)) {
      console.warn(`Notification with ID ${id} already exists in cache`);
      return updateNotificationInCache(id, notification);
    }
    
    // Add new notification to the beginning of the array
    saveNotificationsToCache([notification, ...cachedData]);
    return true;
  } catch (error) {
    console.error('Error adding notification to cache:', error);
    return false;
  }
}
