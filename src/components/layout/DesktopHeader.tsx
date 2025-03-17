
import React from "react";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Camera } from "lucide-react";

const DesktopHeader = () => {
  const location = useLocation();
  const path = location.pathname;

  // Determine page title based on current route
  const getPageTitle = () => {
    if (path.includes('/suites/') && !path.endsWith('/suites')) {
      return "Suite Details";
    } else if (path.includes('/suites')) {
      return "Suites";
    } else if (path.includes('/orders')) {
      return "Orders";
    } else if (path.includes('/drink-orders')) {
      return "Drink Orders";
    } else if (path.includes('/dashboard')) {
      return "Dashboard";
    }
    return "Stadium Suite Service";
  };

  return (
    <div className="hidden md:flex justify-between items-center p-4 border-b bg-background">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        {(path.includes('/suites/') || path.includes('/orders')) && (
          <div className="ml-4 flex items-center text-sm text-muted-foreground">
            <Camera className="h-4 w-4 mr-1" />
            <span>Photo capture enabled</span>
          </div>
        )}
      </div>
      <ThemeToggle />
    </div>
  );
};

export default DesktopHeader;
