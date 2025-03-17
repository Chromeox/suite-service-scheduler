
import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const DesktopHeader = () => {
  return (
    <div className="hidden md:flex justify-end items-center p-4 border-b bg-background">
      <ThemeToggle />
    </div>
  );
};

export default DesktopHeader;
