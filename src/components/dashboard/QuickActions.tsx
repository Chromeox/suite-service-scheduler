
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  MessageSquare, 
  Utensils, 
  Home,
  Clock,
  PlusCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  description?: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, onClick, description }) => {
  return (
    <Button 
      variant="outline" 
      className="h-auto flex-col p-4 items-center justify-center gap-2 hover:bg-muted transition-colors"
      onClick={onClick}
    >
      <div className="rounded-full bg-primary/10 p-2 text-primary">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      {description && (
        <span className="text-xs text-muted-foreground">{description}</span>
      )}
    </Button>
  );
};

interface QuickActionsProps {
  role: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ role }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const basePath = `/dashboard/${role}`;
  
  const handleNewOrder = () => {
    navigate(`${basePath}/orders`);
    // We'll simulate opening the new order dialog after navigation
    setTimeout(() => {
      toast({
        title: "New order",
        description: "You can now create a new order"
      });
    }, 500);
  };
  
  const handleQuickMessage = () => {
    navigate(`${basePath}/communications`);
    // We'll simulate opening the new chat dialog after navigation
    setTimeout(() => {
      toast({
        title: "New message",
        description: "You can now send a new message"
      });
    }, 500);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <QuickAction 
            icon={<PlusCircle className="h-5 w-5" />}
            label="New Order"
            onClick={handleNewOrder}
            description="Create order"
          />
          <QuickAction 
            icon={<Clock className="h-5 w-5" />}
            label="Recent Orders"
            onClick={() => navigate(`${basePath}/orders`)}
            description="View orders"
          />
          <QuickAction 
            icon={<MessageSquare className="h-5 w-5" />}
            label="Quick Message"
            onClick={handleQuickMessage}
            description="Send message"
          />
          <QuickAction 
            icon={<Home className="h-5 w-5" />}
            label="View Suites"
            onClick={() => navigate(`${basePath}/suites`)}
            description="Manage suites"
          />
          <QuickAction 
            icon={<Utensils className="h-5 w-5" />}
            label="Menu"
            onClick={() => navigate(`${basePath}/beverages`)}
            description="View menu items"
          />
          <QuickAction 
            icon={<ShoppingCart className="h-5 w-5" />}
            label="Rush Orders"
            onClick={() => navigate(`${basePath}/orders`)}
            description="Priority orders"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
