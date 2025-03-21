
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import MobileSidebar from "./MobileSidebar";
import { useNavigate, useParams } from "react-router-dom";
import { getRoleTitle } from "@/utils/roleUtils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserStatusIndicator } from "@/components/user/UserStatusIndicator";
import { useUserStatusContext } from "@/providers/UserStatusProvider";

const MobileHeader = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { status } = useUserStatusContext();

  const handleTitleClick = () => {
    navigate(`/dashboard/${role}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <MobileSidebar />
      </Sheet>
      <div 
        className="flex-1 cursor-pointer" 
        onClick={handleTitleClick}
      >
        <h1 className="text-lg font-semibold">{getRoleTitle(role)} Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <UserStatusIndicator status={status} size="sm" />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default MobileHeader;
