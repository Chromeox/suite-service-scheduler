
import { Notification, NotificationType } from "./types";

// Local storage key with namespace to avoid conflicts
const NOTIFICATIONS_CACHE_KEY = "suitesync_notifications_cache";
// Maximum number of notifications to keep in cache to prevent memory issues
const MAX_CACHED_NOTIFICATIONS = 100;
// Cache expiration time in milliseconds (24 hours)
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000;

/**
 * Interface for cached data with expiration
 */
interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Type guard to validate if parsed data is a valid CachedData object
 */
function isCachedData<T>(data: unknown): data is CachedData<T> {
  if (!data || typeof data !== 'object') return false;
  
  const cachedData = data as Partial<CachedData<T>>;
  return (
    cachedData.data !== undefined &&
    typeof cachedData.timestamp === 'number'
  );
}

/**
 * Type guard to validate if parsed data is an array of Notifications
 * Improved with more specific type checking
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
      typeof notification.isRead === 'boolean' &&
      // Ensure timestamp is a valid ISO string
      typeof notification.timestamp === 'string' && !isNaN(Date.parse(notification.timestamp))
    );
  });
}

/**
 * Load notifications from cache with expiration check
 * @returns An array of notifications or null if no cache exists, is invalid, or has expired
 */
export function getNotificationsFromCache(): Notification[] | null {
  try {
    const cachedData = localStorage.getItem(NOTIFICATIONS_CACHE_KEY);
    if (!cachedData) return null;
    
    const parsedData = JSON.parse(cachedData);
    
    // Check if the data has the correct cache structure
    if (!isCachedData<Notification[]>(parsedData)) {
      console.warn("Invalid cache structure, clearing cache");
      localStorage.removeItem(NOTIFICATIONS_CACHE_KEY);
      return null;
    }
    
    // Check if the cache has expired
    const now = Date.now();
    if (now - parsedData.timestamp > CACHE_EXPIRATION_MS) {
      console.info("Cache has expired, clearing");
      localStorage.removeItem(NOTIFICATIONS_CACHE_KEY);
      return null;
    }
    
    // Validate the notification array
    if (!isNotificationArray(parsedData.data)) {
      console.error("Invalid notification data format");
      localStorage.removeItem(NOTIFICATIONS_CACHE_KEY);
      return null;
    }
    
    return parsedData.data;
  } catch (e) {
    console.error("Error parsing cached notifications:", e);
    // Clear corrupted cache
    localStorage.removeItem(NOTIFICATIONS_CACHE_KEY);
    return null;
  }
}

/**
 * Save notifications to cache with timestamp and size limit
 * @param notifications Array of notifications to cache
 * @returns boolean indicating if the save operation was successful
 */
export function saveNotificationsToCache(notifications: Notification[]): boolean {
  try {
    // Validate input
    if (!Array.isArray(notifications)) {
      console.error("Invalid notifications data type");
      return false;
    }
    
    // Limit the number of cached notifications to prevent memory issues
    const limitedNotifications = notifications.slice(0, MAX_CACHED_NOTIFICATIONS);
    
    // Create cache object with timestamp
    const cacheData: CachedData<Notification[]> = {
      data: limitedNotifications,
      timestamp: Date.now()
    };
    
    localStorage.setItem(NOTIFICATIONS_CACHE_KEY, JSON.stringify(cacheData));
    return true;
  } catch (e) {
    console.error("Error saving notifications to cache:", e);
    
    // Handle quota exceeded error
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      try {
        // Try to clear the cache and save a smaller subset
        localStorage.removeItem(NOTIFICATIONS_CACHE_KEY);
        const reducedNotifications = notifications.slice(0, Math.floor(MAX_CACHED_NOTIFICATIONS / 2));
        const reducedCacheData: CachedData<Notification[]> = {
          data: reducedNotifications,
          timestamp: Date.now()
        };
        localStorage.setItem(NOTIFICATIONS_CACHE_KEY, JSON.stringify(reducedCacheData));
        return true;
      } catch (innerError) {
        console.error("Failed to save reduced cache:", innerError);
      }
    }
    
    return false;
  }
}

/**
 * Update a notification in the cache
 * @param notificationId - The ID of the notification to update
 * @param updates - Partial notification object with fields to update
 * @returns boolean indicating if the update was successful
 */
export function updateNotificationInCache(notificationId: string, updates: Partial<Notification>): boolean {
  try {
    // Input validation
    if (!notificationId || typeof notificationId !== 'string') {
      console.error('Invalid notification ID');
      return false;
    }
    
    if (!updates || typeof updates !== 'object') {
      console.error('Invalid updates object');
      return false;
    }
    
    const cachedData = getNotificationsFromCache();
    if (!cachedData) return false;
    
    // Validate that the notification exists in cache
    const notificationExists = cachedData.some(n => n.id === notificationId);
    if (!notificationExists) {
      console.warn(`Notification with ID ${notificationId} not found in cache`);
      return false;
    }
    
    // Create updated notifications array with immutable pattern
    const updatedNotifications = cachedData.map(n => 
      n.id === notificationId ? { ...n, ...updates } : n
    );
    
    // Save to cache and return the result
    return saveNotificationsToCache(updatedNotifications);
  } catch (error) {
    console.error('Error updating notification in cache:', error);
    return false;
  }
}

/**
 * Add a notification to the cache
 * @param notification - The notification to add to the cache
 * @returns boolean indicating if the add operation was successful
 */
export function addNotificationToCache(notification: Notification): boolean {
  try {
    // Validate required notification fields
    const { id, title, message, type } = notification;
    if (!id || typeof id !== 'string') {
      console.error('Invalid notification ID');
      return false;
    }
    
    if (!title || typeof title !== 'string') {
      console.error('Invalid notification title');
      return false;
    }
    
    if (!message || typeof message !== 'string') {
      console.error('Invalid notification message');
      return false;
    }
    
    const validTypes: NotificationType[] = ['info', 'success', 'warning', 'error'];
    if (!validTypes.includes(type)) {
      console.error('Invalid notification type');
      return false;
    }
    
    const cachedData = getNotificationsFromCache() || [];
    
    // Check for duplicates and update if found
    if (cachedData.some(n => n.id === id)) {
      console.warn(`Notification with ID ${id} already exists in cache`);
      return updateNotificationInCache(id, notification);
    }
    
    // Add new notification to the beginning of the array and limit size
    const updatedNotifications = [notification, ...cachedData].slice(0, MAX_CACHED_NOTIFICATIONS);
    
    // Save to cache and return the result
    return saveNotificationsToCache(updatedNotifications);
  } catch (error) {
    console.error('Error adding notification to cache:', error);
    return false;
  }
}

/**
 * Clear all notifications from cache
 * @returns boolean indicating if the clear operation was successful
 */
export function clearNotificationsCache(): boolean {
  try {
    localStorage.removeItem(NOTIFICATIONS_CACHE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing notifications cache:', error);
    return false;
  }
}
