
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserCircle, Building, DollarSign } from "lucide-react";
import { Suite } from "@/types/suite";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMenuItems } from "@/services/mock";

interface SuiteCardProps {
  suite: Suite;
}

const SuiteCard = ({ suite }: SuiteCardProps) => {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();

  // Fetch menu items for price calculation
  const { data: menuItems = [] } = useQuery({
    queryKey: ["menuItems"],
    queryFn: () => getMenuItems(),
  });

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

  // Calculate total before tax based on suite id
  // Using suite id to determine number of menu items to include
  const calculateTotal = () => {
    if (!menuItems.length) return 0;
    
    // Use suite id to determine how many menu items to include in calculation
    const itemCount = Math.min(parseInt(suite.id), 3); // Limit to max 3 items
    
    // Get first N menu items based on suite id and sum their prices
    return menuItems
      .slice(0, itemCount)
      .reduce((total, item) => total + item.price, 0);
  };

  const totalBeforeTax = calculateTotal();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Suite {suite.number}</CardTitle>
          <Badge className={getStatusColor(suite.status)}>
            {getStatusDisplay(suite.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>Capacity: {suite.capacity}</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <UserCircle className="h-3.5 w-3.5" />
            <span>Host(s): {suite.hosts || "None assigned"}</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Building className="h-3.5 w-3.5" />
            <span>Owner: {suite.owner || "Unspecified"}</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Total Before Tax: ${totalBeforeTax.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          size="sm" 
          className="w-full"
          onClick={() => navigate(`/dashboard/${role}/suites/${suite.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuiteCard;
