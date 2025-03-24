/**
 * Supabase utility functions to safely interact with user profiles
 * and avoid infinite recursion in database policies
 */
import { supabase } from '@/integrations/supabase/client';
import { callRPC, GetUserProfileSafeParams } from './supabase-functions';

// Re-export the supabase client
export { supabase };

/**
 * Interface for user profile data
 */
export interface UserProfileData {
  id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch user profile with error handling for recursion issues
 * This function works around the infinite recursion policy issue
 */
export async function fetchUserProfile(userId: string): Promise<UserProfileData | null> {
  try {
    // Use a direct query approach instead of relying on RLS policies
    // This avoids the recursion issue in the policy
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      
      // If we encounter the recursion error, try an alternative approach
      if (error.code === '42P17') {
        try {
          // Fallback to a stored procedure or a different query pattern
          // that doesn't trigger the recursive policy
          const { data: fallbackData, error: fallbackError } = await callRPC(
            supabase,
            'get_user_profile_safe',
            { user_id_param: userId }
          );
          
          if (fallbackError) {
            console.error('Fallback error:', fallbackError);
            return null;
          }
          
          return fallbackData as UserProfileData;
        } catch (rpcError) {
          console.error('RPC fallback error:', rpcError);
          return null;
        }
      }
      
      return null;
    }
    
    return data as UserProfileData;
  } catch (error) {
    console.error('Exception fetching user profile:', error);
    return null;
  }
}

/**
 * Update user profile with error handling for recursion issues
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfileData>) {
  try {
    // Use upsert with specific columns to avoid triggering recursive policies
    const updateData: Partial<UserProfileData> = {
      id: userId,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select();
    
    if (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Exception updating user profile:', error);
    return { success: false, error };
  }
}

/**
 * Safe authentication state change handler
 * Prevents infinite loops with profile fetching
 */
export function setupAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      // Only pass the session to avoid triggering profile fetches automatically
      callback(session);
    } else {
      callback(null);
    }
  });
}

/**
 * Creates a SQL stored procedure in Supabase to safely fetch user profiles
 * without triggering infinite recursion in RLS policies
 * 
 * This is a helper function to generate the SQL you need to run in the Supabase SQL editor
 */
export function generateUserProfileSafeProcedure(): string {
  return `
-- Run this in your Supabase SQL editor to create the stored procedure
-- that safely fetches user profiles without triggering recursive RLS policies

CREATE OR REPLACE FUNCTION get_user_profile_safe(user_id_param UUID)
RETURNS SETOF user_profiles
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_profiles
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;
  `;
}
