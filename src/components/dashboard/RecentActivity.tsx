
import React from "react";
import { Clock, ShoppingCart, MessageSquare, AlertCircle, CheckCircle, CupSoda } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ActivityItem {
  id: string;
  type: "order" | "message" | "alert" | "status";
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  priority?: "low" | "medium" | "high";
  suiteId?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities = [], 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center text-muted-foreground">Loading activity...</div>
        </CardContent>
      </Card>
    );
  }
  
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center text-muted-foreground">
            <Clock className="mx-auto h-10 w-10 opacity-25 mb-2" />
            <p>No recent activity to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className={`h-8 w-8 ${getAvatarStyle(activity.type, activity.priority)}`}>
                  <AvatarFallback>{getActivityIcon(activity.type)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center pt-1 gap-2 flex-wrap">
                    {activity.suiteId && (
                      <Badge variant="outline" className="text-xs">
                        Suite {activity.suiteId}
                      </Badge>
                    )}
                    {activity.status && (
                      <Badge 
                        variant={getStatusVariant(activity.status)} 
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    )}
                    {activity.priority && (
                      <Badge 
                        variant={getPriorityVariant(activity.priority)} 
                        className="text-xs"
                      >
                        {activity.priority} priority
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Helper function to get avatar style based on activity type and priority
function getAvatarStyle(type: string, priority?: string): string {
  if (priority === "high") return "bg-red-500 text-white";
  
  switch (type) {
    case "order":
      return "bg-green-500 text-white";
    case "message":
      return "bg-blue-500 text-white";
    case "alert":
      return "bg-yellow-500 text-white";
    case "status":
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

// Helper function to get activity icon
function getActivityIcon(type: string): React.ReactNode {
  switch (type) {
    case "order":
      return <ShoppingCart className="h-4 w-4" />;
    case "message":
      return <MessageSquare className="h-4 w-4" />;
    case "alert":
      return <AlertCircle className="h-4 w-4" />;
    case "status":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <CupSoda className="h-4 w-4" />;
  }
}

// Helper function to format timestamp
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffMins < 24 * 60) {
    return `${Math.floor(diffMins / 60)}h ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// Helper function to get status badge variant
function getStatusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  switch (status.toLowerCase()) {
    case "completed":
      return "default";
    case "in progress":
    case "in-progress":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

// Helper function to get priority badge variant
function getPriorityVariant(priority: string): "default" | "secondary" | "outline" | "destructive" {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "outline";
  }
}

export default RecentActivity;
