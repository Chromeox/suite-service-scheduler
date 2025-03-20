
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const DrinkOrders = () => {
  const { role } = useParams<{ role: string }>();

  // Redirect to the Orders page with same role - no need for separate page
  return <Navigate to={`/dashboard/${role}/orders`} replace />;
};

export default DrinkOrders;
