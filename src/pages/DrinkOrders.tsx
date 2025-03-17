
import React from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wine, Beer, Coffee, Martini } from "lucide-react";

const DrinkOrders = () => {
  const { role } = useParams<{ role: string }>();

  // Redirect if not attendant role
  if (role !== "attendant") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">Only attendants can access the drink orders section.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Drink Orders</h1>
          <p className="text-muted-foreground">Manage beverage service for assigned suites</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Beer className="h-5 w-5 text-primary" />
                <CardTitle>Beer Service</CardTitle>
              </div>
              <CardDescription>Craft, domestic and imported beers</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Track and manage beer orders across your assigned suites.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wine className="h-5 w-5 text-primary" />
                <CardTitle>Wine Service</CardTitle>
              </div>
              <CardDescription>Red, white and sparkling wines</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Manage wine service and maintain proper inventory levels.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Martini className="h-5 w-5 text-primary" />
                <CardTitle>Cocktail Service</CardTitle>
              </div>
              <CardDescription>Signature and classic cocktails</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Track cocktail orders and spirit consumption for each suite.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
                <CardTitle>Non-Alcoholic</CardTitle>
              </div>
              <CardDescription>Sodas, coffee, tea and water</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Manage non-alcoholic beverage service for all guests.</p>
            </CardContent>
          </Card>
        </div>

        {/* Content for future implementation */}
        <Card className="p-6">
          <p className="text-muted-foreground text-center">
            Advanced drink order management features coming soon.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DrinkOrders;
