
import React from "react";
import { User, UserCheck, Users } from "lucide-react";

export const getRoleIcon = (role?: string) => {
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

export const getRoleTitle = (role?: string) => {
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
