
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  onImageCaptured: (imageFile: File, imageUrl: string) => void;
  className?: string;
  previewImage?: string;
  onClear?: () => void;
  onExtractedData?: (data: any) => void;
  autoExtract?: boolean;
}

export function ImageUpload({ 
  onImageCaptured, 
  className = "", 
  previewImage,
  onClear,
  onExtractedData,
  autoExtract = false
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(previewImage);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const analyzeImage = async (imageUrl: string) => {
    if (!autoExtract || !onExtractedData) return;
    
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-suite-image', {
        body: { image: imageUrl },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success && data.data) {
        onExtractedData(data.data);
        toast({
          title: "Information extracted",
          description: "Suite details have been extracted from the image",
        });
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis failed",
        description: "Could not extract information from the image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const imageUrl = reader.result as string;
      setPreview(imageUrl);
      onImageCaptured(file, imageUrl);
      
      // Analyze image if autoExtract is enabled
      if (autoExtract) {
        await analyzeImage(imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleClearImage = () => {
    setPreview(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (onClear) onClear();
  };

  return (
    <div className={`${className}`}>
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-auto rounded-md object-contain max-h-80" 
          />
          {isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
              <div className="flex flex-col items-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <span>Analyzing image...</span>
              </div>
            </div>
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleClearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleCameraClick}
            >
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleUploadClick}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Capture or upload an image of order forms or suite details
          </p>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={cameraInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />
    </div>
  );
}
