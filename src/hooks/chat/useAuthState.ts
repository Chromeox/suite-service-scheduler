
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, fetchUserProfile as fetchUserProfileSafe, setupAuthStateChange } from "@/utils/supabase";

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  role?: string;
}

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    if (!userId) return null;
    
    // Use the safe utility function to avoid infinite recursion
    const data = await fetchUserProfileSafe(userId);
    return data as UserProfile;
  };

  useEffect(() => {
    // Use the safe auth state change handler to prevent infinite loops
    const { data: authListener } = setupAuthStateChange(async (session) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        setIsLoading(true);
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
        setIsLoading(false);
      } else {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
      }
      
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, userProfile, isLoading };
};
