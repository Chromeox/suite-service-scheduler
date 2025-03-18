
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useOrdersQuery } from "@/hooks/orders/useOrdersQuery";
import { getSuites } from "@/services/suitesService";
import { useQuery } from "@tanstack/react-query";

const AnalyticsSummary = () => {
  // Fetch orders data
  const { data: orders = [] } = useOrdersQuery();
  
  // Fetch suites data
  const { data: suites = [] } = useQuery({
    queryKey: ["suites"],
    queryFn: getSuites,
  });

  // Calculate summary metrics
  const totalSuites = suites.length;
  const activeOrders = orders.filter(order => order.status !== "completed" && order.status !== "cancelled").length;
  const totalOrderItems = orders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  
  // Calculate average order value
  const averageItems = orders.length > 0 
    ? (totalOrderItems / orders.length).toFixed(1) 
    : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{totalSuites}</div>
          <p className="text-muted-foreground">Total Suites</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{orders.length}</div>
          <p className="text-muted-foreground">Total Orders</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{activeOrders}</div>
          <p className="text-muted-foreground">Active Orders</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{averageItems}</div>
          <p className="text-muted-foreground">Avg Items Per Order</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSummary;
