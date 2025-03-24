import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchUserProfile, updateUserProfile, generateUserProfileSafeProcedure } from '@/utils/supabase';
import { useAuthState } from '@/hooks/chat/useAuthState';

/**
 * Debug component to test user profile utilities and verify they're working correctly
 * This component should only be used during development
 */
function ProfileDebugger() {
  const { user, userProfile } = useAuthState();
  const [directProfile, setDirectProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateResult, setUpdateResult] = useState<string>('');
  const [sqlCode, setSqlCode] = useState<string>('');

  // Test direct profile fetching
  const testProfileFetch = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const profile = await fetchUserProfile(user.id);
      setDirectProfile(profile);
      console.log('Profile fetched:', profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Test profile updating
  const testProfileUpdate = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Add a timestamp to ensure we're making a change
      const timestamp = new Date().toISOString();
      const { success, error, data } = await updateUserProfile(user.id, {
        updated_at: timestamp
      });
      
      setUpdateResult(
        success 
          ? `Profile updated successfully at ${timestamp}` 
          : `Error updating profile: ${error?.message || JSON.stringify(error)}`
      );
      console.log('Update result:', { success, error, data });
    } catch (error) {
      console.error('Error in update test:', error);
      setUpdateResult(`Exception: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get SQL procedure code
  useEffect(() => {
    setSqlCode(generateUserProfileSafeProcedure());
  }, []);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Debugger</CardTitle>
          <CardDescription>Please log in to test profile utilities</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Utilities Debugger</CardTitle>
        <CardDescription>Test and verify profile utilities are working correctly</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Current Auth State</h3>
          <pre className="p-4 bg-muted rounded-md overflow-auto text-xs">
            {JSON.stringify({ user: { id: user.id, email: user.email }, userProfile }, null, 2)}
          </pre>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Direct Profile Fetch Result</h3>
          <pre className="p-4 bg-muted rounded-md overflow-auto text-xs">
            {directProfile ? JSON.stringify(directProfile, null, 2) : 'Not fetched yet'}
          </pre>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Profile Update Result</h3>
          <pre className="p-4 bg-muted rounded-md overflow-auto text-xs">
            {updateResult || 'No update attempted yet'}
          </pre>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">SQL Stored Procedure</h3>
          <pre className="p-4 bg-muted rounded-md overflow-auto text-xs">
            {sqlCode}
          </pre>
          <p className="text-sm text-muted-foreground">
            Copy this SQL code and run it in your Supabase SQL Editor to create the stored procedure.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          onClick={testProfileFetch} 
          disabled={isLoading}
          variant="outline"
        >
          Test Profile Fetch
        </Button>
        <Button 
          onClick={testProfileUpdate} 
          disabled={isLoading}
        >
          Test Profile Update
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProfileDebugger;
