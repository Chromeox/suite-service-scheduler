
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationsDialog } from "@/components/notifications/NotificationsDialog";
import { useNotifications } from "@/hooks/use-notifications";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNetworkStatus } from "@/hooks/use-network";
import OfflineIndicator from "@/components/layout/OfflineIndicator";

// Mock data for recent activity
const mockActivities = [
  {
    id: "1",
    type: "order",
    title: "New Order Placed",
    description: "Suite 203 ordered 3 items",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    status: "pending",
    priority: "medium" as const,
    suiteId: "203"
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    description: "John from Suite 101 needs assistance",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    priority: "high" as const,
    suiteId: "101"
  },
  {
    id: "3",
    type: "status",
    title: "Order Status Updated",
    description: "Order #5632 is now ready for delivery",
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    status: "ready",
    suiteId: "305"
  },
  {
    id: "4",
    type: "alert",
    title: "Beverage Alert",
    description: "Running low on premium beer in section 200P",
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    priority: "medium" as const
  },
  {
    id: "5",
    type: "order",
    title: "Order Completed",
    description: "Order #5629 was delivered to Suite 418",
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    status: "completed",
    suiteId: "418"
  }
];

const Dashboard = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isOnline } = useNetworkStatus();
  const { notifications, unreadCount, markAsRead, markAllAsRead, sendNotification } = useNotifications("user123");
  const [activities, setActivities] = useState(mockActivities);

  // Add a demo notification button (for testing purposes)
  const handleAddDemoNotification = () => {
    sendNotification({
      title: "Demo Notification",
      message: "This is a test notification to demonstrate the feature",
      type: "info",
      isUrgent: Math.random() > 0.7, // 30% chance of being urgent
    });
  };

  useEffect(() => {
    // Validate role
    if (role !== "attendant" && role !== "runner" && role !== "supervisor") {
      toast({
        title: "Invalid role",
        description: "Please select a valid role",
        variant: "destructive",
      });
      navigate("/role-select");
    }
  }, [role, navigate]);

  return (
    <DashboardLayout>
      {!isOnline && <OfflineIndicator />}
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <NotificationsDialog 
              notifications={notifications}
              unreadCount={unreadCount}
              markAsRead={markAsRead}
              markAllAsRead={markAllAsRead}
            />
            {!isMobile && <ThemeToggle />}
          </div>
        </div>
        
        <p className="text-muted-foreground">Welcome to your dashboard</p>
      
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-2 lg:grid-cols-3">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-xs font-medium text-muted-foreground">Pending Orders</div>
                <div className="text-2xl font-bold mt-1">12</div>
                <div className="text-xs text-muted-foreground mt-1">3 high priority</div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-xs font-medium text-muted-foreground">Active Suites</div>
                <div className="text-2xl font-bold mt-1">24</div>
                <div className="text-xs text-muted-foreground mt-1">4 VIP suites</div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-xs font-medium text-muted-foreground">New Messages</div>
                <div className="text-2xl font-bold mt-1">{unreadCount}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {unreadCount > 0 ? `${Math.ceil(unreadCount * 0.2)} urgent` : 'All caught up'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Demo Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Test the notification system with these controls
                </p>
                <div className="flex flex-col gap-2">
                  <button 
                    className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                    onClick={handleAddDemoNotification}
                  >
                    Send Test Notification
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <QuickActions role={role || ""} />
        
        <RecentActivity activities={activities} />
      </div>
      
      {/* Add bottom padding to account for indicators and nav bar */}
      <div className={`h-16 ${!isOnline ? 'h-28' : ''} md:h-0`}></div>
    </DashboardLayout>
  );
};

export default Dashboard;
