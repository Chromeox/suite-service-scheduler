
import React from "react";
import { Clock, Package, ShoppingBag, User, UserCheck, Users } from "lucide-react";

export const getRoleIcon = (role?: string) => {
  switch (role) {
    case "attendant":
      return <User className="h-6 w-6" />;
    case "runner":
      return <Package className="h-6 w-6" />;
    case "supervisor":
      return <Users className="h-6 w-6" />;
    case "zcp":
      return <Clock className="h-6 w-6" />;
    case "kitchen":
      return <ShoppingBag className="h-6 w-6" />;
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
    case "zcp":
      return "Zone Control Point";
    case "kitchen":
      return "Kitchen Staff";
    default:
      return "Dashboard";
  }
};

export const getRoleDescription = (role?: string) => {
  switch (role) {
    case "attendant":
      return "Manage suite services and handle guest requests";
    case "runner":
      return "Deliver orders to suites and transport items between locations";
    case "supervisor":
      return "Oversee all suite operations and staff";
    case "zcp":
      return "Coordinate order timing and preparation for delivery";
    case "kitchen":
      return "Prepare food orders for suite delivery";
    default:
      return "View operations dashboard";
  }
};

export const getDeliveryAbbreviation = (role?: string) => {
  switch (role) {
    case "attendant":
      return "3C";  // 3C appears to be code for attendant based on the sheets
    case "runner":
      return "2CP"; // 2CP appears to be code for runners
    case "zcp":
      return "ZCP"; // Zone Control Point
    default:
      return "";
  }
};
