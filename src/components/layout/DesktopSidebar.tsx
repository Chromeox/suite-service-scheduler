
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  Grid, 
  Package, 
  MessageCircle, 
  Wine, 
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getRoleIcon, getRoleTitle } from "@/utils/roleUtils";

const DesktopSidebar = () => {
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
    <aside className="hidden border-r bg-background md:block">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center gap-2">
            {getRoleIcon(role)}
            <span className="text-lg font-semibold">{getRoleTitle(role)}</span>
          </div>
        </div>
        <nav className="grid gap-1 px-2 py-2">
          <Link
            to={`/dashboard/${role}/suites`}
            className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
          >
            <Grid className="h-4 w-4" />
            Suites
          </Link>
          <Link
            to={`/dashboard/${role}/orders`}
            className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
          >
            <Package className="h-4 w-4" />
            Food Orders
          </Link>
          {role === "attendant" && (
            <Link
              to={`/dashboard/${role}/drink-orders`}
              className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
            >
              <Wine className="h-4 w-4" />
              Drink Orders
            </Link>
          )}
          <Link
            to={`/dashboard/${role}/communications`}
            className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
          >
            <MessageCircle className="h-4 w-4" />
            Communications
          </Link>
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
};

export default DesktopSidebar;
