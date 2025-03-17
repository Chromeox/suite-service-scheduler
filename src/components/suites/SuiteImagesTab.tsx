
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "@/hooks/use-toast";

interface SuiteImagesTabProps {
  suiteNumber: string;
  onExtractedData: (data: any) => void;
}

const SuiteImagesTab: React.FC<SuiteImagesTabProps> = ({ 
  suiteNumber,
  onExtractedData
}) => {
  const [suiteImages, setSuiteImages] = useState<{file?: File, url?: string}[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageCaptured = (imageFile: File, imageUrl: string) => {
    setSuiteImages([...suiteImages, { file: imageFile, url: imageUrl }]);
  };

  const handleSaveImages = async () => {
    if (suiteImages.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // This is a mock implementation - in a real app, you would upload to a server or storage service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Images saved",
        description: `${suiteImages.length} image(s) saved successfully for Suite ${suiteNumber}`,
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

  return (
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
                    alt={`Suite ${suiteNumber} documentation ${index + 1}`} 
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            ))}
            <div className="border rounded-md p-4">
              <ImageUpload 
                onImageCaptured={handleImageCaptured}
                onExtractedData={onExtractedData}
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
  );
};

export default SuiteImagesTab;
