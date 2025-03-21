import React, { createContext, useContext, ReactNode } from "react";
import { useUserStatus, UserStatus } from "@/hooks/use-user-status";

interface UserStatusContextType {
  status: UserStatus;
  setStatus: (status: UserStatus) => void;
  resetStatus: () => void;
  isOnline: boolean;
  isAway: boolean;
  isOffline: boolean;
}

const UserStatusContext = createContext<UserStatusContextType | undefined>(undefined);

interface UserStatusProviderProps {
  children: ReactNode;
  awayTimeout?: number;
  offlineTimeout?: number;
  onStatusChange?: (status: UserStatus) => void;
}

export function UserStatusProvider({
  children,
  awayTimeout,
  offlineTimeout,
  onStatusChange
}: UserStatusProviderProps) {
  const userStatus = useUserStatus({
    awayTimeout,
    offlineTimeout,
    onStatusChange
  });

  return (
    <UserStatusContext.Provider value={userStatus}>
      {children}
    </UserStatusContext.Provider>
  );
}

export function useUserStatusContext() {
  const context = useContext(UserStatusContext);
  
  if (context === undefined) {
    throw new Error("useUserStatusContext must be used within a UserStatusProvider");
  }
  
  return context;
}
