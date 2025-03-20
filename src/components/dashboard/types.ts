
export type ActivityItemType = "order" | "message" | "alert" | "status";
export type ActivityItemPriority = "low" | "medium" | "high";

export interface ActivityItem {
  id: string;
  type: ActivityItemType;
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  priority: ActivityItemPriority;
  suiteId?: string;
}
