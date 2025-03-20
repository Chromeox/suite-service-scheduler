import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useToast } from "@/hooks/use-toast";
import { useNetworkStatus } from "@/hooks/use-network";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ActivityItem, ActivityItemType } from "@/components/dashboard/types";
import { useNotifications } from "@/hooks/use-notifications";

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "order",
    title: "New Suite Order",
    description: "Suite 203 placed a new order for beverages",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    status: "pending",
    priority: "medium",
    suiteId: "203"
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    description: "Suite 101 requested additional towels",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    priority: "high",
    suiteId: "101"
  },
  {
    id: "3",
    type: "alert",
    title: "Restocking Alert",
    description: "Premium whiskey inventory is running low",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    priority: "medium",
    suiteId: "all"
  },
  {
    id: "4",
    type: "status",
    title: "Order Completed",
    description: "Suite 305 order has been delivered",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    status: "completed",
    priority: "low",
    suiteId: "305"
  },
  {
    id: "5",
    type: "order",
    title: "New Game Day Package",
    description: "Suite 401 ordered the game day package",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    status: "in-progress",
    priority: "medium",
    suiteId: "401"
  },
  {
    id: "6",
    type: "message",
    title: "Temperature Adjustment",
    description: "Suite 208 requested temperature adjustment",
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(), // 2.5 hours ago
    priority: "medium",
    suiteId: "208"
  }
];

const Dashboard = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const { toast } = useToast();
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (!auth.user) {
      navigate("/login");
    }
  }, [auth.user, navigate]);

  const statusText = isOnline ? "Online" : "Offline";

  const [activeTab, setActiveTab] = useState<"all" | ActivityItemType>("all");
  
  const filteredActivity = mockActivity.filter(item => {
    if (activeTab !== "all" && item.type !== activeTab) return false;
    
    if (role === "manager") {
      return true; // Managers see all activity
    } else if (role === "attendant") {
      return item.type === "order" || item.type === "message"; // Attendants only see orders and messages
    } else if (role === "owner") {
      return item.type === "alert" || item.priority === "high"; // Owners only see alerts and high priority items
    }
    return false;
  });

  const { sendNotification } = useNotifications(auth.user?.id);

  const sendTestNotification = () => {
    if (!auth.user?.id) return;

    sendNotification({
      title: "Welcome to SuiteSync",
      message: "Your dashboard is now active with real-time notifications",
      type: "success",
      is_urgent: false,
      source_type: "system"
    });
  };

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">
            Welcome, {auth.user?.firstName || "User"}!
          </h1>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>Status: {statusText}</span>
            <Button variant="outline" size="sm" onClick={() => auth.signOut(() => navigate("/login"))}>
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <QuickActions role={role as string} />
            
            <div className="mt-4">
              <Button 
                onClick={sendTestNotification} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                Send Test Notification
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as "all" | ActivityItemType)}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="order">Orders</TabsTrigger>
                  <TabsTrigger value="message">Messages</TabsTrigger>
                  <TabsTrigger value="alert">Alerts</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <RecentActivity activities={filteredActivity} />
              </TabsContent>
              <TabsContent value="order" className="mt-0">
                <RecentActivity activities={filteredActivity} />
              </TabsContent>
              <TabsContent value="message" className="mt-0">
                <RecentActivity activities={filteredActivity} />
              </TabsContent>
              <TabsContent value="alert" className="mt-0">
                <RecentActivity activities={filteredActivity} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
