
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SignupFormProps {
  onToggleForm: () => void;
}

const SignupForm = ({ onToggleForm }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { isLoading, isGoogleLoading, signUpWithEmail, signUpWithGoogle } = useAuth();

  const handleSignup = async () => {
    if (!firstName || !lastName) {
      toast({
        title: "Missing information",
        description: "Please enter your first and last name",
        variant: "destructive",
      });
      return;
    }
    
    const success = await signUpWithEmail(email, password, firstName, lastName);
    if (success) {
      // Reset form if successful
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
    }
  };

  // Direct Google sign-in implementation as backup
  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/role-select`,
        },
      });
      
      if (error) {
        console.error("Google auth error:", error);
        toast({
          title: "Google Authentication Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Google sign up error:", err);
      toast({
        title: "Error",
        description: "Failed to authenticate with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
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
      
      <Button 
        className="w-full" 
        onClick={handleSignup}
        disabled={isLoading || isGoogleLoading}
      >
        {isLoading ? "Loading..." : "Create Account"}
      </Button>
      
      <div className="flex items-center gap-2 my-2">
        <Separator className="flex-1" />
        <span className="text-xs text-gray-500">OR</span>
        <Separator className="flex-1" />
      </div>
      
      <Button 
        variant="outline"
        className="w-full" 
        onClick={handleGoogleSignUp}
        disabled={isLoading || isGoogleLoading}
      >
        <div className="w-4 h-4 mr-2 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
        </div>
        {isGoogleLoading ? "Loading..." : "Sign Up with Google"}
      </Button>

      <Button
        variant="link"
        className="w-full"
        onClick={onToggleForm}
        disabled={isLoading || isGoogleLoading}
      >
        Already have an account? Sign in
      </Button>
    </div>
  );
};

export default SignupForm;
