
import React, { useState } from "react";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useOrdersQuery } from "@/hooks/orders/useOrdersQuery";
import { useQuery } from "@tanstack/react-query";
import { getMenuItems } from "@/services/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RevenueChart = () => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  
  // Fetch orders data
  const { data: orders = [] } = useOrdersQuery();
  
  // Fetch menu items for price calculation
  const { data: menuItems = [] } = useQuery({
    queryKey: ["menuItems"],
    queryFn: () => getMenuItems(),
  });

  // Create a mapping of item names to prices
  const itemPriceMap = menuItems.reduce((map, item) => {
    map[item.name] = item.price;
    return map;
  }, {} as Record<string, number>);

  // Process data for visualization
  const getRevenueData = () => {
    // For demo purposes, create synthetic revenue data
    // In a real app, this would be calculated from actual order history
    
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    let labels: string[] = [];
    let dataPoints = 7;
    
    if (period === "week") {
      labels = daysOfWeek;
    } else if (period === "month") {
      labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
      dataPoints = 30;
    } else if (period === "year") {
      labels = months;
      dataPoints = 12;
    }
    
    // Calculate estimated revenue by sampling order data
    // This is a simplified version for demonstration
    const totalRevenue = orders.reduce((total, order) => {
      return total + order.items.reduce((orderTotal, item) => {
        const price = itemPriceMap[item.name] || 10; // Default price if not found
        return orderTotal + (price * item.quantity);
      }, 0);
    }, 0);
    
    const avgPerDay = totalRevenue > 0 ? totalRevenue / (orders.length || 1) : 0;
    
    // Generate synthetic data based on the real average
    return Array.from({ length: dataPoints }, (_, i) => {
      // Create some variation for the demo
      const variationFactor = 0.5 + Math.random();
      return {
        name: labels[i % labels.length],
        revenue: Math.round(avgPerDay * variationFactor * 100) / 100,
        food: Math.round(avgPerDay * variationFactor * 0.7 * 100) / 100,
        beverage: Math.round(avgPerDay * variationFactor * 0.3 * 100) / 100,
      };
    });
  };

  const chartData = getRevenueData();

  // Calculate summary metrics
  const totalRevenue = chartData.reduce((total, day) => total + day.revenue, 0);
  const averageRevenue = totalRevenue / chartData.length;
  const foodRevenue = chartData.reduce((total, day) => total + day.food, 0);
  const beverageRevenue = chartData.reduce((total, day) => total + day.beverage, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg font-medium">Revenue Analysis</h3>
        <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-md">
          <Button
            onClick={() => setPeriod("week")}
            variant={period === "week" ? "default" : "ghost"}
            size="sm"
            className="rounded-md"
          >
            Week
          </Button>
          <Button
            onClick={() => setPeriod("month")}
            variant={period === "month" ? "default" : "ghost"}
            size="sm"
            className="rounded-md"
          >
            Month
          </Button>
          <Button
            onClick={() => setPeriod("year")}
            variant={period === "year" ? "default" : "ghost"}
            size="sm"
            className="rounded-md"
          >
            Year
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Revenue</div>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Food Revenue</div>
            <div className="text-2xl font-bold">${foodRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Beverage Revenue</div>
            <div className="text-2xl font-bold">${beverageRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="h-80 w-full">
        <ChartContainer
          config={{
            revenue: {
              color: '#2563eb',
              label: 'Total Revenue',
            },
            food: {
              color: '#10b981',
              label: 'Food Revenue',
            },
            beverage: {
              color: '#f59e0b',
              label: 'Beverage Revenue',
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-revenue)" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="food" 
                stroke="var(--color-food)" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="beverage" 
                stroke="var(--color-beverage)" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
