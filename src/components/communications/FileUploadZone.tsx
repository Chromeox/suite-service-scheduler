import React, { useState, useRef, useCallback } from "react";
import { Upload, X, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isValidFile, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/services/chat/attachments";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  onCancel: () => void;
  className?: string;
  maxFiles?: number;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  onCancel,
  className,
  maxFiles = 5,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Format bytes to human-readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // Process files and validate them
  const processFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newErrors: string[] = [];
      const newFiles: File[] = [];

      // Check if adding these files would exceed the max limit
      if (selectedFiles.length + files.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `You can only upload up to ${maxFiles} files at once.`,
          variant: "destructive",
        });
        return;
      }

      // Validate each file
      Array.from(files).forEach((file) => {
        if (!isValidFile(file)) {
          if (file.size > MAX_FILE_SIZE) {
            newErrors.push(`${file.name} exceeds the maximum file size of ${formatBytes(MAX_FILE_SIZE)}.`);
          } else {
            newErrors.push(`${file.name} has an unsupported file type.`);
          }
        } else {
          newFiles.push(file);
        }
      });

      if (newErrors.length > 0) {
        setErrors((prev) => [...prev, ...newErrors]);
      }

      if (newFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [selectedFiles, maxFiles, toast]
  );

  // Handle drop event
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
    },
    [processFiles]
  );

  // Handle click on upload zone
  const handleClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Remove a file from the selected files
  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Clear all errors
  const handleClearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Handle upload button click
  const handleUpload = useCallback(() => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    onFilesSelected(selectedFiles);
  }, [selectedFiles, onFilesSelected, toast]);

  return (
    <div className={cn("p-4 border rounded-md", className)}>
      {/* File input (hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileInputChange}
        accept={ALLOWED_FILE_TYPES.join(",")}
      />

      {/* Drag and drop zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20",
          selectedFiles.length > 0 ? "mb-4" : ""
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Drag and drop files here or click to browse"
      >
        <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          Drag and drop files here or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Maximum file size: {formatBytes(MAX_FILE_SIZE)}
        </p>
      </div>

      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
              >
                <div className="flex items-center overflow-hidden">
                  <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatBytes(file.size)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemoveFile(index)}
                  aria-label={`Remove file ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-4 w-4 text-destructive mr-2" />
            <h4 className="text-sm font-medium text-destructive">Errors</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-auto"
              onClick={handleClearErrors}
              aria-label="Clear all errors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ul className="text-xs text-destructive space-y-1 list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          aria-label="Cancel file upload"
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0}
          aria-label={`Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? 'file' : 'files'}`}
        >
          Upload
        </Button>
      </div>
    </div>
  );
};

export default FileUploadZone;
