
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  Grid, 
  Package, 
  MessageCircle, 
  LogOut,
  LayoutDashboard,
  Home,
  ShoppingCart,
  Utensils,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetContent } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { getRoleIcon, getRoleTitle } from "@/utils/roleUtils";
import { useRouteUtils } from "@/hooks/useRouteUtils";

const MobileSidebar = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { getBasePath, isActiveRoute } = useRouteUtils();
  const basePath = getBasePath(role);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate("/");
  };

  return (
    <SheetContent side="left" className="flex flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 py-4">
        {getRoleIcon(role)}
        <span className="text-lg font-semibold">{getRoleTitle(role)}</span>
      </div>
      <nav className="grid gap-2 text-sm">
        <Link
          to={`${basePath}`}
          className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
            isActiveRoute(basePath) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          to={`${basePath}suites`}
          className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
            isActiveRoute(`${basePath}suites`) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
          }`}
        >
          <Home className="h-4 w-4" />
          Suites
        </Link>
        <Link
          to={`${basePath}orders`}
          className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
            isActiveRoute(`${basePath}orders`) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          Orders
        </Link>
        <Link
          to={`${basePath}beverages`}
          className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
            isActiveRoute(`${basePath}beverages`) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
          }`}
        >
          <Utensils className="h-4 w-4" />
          Menu
        </Link>
        <Link
          to={`${basePath}communications`}
          className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
            isActiveRoute(`${basePath}communications`) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Communications
        </Link>
      </nav>
      <div className="mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </SheetContent>
  );
};

export default MobileSidebar;
