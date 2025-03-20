
import React from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useNetworkStatus } from "@/hooks/use-network";
import { cn } from "@/lib/utils";

const OfflineIndicator = () => {
  const { isOnline } = useNetworkStatus();
  
  if (isOnline) return null;
  
  return (
    <div className={cn(
      "fixed bottom-16 inset-x-0 z-50 bg-destructive text-destructive-foreground py-2 px-4",
      "flex items-center justify-center text-sm font-medium md:bottom-0"
    )}>
      <WifiOff className="h-4 w-4 mr-2" />
      <span>You're offline. Some features may be limited.</span>
    </div>
  );
};

export default OfflineIndicator;
