import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import { useUserStatusContext } from "@/providers/UserStatusProvider";
import { UserStatus } from "@/hooks/use-user-status";
import { UserStatusIndicator } from "./UserStatusIndicator";

interface UserMenuProps {
  userName: string;
  userEmail: string;
  userAvatar?: string;
  onLogout: () => void;
}

const statusOptions: UserStatus[] = ["online", "away", "offline"];

export const UserMenu = React.memo(function UserMenu({ 
  userName, 
  userEmail, 
  userAvatar, 
  onLogout 
}: UserMenuProps) {
  const navigate = useNavigate();
  
  // Try to use the context, but provide fallbacks if it's not available
  let status: UserStatus = "online";
  let setStatus = (newStatus: UserStatus) => {};
  
  try {
    const context = useUserStatusContext();
    status = context.status;
    setStatus = context.setStatus;
  } catch (error) {
    // Context not available, use defaults
    console.warn("UserStatusContext not available, using default values");
  }
  
  // Memoize callbacks to prevent unnecessary re-renders
  const handleSettingsClick = useCallback(() => {
    navigate("/dashboard/settings");
  }, [navigate]);
  
  const handleStatusChange = useCallback((newStatus: UserStatus) => {
    setStatus(newStatus);
  }, [setStatus]);
  
  // Memoize the initials calculation
  const initials = useMemo(() => {
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }, [userName]);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
          STATUS
        </DropdownMenuLabel>
        
        {statusOptions.map((statusOption) => (
          <DropdownMenuItem 
            key={statusOption}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleStatusChange(statusOption)}
          >
            <UserStatusIndicator status={statusOption} size="sm" />
            <span className="capitalize">{statusOption}</span>
            {status === statusOption && (
              <span className="ml-auto text-xs text-primary">•</span>
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={handleSettingsClick}>
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
