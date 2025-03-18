
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SuiteUsageChart from "@/components/analytics/SuiteUsageChart";
import PopularItemsChart from "@/components/analytics/PopularItemsChart";
import RevenueChart from "@/components/analytics/RevenueChart";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";

const SuiteAnalytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Suite Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Analyze suite usage, popular menu items, and revenue insights
          </p>
        </div>

        <AnalyticsSummary />

        <Tabs defaultValue="usage" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="usage">Suite Usage</TabsTrigger>
            <TabsTrigger value="menu">Popular Items</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          <TabsContent value="usage" className="p-4 border rounded-lg">
            <SuiteUsageChart />
          </TabsContent>
          <TabsContent value="menu" className="p-4 border rounded-lg">
            <PopularItemsChart />
          </TabsContent>
          <TabsContent value="revenue" className="p-4 border rounded-lg">
            <RevenueChart />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SuiteAnalytics;
