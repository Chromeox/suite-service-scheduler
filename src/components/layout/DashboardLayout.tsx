
import React, { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  Bell, 
  Grid, 
  Menu, 
  MessageCircle, 
  Package, 
  Timer, 
  User, 
  UserCheck, 
  Users, 
  X,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();

  const getRoleIcon = () => {
    switch (role) {
      case "attendant":
        return <User className="h-6 w-6" />;
      case "runner":
        return <UserCheck className="h-6 w-6" />;
      case "supervisor":
        return <Users className="h-6 w-6" />;
      default:
        return <User className="h-6 w-6" />;
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case "attendant":
        return "Suite Attendant";
      case "runner":
        return "Suite Runner";
      case "supervisor":
        return "Supervisor";
      default:
        return "Dashboard";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <div className="flex items-center gap-2 py-4">
              {getRoleIcon()}
              <span className="text-lg font-semibold">{getRoleTitle()}</span>
            </div>
            <nav className="grid gap-2 text-sm">
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
                Orders
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
        </Sheet>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{getRoleTitle()} Dashboard</h1>
        </div>
      </header>

      {/* Desktop sidebar */}
      <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-background md:block">
          <div className="flex h-full flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4">
              <div className="flex items-center gap-2">
                {getRoleIcon()}
                <span className="text-lg font-semibold">{getRoleTitle()}</span>
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
                Orders
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
        <main className="flex flex-col">
          <div className="flex-1 p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
