
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { Suite } from "@/types/suite";
import { useNavigate, useParams } from "react-router-dom";

interface SuiteCardProps {
  suite: Suite;
}

const SuiteCard = ({ suite }: SuiteCardProps) => {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();

  const getStatusColor = (status: Suite['status']) => {
    switch (status) {
      case 'vacant':
        return 'bg-green-500';
      case 'occupied':
        return 'bg-blue-500';
      case 'cleaning':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Suite {suite.number}</CardTitle>
          <Badge className={getStatusColor(suite.status)}>
            {suite.status.charAt(0).toUpperCase() + suite.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div className="text-sm font-medium">{suite.name}</div>
          <div className="text-sm text-muted-foreground">Level {suite.level}, Section {suite.section}</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>Capacity: {suite.capacity}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated: {new Date(suite.lastUpdated).toLocaleString()}</span>
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
