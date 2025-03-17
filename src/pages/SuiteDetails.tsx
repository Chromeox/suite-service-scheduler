import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSuiteById, updateSuiteStatus } from "@/services/suitesService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, FileText, Users, ChevronDown } from "lucide-react";
import { Suite } from "@/types/suite";
import { toast } from "@/hooks/use-toast";

const SuiteDetails = () => {
  const { role, suiteId } = useParams<{ role: string; suiteId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: suite, isLoading } = useQuery({
    queryKey: ["suite", suiteId],
    queryFn: () => getSuiteById(suiteId || ""),
    enabled: !!suiteId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Suite["status"] }) => 
      updateSuiteStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suite", suiteId] });
      queryClient.invalidateQueries({ queryKey: ["suites"] });
      toast({
        title: "Status updated",
        description: "Suite status has been successfully updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (status: Suite["status"]) => {
    if (suite) {
      statusMutation.mutate({
        id: suite.id,
        status,
      });
    }
  };

  const getStatusColor = (status: Suite["status"]) => {
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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => navigate(`/dashboard/${role}/suites`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suites
          </Button>
        </div>

        {isLoading || !suite ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">Suite {suite.number}</CardTitle>
                    <CardDescription>{suite.name}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(suite.status)} px-3 py-1.5 text-md`}>
                    {suite.status.charAt(0).toUpperCase() + suite.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Location</div>
                    <div>Level {suite.level}, Section {suite.section}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Capacity</div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{suite.capacity} people</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(suite.lastUpdated).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {suite.notes && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-medium">
                      <FileText className="h-4 w-4" />
                      <span>Notes</span>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      {suite.notes}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/dashboard/${role}/suites/${suite.id}/edit`)}
                >
                  Edit Suite
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default">
                      Change Status
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange("vacant")}
                      disabled={suite.status === "vacant"}
                    >
                      Mark as Vacant
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange("occupied")}
                      disabled={suite.status === "occupied"}
                    >
                      Mark as Occupied
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange("cleaning")}
                      disabled={suite.status === "cleaning"}
                    >
                      Mark as Cleaning
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SuiteDetails;
