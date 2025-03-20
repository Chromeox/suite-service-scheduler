
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  Package, 
  Bell, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';
import { ActivityItem, ActivityItemType } from './types';

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 flex flex-col items-center justify-center">
          <p className="text-muted-foreground">No recent activity to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <Card key={activity.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{activity.title}</h3>
                    {activity.status && (
                      <ActivityStatusBadge status={activity.status} />
                    )}
                    {activity.priority === 'high' && (
                      <Badge variant="destructive">High Priority</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatActivityTime(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
                {activity.suiteId && activity.suiteId !== 'all' && (
                  <Badge variant="outline" className="mt-2">
                    Suite {activity.suiteId}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ActivityStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
    case 'in-progress':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getActivityIcon = (type: ActivityItemType) => {
  switch (type) {
    case 'message':
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case 'order':
      return <Package className="h-5 w-5 text-purple-500" />;
    case 'alert':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'status':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const formatActivityTime = (timestamp: string) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

export default RecentActivity;
