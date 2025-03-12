
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Package, 
  Users 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for suites
const MOCK_SUITES = [
  {
    id: "200-A",
    name: "200 Level Suite A",
    location: "200 Pantry",
    capacity: 18,
    status: "active",
    pendingOrders: 2,
    inProgressOrders: 1,
    completedOrders: 3,
  },
  {
    id: "200-B",
    name: "200 Level Suite B",
    location: "200 Pantry",
    capacity: 16,
    status: "active",
    pendingOrders: 0,
    inProgressOrders: 2,
    completedOrders: 1,
  },
  {
    id: "500-A",
    name: "500 Level Suite A",
    location: "500 Pantry",
    capacity: 14,
    status: "active",
    pendingOrders: 1,
    inProgressOrders: 0,
    completedOrders: 2,
  },
  {
    id: "500-B",
    name: "500 Level Suite B",
    location: "500 Pantry",
    capacity: 12,
    status: "inactive",
    pendingOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
  },
  {
    id: "200-K",
    name: "200 Kitchen Suite",
    location: "200 Kitchen Pantry",
    capacity: 20,
    status: "active",
    pendingOrders: 3,
    inProgressOrders: 1,
    completedOrders: 0,
  },
];

// Filter suites based on role
const getRoleSuites = (role: string, suites: typeof MOCK_SUITES) => {
  // Attendants manage 2-3 suites
  if (role === "attendant") {
    return suites.slice(0, 3);
  }
  // Runners assist/manage 4-7 suites
  else if (role === "runner") {
    return suites;
  }
  // Supervisors see all suites
  else {
    return suites;
  }
};

const Suites = () => {
  const { role } = useParams<{ role: string }>();
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [suites, setSuites] = useState(getRoleSuites(role || "", MOCK_SUITES));

  // Get unique locations
  const locations = Array.from(new Set(suites.map(suite => suite.location)));

  // Filter suites by location
  const filteredSuites = activeLocation 
    ? suites.filter(suite => suite.location === activeLocation)
    : suites;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Suites</h1>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Button 
              variant={activeLocation === null ? "default" : "outline"} 
              onClick={() => setActiveLocation(null)}
            >
              All
            </Button>
            {locations.map(location => (
              <Button 
                key={location}
                variant={activeLocation === location ? "default" : "outline"} 
                onClick={() => setActiveLocation(location)}
              >
                {location}
              </Button>
            ))}
          </div>
        </div>

        {/* Event information - In a real app, this would be dynamic */}
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>Today's Event</AlertTitle>
          <AlertDescription>
            Home Game vs. Visitors - 7:00 PM Start - Doors Open: 5:30 PM
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuites.map(suite => (
            <Card key={suite.id} className={`${suite.status === 'inactive' ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold">{suite.name}</CardTitle>
                  <Badge variant={suite.status === 'active' ? 'default' : 'outline'}>
                    {suite.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  Capacity: {suite.capacity}
                </div>
                <div className="text-sm text-muted-foreground">
                  Location: {suite.location}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center">
                    <Badge variant="outline" className="mb-1">
                      <Clock className="mr-1 h-3 w-3" />
                      {suite.pendingOrders}
                    </Badge>
                    <span className="text-xs">Pending</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Badge variant="outline" className="mb-1">
                      <Package className="mr-1 h-3 w-3" />
                      {suite.inProgressOrders}
                    </Badge>
                    <span className="text-xs">In Progress</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Badge variant="outline" className="mb-1">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      {suite.completedOrders}
                    </Badge>
                    <span className="text-xs">Completed</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button className="w-full">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Suites;
