
import React, { ReactNode, useCallback, useRef } from "react";
import MobileHeader from "./MobileHeader";
import DesktopSidebar from "./DesktopSidebar";
import DesktopHeader from "./DesktopHeader";
import { UserStatusProvider } from "@/providers/UserStatusProvider";
import { toast } from "@/hooks/use-toast";
import { UserStatus } from "@/hooks/use-user-status";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  // Track previous status to prevent duplicate toasts
  const previousStatusRef = useRef<string | null>(null);
  
  // Handle status changes
  const handleStatusChange = useCallback((status: UserStatus) => {
    // Only show toast if status changed and not on initial render
    if (previousStatusRef.current && previousStatusRef.current !== status) {
      if (status === "away") {
        toast({
          title: "You are now away",
          description: "You've been inactive for 5 minutes",
          variant: "default"
        });
      } else if (status === "offline") {
        toast({
          title: "You are now offline",
          description: "You've been inactive for 30 minutes",
          variant: "destructive"
        });
      }
    }
    
    // Update previous status
    previousStatusRef.current = status;
  }, []);
  return (
    <UserStatusProvider 
      awayTimeout={5 * 60 * 1000} // 5 minutes
      offlineTimeout={30 * 60 * 1000} // 30 minutes
      onStatusChange={handleStatusChange}
    >
      <div className="flex min-h-screen flex-col">
      {/* Mobile header */}
      <MobileHeader />

      {/* Desktop sidebar with main content */}
      <div className="flex min-h-screen w-full">
        <div className="hidden md:block md:w-[240px] flex-shrink-0">
          <DesktopSidebar />
        </div>
        <main className="flex flex-col flex-1 w-full max-w-full overflow-hidden">
          <div className="hidden md:block">
            <DesktopHeader />
          </div>
          <div className="flex-1 p-3 md:p-5 w-full overflow-auto">
            <div className="mx-auto w-full max-w-[1800px]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
    </UserStatusProvider>
  );
};

export default DashboardLayout;
