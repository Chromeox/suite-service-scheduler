
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

type Role = "attendant" | "runner" | "supervisor";

const RoleSelector = () => {
  const navigate = useNavigate();

  const selectRole = (role: Role) => {
    // In a real app, this would set user role in the auth state
    localStorage.setItem("userRole", role);
    navigate(`/dashboard/${role}`);
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
