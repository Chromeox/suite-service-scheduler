
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleSelector from "@/components/RoleSelector";
import { supabase } from "@/integrations/supabase/client";
import LogoutButton from "@/components/LogoutButton";
import { toast } from "@/hooks/use-toast";

const RoleSelect = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem verifying your session. Please try logging in again.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      if (!data.session) {
        console.log("No active session found");
        navigate("/login");
      } else {
        console.log("Active session found", data.session);
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session ? "session exists" : "no session");
        if (!session) {
          navigate("/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Select Your Role</h1>
          <p className="text-muted-foreground">
            Please select a role to continue. This is required to complete your registration.
          </p>
        </div>
        <RoleSelector />
      </div>
    </div>
  );
};

export default RoleSelect;
