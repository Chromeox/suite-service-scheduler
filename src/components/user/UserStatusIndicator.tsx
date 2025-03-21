import React from "react";
import { UserStatus } from "@/hooks/use-user-status";
import { cn } from "@/lib/utils";

interface UserStatusIndicatorProps {
  status: UserStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const statusConfig = {
  online: {
    color: "bg-green-500",
    label: "Online"
  },
  away: {
    color: "bg-yellow-500",
    label: "Away"
  },
  offline: {
    color: "bg-gray-400",
    label: "Offline"
  }
};

const sizesMap = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4"
};

export function UserStatusIndicator({
  status,
  size = "md",
  showLabel = false,
  className
}: UserStatusIndicatorProps) {
  const config = statusConfig[status];
  const sizeClass = sizesMap[size];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-full animate-pulse", 
        config.color,
        sizeClass
      )} />
      
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          {config.label}
        </span>
      )}
    </div>
  );
}
