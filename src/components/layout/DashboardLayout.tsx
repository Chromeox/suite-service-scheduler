
import React, { ReactNode } from "react";
import MobileHeader from "./MobileHeader";
import DesktopSidebar from "./DesktopSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile header */}
      <MobileHeader />

      {/* Desktop sidebar with main content */}
      <div className="flex min-h-screen w-full">
        <div className="hidden md:block md:w-[240px] flex-shrink-0">
          <DesktopSidebar />
        </div>
        <main className="flex flex-col flex-1 w-full overflow-x-hidden">
          <div className="flex-1 p-4 md:p-6 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
