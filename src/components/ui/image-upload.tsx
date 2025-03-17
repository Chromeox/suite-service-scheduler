
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageCaptured: (imageFile: File, imageUrl: string) => void;
  className?: string;
  previewImage?: string;
  onClear?: () => void;
}

export function ImageUpload({ 
  onImageCaptured, 
  className = "", 
  previewImage,
  onClear
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(previewImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    reader.onload = () => {
      const imageUrl = reader.result as string;
      setPreview(imageUrl);
      onImageCaptured(file, imageUrl);
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
