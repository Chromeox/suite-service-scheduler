
import React from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { 
  Grid, 
  Package, 
  MessageCircle, 
  LogOut,
  LayoutDashboard,
  Blocks,
  Home,
  ShoppingCart,
  Utensils,
  BarChart3,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getRoleIcon, getRoleTitle } from "@/utils/roleUtils";
import { useRouteUtils } from "@/hooks/useRouteUtils";

export default function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();
  const { getBasePath, isActiveRoute } = useRouteUtils();
  const basePath = getBasePath(role);

  // Menu items config
  const menuItems = [
    { path: "", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: "suites", label: "Suites", icon: <Home className="w-5 h-5" /> },
    { path: "orders", label: "Orders", icon: <ShoppingCart className="w-5 h-5" /> },
    { path: "beverages", label: "Menu", icon: <Utensils className="w-5 h-5" /> },
    { path: "analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { path: "communications", label: "Communications", icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate("/");
  };

  return (
    <aside className="hidden border-r bg-sidebar md:block">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center gap-2">
            {getRoleIcon(role)}
            <span className="text-lg font-semibold">{getRoleTitle(role)}</span>
          </div>
        </div>
        <nav className="grid gap-1 px-2 py-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={`${basePath}${item.path}`}
              className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent transition-colors ${
                isActiveRoute(`${basePath}${item.path}`) ? 'bg-accent text-accent-foreground font-medium' : ''
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
