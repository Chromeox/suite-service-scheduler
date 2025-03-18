
import React, { useState } from "react";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useOrdersQuery } from "@/hooks/orders/useOrdersQuery";
import { getSuites } from "@/services/suitesService";
import { useQuery } from "@tanstack/react-query";

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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Suite Usage Analysis</h3>
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

      <div className="h-80">
        <ChartContainer
          config={{
            orders: {
              color: '#2563eb',
              label: 'Orders',
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="suite" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="orders" fill="var(--color-orders)" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default SuiteUsageChart;
