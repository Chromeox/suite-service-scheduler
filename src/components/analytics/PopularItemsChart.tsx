
import React, { useState } from "react";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useOrdersQuery } from "@/hooks/orders/useOrdersQuery";

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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Popular Menu Items</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("week")}
            className={`px-3 py-1 text-sm rounded-md ${
              period === "week" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-3 py-1 text-sm rounded-md ${
              period === "month" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setPeriod("year")}
            className={`px-3 py-1 text-sm rounded-md ${
              period === "year" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="h-80 flex">
        <div className="w-1/2 h-full">
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
        
        <div className="w-1/2 pl-4">
          <h4 className="text-md font-medium mb-4">Top Items Ordered</h4>
          <div className="space-y-2">
            {chartData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="truncate max-w-[200px]">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularItemsChart;
