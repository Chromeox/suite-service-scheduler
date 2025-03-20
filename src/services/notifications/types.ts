
export interface NotificationData {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  is_read: boolean;
  is_urgent: boolean;
  source_id?: string;
  source_type?: "message" | "order" | "system";
  created_at: string;
}

export interface CreateNotificationParams {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_urgent?: boolean;
  source_id?: string;
  source_type?: "message" | "order" | "system";
}
