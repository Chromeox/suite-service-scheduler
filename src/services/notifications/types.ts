
// Common type definitions for better reusability
export type NotificationType = "info" | "success" | "warning" | "error";
export type NotificationSourceType = "message" | "order" | "system";

// Database notification model (snake_case as per Supabase convention)
export interface NotificationData {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  is_read: boolean;
  is_urgent: boolean;
  source_id?: string;
  source_type?: NotificationSourceType;
  created_at: string;
}

// Parameters for creating a new notification
export interface CreateNotificationParams {
  title: string;
  message: string;
  type: NotificationType;
  is_urgent?: boolean;
  source_id?: string;
  source_type?: NotificationSourceType;
}

// Parameters for fetching notifications with pagination and filtering
export interface FetchNotificationsParams {
  /** Page number (1-based) @default 1 */
  page?: number;
  /** Number of items per page @default 10 */
  pageSize?: number;
  /** Filter by notification type */
  filterType?: NotificationType;
  /** Filter by read status */
  filterRead?: boolean;
  /** Filter by urgency */
  filterUrgent?: boolean;
}

// Client-side notification model (camelCase for frontend convention)
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  isUrgent: boolean;
  sourceId?: string;
  sourceType?: NotificationSourceType;
}

// Grouped notifications by date or type
export interface NotificationGroup {
  /** Group title (e.g., "Today", "Yesterday", "Older", or type name) */
  title: string;
  /** Notifications in this group */
  notifications: Notification[];
  /** Count of notifications in this group */
  count: number;
  /** Count of unread notifications in this group */
  unreadCount: number;
}
