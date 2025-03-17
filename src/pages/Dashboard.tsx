
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid, Package, MessageCircle, Bell, Timer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();

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
    
    // Remove auto-redirect to suites view
  }, [role, navigate]);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Home</h1>
        <p className="text-muted-foreground">Select an option to navigate</p>
      
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors" 
            onClick={() => navigate(`/dashboard/${role}/suites`)}
          >
            <CardHeader className="flex flex-col items-center pb-2">
              <Grid className="h-12 w-12 text-primary mb-2" />
              <CardTitle className="text-center">Assigned Suites</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              View and manage suites
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors" 
            onClick={() => navigate(`/dashboard/${role}/orders`)}
          >
            <CardHeader className="flex flex-col items-center pb-2">
              <Package className="h-12 w-12 text-primary mb-2" />
              <CardTitle className="text-center">Food Orders</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              Track and manage food orders
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors" 
            onClick={() => navigate(`/dashboard/${role}/communications`)}
          >
            <CardHeader className="flex flex-col items-center pb-2">
              <MessageCircle className="h-12 w-12 text-primary mb-2" />
              <CardTitle className="text-center">Communications</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              Coordinate with team members
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors" 
            onClick={() => navigate(`/dashboard/${role}/notifications`)}
          >
            <CardHeader className="flex flex-col items-center pb-2">
              <Bell className="h-12 w-12 text-primary mb-2" />
              <CardTitle className="text-center">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              View alerts and updates
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors" 
            onClick={() => navigate(`/dashboard/${role}/timers`)}
          >
            <CardHeader className="flex flex-col items-center pb-2">
              <Timer className="h-12 w-12 text-primary mb-2" />
              <CardTitle className="text-center">Timers</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              Set and manage food timers
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
