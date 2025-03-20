
import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ShoppingCart, Home, Utensils, MessageSquare, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouteUtils } from "@/hooks/useRouteUtils";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useParams<{ role: string }>();
  const { getBasePath } = useRouteUtils();
  
  const basePath = getBasePath(role);
  
  // Define navigation items
  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Suites",
      path: `${basePath}suites`
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Orders",
      path: `${basePath}orders`
    },
    {
      icon: <Utensils className="h-5 w-5" />,
      label: "Menu",
      path: `${basePath}beverages`
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Chats",
      path: `${basePath}communications`
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center justify-center h-full w-full rounded-none ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
