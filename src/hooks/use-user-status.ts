import { useState, useEffect, useCallback, useRef } from "react";

export type UserStatus = "online" | "away" | "offline";

interface UseUserStatusOptions {
  awayTimeout?: number;  // in milliseconds
  offlineTimeout?: number;  // in milliseconds
  onStatusChange?: (status: UserStatus) => void;
}

/**
 * Hook to track user status based on activity and time away from the app
 * 
 * @param options Configuration options for status timeouts
 * @returns Current user status and methods to update it
 */
export function useUserStatus({
  awayTimeout = 5 * 60 * 1000, // 5 minutes in milliseconds
  offlineTimeout = 30 * 60 * 1000, // 30 minutes in milliseconds
  onStatusChange
}: UseUserStatusOptions = {}) {
  const [status, setStatus] = useState<UserStatus>("online");
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const awayTimerRef = useRef<number | null>(null);
  const offlineTimerRef = useRef<number | null>(null);

  // Update status and call the callback if provided
  const updateStatus = useCallback((newStatus: UserStatus) => {
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  }, [onStatusChange]);

  // Reset timers and set status to online
  const resetStatus = useCallback(() => {
    setLastActivity(Date.now());
    updateStatus("online");
    
    // Clear existing timers
    if (awayTimerRef.current) window.clearTimeout(awayTimerRef.current);
    if (offlineTimerRef.current) window.clearTimeout(offlineTimerRef.current);
    
    // Set new timers
    awayTimerRef.current = window.setTimeout(() => {
      updateStatus("away");
    }, awayTimeout);
    
    offlineTimerRef.current = window.setTimeout(() => {
      updateStatus("offline");
    }, offlineTimeout);
  }, [awayTimeout, offlineTimeout, updateStatus]);

  // Set up event listeners for user activity
  useEffect(() => {
    const activityEvents = [
      "mousedown", "mousemove", "keydown", 
      "scroll", "touchstart", "click", "focus"
    ];
    
    const visibilityChangeHandler = () => {
      if (!document.hidden) {
        resetStatus();
      }
    };
    
    const activityHandler = () => {
      resetStatus();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, activityHandler);
    });
    
    document.addEventListener("visibilitychange", visibilityChangeHandler);
    
    // Initialize timers
    resetStatus();
    
    // Clean up event listeners and timers
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, activityHandler);
      });
      
      document.removeEventListener("visibilitychange", visibilityChangeHandler);
      
      if (awayTimerRef.current) window.clearTimeout(awayTimerRef.current);
      if (offlineTimerRef.current) window.clearTimeout(offlineTimerRef.current);
    };
  }, [resetStatus]);

  // Method to manually set status (e.g., when user logs out)
  const setUserStatus = useCallback((newStatus: UserStatus) => {
    updateStatus(newStatus);
  }, [updateStatus]);

  return {
    status,
    setStatus: setUserStatus,
    resetStatus,
    isOnline: status === "online",
    isAway: status === "away",
    isOffline: status === "offline"
  };
}
