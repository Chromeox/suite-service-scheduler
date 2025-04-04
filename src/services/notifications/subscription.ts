
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationType } from "./types";
import { toast } from "@/hooks/use-toast";
import { addNotificationToCache } from "./cache";
import { RealtimeChannel } from "@supabase/supabase-js";

// Maximum number of connection retry attempts
const MAX_RETRY_ATTEMPTS = 3;
// Delay between retry attempts in milliseconds (exponential backoff)
const RETRY_DELAY_MS = 2000;

/**
 * Type definition for notification event handler
 */
type NotificationHandler = (notification: Notification) => void;

/**
 * Type definition for feedback handler
 */
type FeedbackHandler = () => void;

/**
 * Interface for subscription options
 */
interface SubscriptionOptions {
  /** Enable automatic reconnection on connection loss */
  enableReconnect?: boolean;
  /** Maximum number of retry attempts */
  maxRetryAttempts?: number;
  /** Custom error handler */
  onError?: (error: Error) => void;
}

/**
 * Type guard to validate if a payload is a valid Notification
 * Enhanced with more thorough validation
 */
function isValidNotification(payload: unknown): payload is Notification {
  if (!payload || typeof payload !== 'object') return false;
  
  const notification = payload as Partial<Notification>;
  const validTypes: NotificationType[] = ['info', 'success', 'warning', 'error'];
  
  // Basic required field validation
  if (
    typeof notification.id !== 'string' ||
    typeof notification.title !== 'string' ||
    typeof notification.message !== 'string' ||
    !validTypes.includes(notification.type as NotificationType) ||
    typeof notification.isRead !== 'boolean'
  ) {
    return false;
  }
  
  // Additional validation for security
  if (
    notification.id.length === 0 ||
    notification.title.length === 0 ||
    notification.message.length === 0 ||
    (notification.timestamp && typeof notification.timestamp !== 'string')
  ) {
    return false;
  }
  
  // Validate timestamp format if present
  if (notification.timestamp && isNaN(Date.parse(notification.timestamp))) {
    return false;
  }
  
  return true;
}

/**
 * Create a debounced version of a function
 * This prevents excessive function calls
 */
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Subscribe to real-time notifications for a user
 * Enhanced with reconnection logic and better error handling
 * 
 * @param userId - The ID of the user to subscribe to notifications for
 * @param onNotification - Callback function to handle new notifications
 * @param successFeedback - Callback function for success feedback
 * @param warningFeedback - Callback function for warning feedback
 * @param options - Optional configuration options
 * @returns A cleanup function to unsubscribe from notifications
 */
export function subscribeToNotifications(
  userId: string, 
  onNotification: NotificationHandler,
  successFeedback: FeedbackHandler,
  warningFeedback: FeedbackHandler,
  options: SubscriptionOptions = {}
): () => void {
  // Default options
  const {
    enableReconnect = true,
    maxRetryAttempts = MAX_RETRY_ATTEMPTS,
    onError = (error: Error) => console.error('Notification subscription error:', error)
  } = options;
  
  // Track connection status and retry attempts
  let isConnected = false;
  let retryCount = 0;
  let channel: RealtimeChannel | null = null;
  
  // Create a debounced version of the notification handler to prevent excessive updates
  const debouncedNotificationHandler = debounce(onNotification, 100);
  
  // Function to create and subscribe to the channel
  const createSubscription = () => {
    try {
      // Clean up existing channel if any
      if (channel) {
        supabase.removeChannel(channel);
      }
      
      channel = supabase
        .channel(`user-notifications-${userId}`)
        .on('broadcast', { event: 'notification' }, (payload) => {
          try {
            // Validate the notification payload
            if (!isValidNotification(payload.payload)) {
              console.error('Invalid notification payload:', payload.payload);
              return;
            }
            
            const newNotification: Notification = payload.payload;
            
            // Call the notification handler (debounced)
            debouncedNotificationHandler(newNotification);
            
            // Show toast and update cache
            handleNewNotification(newNotification, successFeedback, warningFeedback);
          } catch (error) {
            console.error('Error processing notification:', error);
            onError(error instanceof Error ? error : new Error(String(error)));
          }
        })
        .on('system', { event: '*' }, (payload) => {
          if (payload.event === 'disconnect') {
            isConnected = false;
            console.warn('Notification subscription disconnected');
            
            // Attempt to reconnect if enabled
            if (enableReconnect && retryCount < maxRetryAttempts) {
              retryCount++;
              const delay = RETRY_DELAY_MS * Math.pow(2, retryCount - 1); // Exponential backoff
              console.info(`Attempting to reconnect in ${delay}ms (attempt ${retryCount}/${maxRetryAttempts})`);
              
              setTimeout(() => {
                createSubscription();
              }, delay);
            }
          } else if (payload.event === 'connected') {
            isConnected = true;
            retryCount = 0; // Reset retry counter on successful connection
            console.info('Notification subscription connected');
          }
        })
        .subscribe();
    } catch (error) {
      console.error('Error creating notification subscription:', error);
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  
  // Initial subscription
  createSubscription();
  
  // Return cleanup function
  return () => {
    if (channel) {
      supabase.removeChannel(channel);
      channel = null;
    }
  };
}

/**
 * Handle a new notification by showing a toast and updating the cache
 * Enhanced with better error handling and sanitization
 */
function handleNewNotification(
  notification: Notification,
  successFeedback: FeedbackHandler,
  warningFeedback: FeedbackHandler
): void {
  try {
    // Sanitize notification content for security
    const sanitizedTitle = sanitizeText(notification.title);
    const sanitizedMessage = sanitizeText(notification.message);
    
    // Show toast for notifications
    if (notification.isUrgent) {
      warningFeedback();
      toast({
        title: "🔴 " + sanitizedTitle,
        description: sanitizedMessage,
        variant: "destructive",
      });
    } else {
      successFeedback();
      toast({
        title: sanitizedTitle,
        description: sanitizedMessage,
      });
    }
    
    // Update cache with sanitized notification
    const sanitizedNotification: Notification = {
      ...notification,
      title: sanitizedTitle,
      message: sanitizedMessage
    };
    
    addNotificationToCache(sanitizedNotification);
  } catch (error) {
    console.error('Error handling new notification:', error);
  }
}

/**
 * Sanitize text to prevent XSS attacks
 * Simple implementation - in production, use a proper sanitization library
 */
function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Limit length
  const truncated = text.slice(0, 500);
  
  // Basic HTML sanitization
  return truncated
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
