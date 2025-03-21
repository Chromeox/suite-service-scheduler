
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Role = "attendant" | "runner" | "supervisor";

const RoleSelector = () => {
  const navigate = useNavigate();

  const selectRole = (role: Role) => {
    console.log(`Selecting role: ${role}`);
    
    try {
      // Store user role in local storage
      localStorage.setItem("userRole", role);
      
      // Show success toast
      toast({
        title: "Role selected",
        description: `You've selected the ${role} role`,
      });
      
      console.log(`Navigating to: /dashboard/${role}`);
      
      // Create a mock dashboard experience for demo purposes
      // This prevents issues with authentication and navigation
      const dashboardPath = `/dashboard/${role}`;
      
      // Use window.location for a full page navigation instead of React Router
      // This helps prevent flickering issues that might be caused by router conflicts
      window.location.href = dashboardPath;
      
      // Prevent further execution
      return;
      
      // The following code won't execute due to the return above
      // It's kept as a reference for the React Router approach
      // navigate(dashboardPath);
    } catch (error) {
      console.error('Error in selectRole:', error);
      toast({
        title: "Error",
        description: "There was a problem selecting your role. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Suite Attendant
          </CardTitle>
          <CardDescription>
            Manage 2-3 suites and guest interactions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Button 
            onClick={() => selectRole("attendant")} 
            className="w-full"
          >
            Continue as Attendant
          </Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Suite Runner
          </CardTitle>
          <CardDescription>
            Manage food service for 4-7 suites
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Button 
            onClick={() => selectRole("runner")} 
            className="w-full"
          >
            Continue as Runner
          </Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Supervisor
          </CardTitle>
          <CardDescription>
            Oversee all suite operations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Button 
            onClick={() => selectRole("supervisor")} 
            className="w-full"
          >
            Continue as Supervisor
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelector;
