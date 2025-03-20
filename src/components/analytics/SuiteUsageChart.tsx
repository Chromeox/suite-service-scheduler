
import React, { useState } from "react";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useOrdersQuery } from "@/hooks/orders/useOrdersQuery";
import { getSuites } from "@/services/suitesService";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const SuiteUsageChart = () => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  
  // Fetch orders data
  const { data: orders = [] } = useOrdersQuery();
  
  // Fetch suites data
  const { data: suites = [] } = useQuery({
    queryKey: ["suites"],
    queryFn: getSuites,
  });

  // Process data for visualization
  const getSuiteUsageData = () => {
    // Group orders by suite
    const suiteOrders = orders.reduce((acc, order) => {
      const suiteId = order.suiteId;
      if (!acc[suiteId]) {
        acc[suiteId] = 0;
      }
      acc[suiteId]++;
      return acc;
    }, {} as Record<string, number>);

    // Create data for chart
    return Object.entries(suiteOrders)
      .map(([suiteId, count]) => ({
        suite: `Suite ${suiteId}`,
        orders: count,
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 10); // Top 10 suites
  };

  const chartData = getSuiteUsageData();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg font-medium">Suite Usage Analysis</h3>
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

      <div className="h-80 w-full">
        <ChartContainer
          config={{
            orders: {
              color: 'var(--primary)',
              label: 'Orders',
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="suite" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="orders" fill="var(--color-orders)" barSize={30} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default SuiteUsageChart;
