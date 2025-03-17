
import React, { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSuiteById } from "@/services/suitesService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SuiteDetailsCard from "@/components/suites/SuiteDetailsCard";
import SuiteImagesTab from "@/components/suites/SuiteImagesTab";
import { useSuiteCalculation } from "@/hooks/useSuiteCalculation";

const SuiteDetails = () => {
  const navigate = useNavigate();
  const { suiteId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  
  // Form state for extracted data
  const [suiteData, setSuiteData] = useState({
    number: "",
    capacity: 0,
    level: "",
    hosts: "",
    owner: "",
    notes: ""
  });

  const { totalBeforeTax } = useSuiteCalculation(suiteId);
  
  const { data: suite, isLoading, isError } = useQuery({
    queryKey: ["suite", suiteId],
    queryFn: () => getSuiteById(suiteId || ""),
    enabled: !!suiteId
  });

  // Update suite data when the suite data is loaded
  React.useEffect(() => {
    if (suite) {
      setSuiteData({
        number: suite.number || "",
        capacity: suite.capacity || 0,
        level: suite.level || "",
        hosts: suite.hosts || "",
        owner: suite.owner || "",
        notes: suite.notes || ""
      });
    }
  }, [suite]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSuiteData({
      ...suiteData,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    });
  };

  const handleExtractedData = useCallback((data: any) => {
    // Update form with extracted data, preserving existing data for missing fields
    setSuiteData(prevData => ({
      number: data.number || prevData.number,
      capacity: data.capacity || prevData.capacity,
      level: data.level || prevData.level,
      hosts: data.hosts || prevData.hosts,
      owner: data.owner || prevData.owner,
      notes: data.notes || prevData.notes
    }));
    
    // Switch to details tab to show the extracted information
    setActiveTab("details");
  }, []);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Suite Details</TabsTrigger>
            <TabsTrigger value="images">
              Images
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <div className="grid gap-6 md:grid-cols-2">
              <SuiteDetailsCard 
                suiteData={suiteData}
                handleInputChange={handleInputChange}
                totalBeforeTax={totalBeforeTax}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="images">
            <SuiteImagesTab 
              suiteNumber={suite.number} 
              onExtractedData={handleExtractedData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SuiteDetails;
