
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

      {/* Desktop sidebar */}
      <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
        <DesktopSidebar />
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
