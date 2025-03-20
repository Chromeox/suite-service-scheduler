
import React, { useState } from "react";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useOrdersQuery } from "@/hooks/orders/useOrdersQuery";
import { Button } from "@/components/ui/button";

const COLORS = ['#2563eb', '#4f46e5', '#7c3aed', '#a855f7', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308'];

const PopularItemsChart = () => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  
  // Fetch orders data
  const { data: orders = [] } = useOrdersQuery();

  // Process data for visualization
  const getPopularItemsData = () => {
    // Count item occurrences across all orders
    const itemCounts = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        const itemName = item.name;
        if (!acc[itemName]) {
          acc[itemName] = 0;
        }
        acc[itemName] += item.quantity;
      });
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort
    return Object.entries(itemCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 items
  };

  const chartData = getPopularItemsData();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg font-medium">Popular Menu Items</h3>
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

      <div className="h-80 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-80 md:h-full">
          <ChartContainer
            config={
              chartData.reduce((acc, item, index) => {
                acc[item.name] = { color: COLORS[index % COLORS.length], label: item.name };
                return acc;
              }, {} as any)
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="w-full md:w-1/2 md:pl-6 pt-4 md:pt-0">
          <h4 className="text-md font-medium mb-4">Top Items Ordered</h4>
          <div className="space-y-3">
            {chartData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded-md bg-secondary/50">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="truncate max-w-[200px]">{item.name}</span>
                </div>
                <span className="font-medium ml-4">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularItemsChart;
