
import React from "react";
import RoleSelector from "@/components/RoleSelector";

const RoleSelect = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Select Your Role</h1>
          <p className="text-muted-foreground">
            Choose which role you're working as today
          </p>
        </div>
        <RoleSelector />
      </div>
    </div>
  );
};

export default RoleSelect;
