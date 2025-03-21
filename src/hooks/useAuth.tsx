
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Define user type
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check for user session on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { user } = data.session;
        setUser({
          id: user.id,
          email: user.email || '',
          firstName: user.user_metadata.first_name || '',
          lastName: user.user_metadata.last_name || ''
        });
      }
    };
    
    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            firstName: session.user.user_metadata.first_name || '',
            lastName: session.user.user_metadata.last_name || ''
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
    return true;
  };

  const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string) => {
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return false;
    }

    if (!firstName || !lastName) {
      toast({
        title: "Missing information",
        description: "Please enter your first and last name",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/role-select`
        }
      });
      if (error) throw error;

      toast({
        title: "Account created",
        description: "Please check your email to confirm your account",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      console.log("Starting Google auth from useAuth hook, origin:", window.location.origin);
      
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
      
      if (error) throw error;
      return true;
    } catch (error: any) {
      toast({
        title: "Error signing in with Google",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      console.log("Starting Google signup from useAuth hook, origin:", window.location.origin);
      
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
      
      if (error) throw error;
      return true;
    } catch (error: any) {
      toast({
        title: "Error signing up with Google",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const signOut = async (callback?: () => void) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      if (callback) callback();
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    isGoogleLoading,
    user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signUpWithGoogle,
    signOut
  };
};
