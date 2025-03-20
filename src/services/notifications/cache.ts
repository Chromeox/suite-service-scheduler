
import { Notification } from "./types";

// Local storage key
const NOTIFICATIONS_CACHE_KEY = "suitesync_notifications_cache";

/**
 * Load notifications from cache
 */
export function getNotificationsFromCache(): Notification[] | null {
  const cachedData = localStorage.getItem(NOTIFICATIONS_CACHE_KEY);
  if (!cachedData) return null;
  
  try {
    return JSON.parse(cachedData) as Notification[];
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
 */
export function updateNotificationInCache(notificationId: string, updates: Partial<Notification>): void {
  const cachedData = getNotificationsFromCache();
  if (!cachedData) return;
  
  const updatedNotifications = cachedData.map(n => 
    n.id === notificationId ? { ...n, ...updates } : n
  );
  
  saveNotificationsToCache(updatedNotifications);
}

/**
 * Add a notification to the cache
 */
export function addNotificationToCache(notification: Notification): void {
  const cachedData = getNotificationsFromCache() || [];
  saveNotificationsToCache([notification, ...cachedData]);
}
