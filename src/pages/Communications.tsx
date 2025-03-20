
import React from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import CommunicationsList from "@/components/communications/CommunicationsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Communications = () => {
  const { role } = useParams<{ role: string }>();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleNewMessage = () => {
    toast({
      title: "Create new message",
      description: "This feature will be available soon",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Communications</h1>
          <Button onClick={handleNewMessage} size={isMobile ? "sm" : "default"} className="gap-1">
            <Plus className="h-4 w-4" />
            {!isMobile && "New Message"}
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Coordinate with team members in real-time
        </p>
        
        <Card className="p-0">
          <CommunicationsList />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Communications;

