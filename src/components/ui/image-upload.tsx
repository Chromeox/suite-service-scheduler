
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Loader2, ZoomIn, RotateCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useHapticFeedback } from "@/hooks/use-haptics";

interface ImageUploadProps {
  onImageCaptured: (imageFile: File, imageUrl: string) => void;
  className?: string;
  previewImage?: string;
  onClear?: () => void;
  onExtractedData?: (data: any) => void;
  autoExtract?: boolean;
  scanMode?: boolean;
}

export function ImageUpload({ 
  onImageCaptured, 
  className = "", 
  previewImage,
  onClear,
  onExtractedData,
  autoExtract = false,
  scanMode = false
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(previewImage);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { triggerHaptic, successFeedback, errorFeedback } = useHapticFeedback();

  // Implement native camera functionality if Capacitor is available
  const useNativeCamera = async () => {
    triggerHaptic();
    
    try {
      // Check if the Camera plugin is available
      if (typeof window !== 'undefined' && 'Capacitor' in window) {
        const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
        
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.DataUrl,
          source: scanMode ? CameraSource.Camera : CameraSource.Prompt,
          promptLabelHeader: scanMode ? "Scan Document" : "Take Photo",
          promptLabelCancel: "Cancel",
          promptLabelPhoto: "From Gallery",
          promptLabelPicture: "Take Photo"
        });
        
        if (image.dataUrl) {
          // Convert dataUrl to File object
          const response = await fetch(image.dataUrl);
          const blob = await response.blob();
          const file = new File([blob], `image_${Date.now()}.jpeg`, { type: 'image/jpeg' });
          
          successFeedback();
          setPreview(image.dataUrl);
          onImageCaptured(file, image.dataUrl);
          
          // Analyze image if autoExtract is enabled
          if (autoExtract) {
            await analyzeImage(image.dataUrl);
          }
        }
      } else {
        // Fallback to traditional file input on web
        cameraInputRef.current?.click();
      }
    } catch (error) {
      console.error("Camera error:", error);
      errorFeedback();
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please try again.",
        variant: "destructive"
      });
      // Fallback to traditional file input
      cameraInputRef.current?.click();
    }
  };

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
        successFeedback();
        toast({
          title: "Information extracted",
          description: "Suite details have been extracted from the image",
        });
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      errorFeedback();
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
      errorFeedback();
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
      successFeedback();
      
      // Analyze image if autoExtract is enabled
      if (autoExtract) {
        await analyzeImage(imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    triggerHaptic();
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    useNativeCamera();
  };

  const handleClearImage = () => {
    triggerHaptic();
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
          <div className="absolute top-2 right-2 flex gap-2">
            {scanMode && (
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/80"
                onClick={() => {
                  triggerHaptic();
                  if (preview && autoExtract && onExtractedData) {
                    analyzeImage(preview);
                  }
                }}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleClearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
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
              {scanMode ? "Scan Document" : "Take Photo"}
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
            {scanMode 
              ? "Scan forms to automatically extract data" 
              : "Capture or upload an image of order forms or suite details"}
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
