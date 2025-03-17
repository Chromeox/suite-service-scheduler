
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  Grid, 
  Package, 
  MessageCircle, 
  Bell, 
  Timer, 
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetContent } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { getRoleIcon, getRoleTitle } from "@/utils/roleUtils";

const MobileSidebar = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate("/");
  };

  return (
    <SheetContent side="left" className="flex flex-col">
      <div className="flex items-center gap-2 py-4">
        {getRoleIcon(role)}
        <span className="text-lg font-semibold">{getRoleTitle(role)}</span>
      </div>
      <nav className="grid gap-2 text-sm">
        <Link
          to={`/dashboard/${role}/suites`}
          className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
        >
          <Grid className="h-4 w-4" />
          Assigned Suites
        </Link>
        <Link
          to={`/dashboard/${role}/orders`}
          className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
        >
          <Package className="h-4 w-4" />
          Food Orders
        </Link>
        <Link
          to={`/dashboard/${role}/communications`}
          className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
        >
          <MessageCircle className="h-4 w-4" />
          Communications
        </Link>
        <Link
          to={`/dashboard/${role}/notifications`}
          className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
        >
          <Bell className="h-4 w-4" />
          Notifications
        </Link>
        <Link
          to={`/dashboard/${role}/timers`}
          className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
        >
          <Timer className="h-4 w-4" />
          Timers
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
