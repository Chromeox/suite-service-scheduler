
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertCircle, 
  Clock, 
  Package, 
  User, 
  UserCheck, 
  Users 
} from "lucide-react";
import RoleSelector from "@/components/RoleSelector";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const navigate = useNavigate();

  const handleAuth = () => {
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    // For MVP, we'll simulate authentication
    // In the future, this would connect to Supabase or another auth provider
    toast({
      title: "Success!",
      description: isLoggingIn ? "You've been logged in" : "Account created successfully",
    });
    
    // Navigate to role selection after successful auth
    navigate("/role-select");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Suite Service Scheduler
          </CardTitle>
          <CardDescription className="text-center">
            {isLoggingIn ? "Sign in to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleAuth}>
            {isLoggingIn ? "Sign In" : "Create Account"}
          </Button>
          <Button
            variant="link"
            className="w-full"
            onClick={() => setIsLoggingIn(!isLoggingIn)}
          >
            {isLoggingIn
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
