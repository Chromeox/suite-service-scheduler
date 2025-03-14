
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleSelector from "@/components/RoleSelector";
import { supabase } from "@/integrations/supabase/client";
import LogoutButton from "@/components/LogoutButton";

const RoleSelect = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login");
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Select Your Role</h1>
          <p className="text-muted-foreground">
            Choose which role you're working as today
          </p>
        </div>
        <RoleSelector />
      </div>
    </div>
  );
};

export default RoleSelect;
