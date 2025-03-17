
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSuiteById } from "@/services/suitesService";
import { getMenuItems } from "@/services/mock";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Users, UserCircle, Building, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SuiteDetails = () => {
  const navigate = useNavigate();
  const { role, suiteId } = useParams();

  const { data: suite, isLoading, isError } = useQuery({
    queryKey: ["suite", suiteId],
    queryFn: () => getSuiteById(suiteId || ""),
    enabled: !!suiteId,
  });

  // Fetch menu items for price calculation
  const { data: menuItems = [] } = useQuery({
    queryKey: ["menuItems"],
    queryFn: () => getMenuItems(),
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !suite) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="rounded-lg border border-destructive p-8 text-center">
            <h2 className="text-lg font-medium">Suite not found</h2>
            <p className="text-muted-foreground">
              The suite you are looking for does not exist or has been removed.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: 'unsold' | 'sold' | 'cleaning') => {
    switch (status) {
      case 'unsold':
        return 'bg-green-500';
      case 'sold':
        return 'bg-blue-500';
      case 'cleaning':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusDisplay = (status: 'unsold' | 'sold' | 'cleaning') => {
    switch (status) {
      case 'unsold':
        return 'Unsold';
      case 'sold':
        return 'Sold';
      case 'cleaning':
        return 'Cleaning';
      default:
        return status;
    }
  };

  // Calculate total before tax based on actual menu items
  const calculateTotal = () => {
    if (!menuItems.length) return 0;
    
    // Use suite id to determine how many menu items to include in calculation
    const itemCount = Math.min(parseInt(suite.id), 5); // Limit to max 5 items
    
    // Get first N menu items based on suite id and sum their prices
    return menuItems
      .slice(0, itemCount)
      .reduce((total, item) => total + item.price, 0);
  };

  const totalBeforeTax = calculateTotal();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Suite {suite.number}</CardTitle>
                <Badge className={getStatusColor(suite.status)}>
                  {getStatusDisplay(suite.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="text-sm font-medium">Suite Details</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Level</span>
                    <span className="text-sm font-medium block">
                      {suite.level}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Section</span>
                    <span className="text-sm font-medium block">
                      {suite.section}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Capacity</span>
                    <span className="text-sm font-medium block">
                      {suite.capacity} people
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="text-sm font-medium block">
                      {getStatusDisplay(suite.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Additional Information</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Host(s):</span>
                    <span>{suite.hosts || "None assigned"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Owner:</span>
                    <span>{suite.owner || "Unspecified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last updated:</span>
                    <span>{new Date(suite.lastUpdated).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Total Before Tax:</span>
                    <span>${totalBeforeTax.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {suite.notes && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Notes</div>
                  <div className="rounded-md bg-muted p-3 text-sm">
                    {suite.notes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuiteDetails;
