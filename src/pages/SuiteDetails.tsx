
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSuiteById } from "@/services/suitesService";
import { getMenuItems } from "@/services/mock";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, UserCircle, Building, DollarSign, ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUpload } from "@/components/ui/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const SuiteDetails = () => {
  const navigate = useNavigate();
  const { role, suiteId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [suiteImages, setSuiteImages] = useState<{file?: File, url?: string}[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form state for extracted data
  const [suiteData, setSuiteData] = useState({
    number: "",
    capacity: 0,
    level: "",
    hosts: "",
    owner: "",
    notes: ""
  });
  
  const [isExtractedDataPending, setIsExtractedDataPending] = useState(false);

  const { data: suite, isLoading, isError } = useQuery({
    queryKey: ["suite", suiteId],
    queryFn: () => getSuiteById(suiteId || ""),
    enabled: !!suiteId,
    onSuccess: (data) => {
      if (data) {
        setSuiteData({
          number: data.number || "",
          capacity: data.capacity || 0,
          level: data.level || "",
          hosts: data.hosts || "",
          owner: data.owner || "",
          notes: data.notes || ""
        });
      }
    }
  });

  // Fetch menu items for price calculation
  const { data: menuItems = [] } = useQuery({
    queryKey: ["menuItems"],
    queryFn: () => getMenuItems(),
  });

  const handleImageCaptured = (imageFile: File, imageUrl: string) => {
    setSuiteImages([...suiteImages, { file: imageFile, url: imageUrl }]);
  };

  const handleExtractedData = (data: any) => {
    setIsExtractedDataPending(true);
    
    // Update form with extracted data, preserving existing data for missing fields
    setSuiteData(prevData => ({
      number: data.number || prevData.number,
      capacity: data.capacity || prevData.capacity,
      level: data.level || prevData.level,
      hosts: data.hosts || prevData.hosts,
      owner: data.owner || prevData.owner,
      notes: data.notes || prevData.notes
    }));
    
    setIsExtractedDataPending(false);
    
    // Switch to details tab to show the extracted information
    setActiveTab("details");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSuiteData({
      ...suiteData,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    });
  };

  const handleSaveImages = async () => {
    if (suiteImages.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // This is a mock implementation - in a real app, you would upload to a server or storage service
      // For now, we'll just simulate a delay and show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Images saved",
        description: `${suiteImages.length} image(s) saved successfully for Suite ${suite?.number}`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to save images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

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

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Suite Details</TabsTrigger>
            <TabsTrigger value="images">
              Images
              {suiteImages.length > 0 && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {suiteImages.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Suite {suiteData.number}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <div className="text-sm font-medium">Suite Details</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground" htmlFor="level">Level</label>
                        <input 
                          type="text" 
                          id="level" 
                          name="level"
                          value={suiteData.level} 
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground" htmlFor="capacity">Capacity</label>
                        <input 
                          type="number" 
                          id="capacity" 
                          name="capacity"
                          value={suiteData.capacity} 
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Additional Information</div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground flex items-center gap-2" htmlFor="hosts">
                          <UserCircle className="h-4 w-4" />
                          Host(s)
                        </label>
                        <input 
                          type="text" 
                          id="hosts" 
                          name="hosts"
                          value={suiteData.hosts} 
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground flex items-center gap-2" htmlFor="owner">
                          <Building className="h-4 w-4" />
                          Owner
                        </label>
                        <input 
                          type="text" 
                          id="owner" 
                          name="owner"
                          value={suiteData.owner} 
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Total Before Tax:</span>
                        <span>${totalBeforeTax.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="notes">Notes</label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={suiteData.notes}
                      onChange={handleInputChange}
                      placeholder="Add notes about this suite..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <Button className="w-full">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Suite Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {suiteImages.map((image, index) => (
                      <div key={index} className="border rounded-md overflow-hidden">
                        {image.url && (
                          <img 
                            src={image.url} 
                            alt={`Suite ${suite.number} documentation ${index + 1}`} 
                            className="w-full h-auto object-cover"
                          />
                        )}
                      </div>
                    ))}
                    <div className="border rounded-md p-4">
                      <ImageUpload 
                        onImageCaptured={handleImageCaptured}
                        onExtractedData={handleExtractedData}
                        autoExtract={true}
                      />
                    </div>
                  </div>
                  
                  {suiteImages.length > 0 && (
                    <Button 
                      className="w-full" 
                      onClick={handleSaveImages}
                      disabled={isUploading}
                    >
                      {isUploading ? "Saving Images..." : "Save Images"}
                    </Button>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Upload photos of:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Order forms</li>
                      <li>Suite condition before/after events</li>
                      <li>Special requests</li>
                      <li>Guest information</li>
                    </ul>
                    <p className="mt-2 font-medium text-primary">
                      Images will be automatically analyzed to extract suite information!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SuiteDetails;
