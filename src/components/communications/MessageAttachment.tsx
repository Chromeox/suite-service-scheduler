import React from "react";
import { MessageAttachment as MessageAttachmentType } from "@/services/chat/types";
import { Download, FileText, Image, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageAttachmentProps {
  attachment: MessageAttachmentType;
  className?: string;
}

// Format file size to human-readable format
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const MessageAttachment: React.FC<MessageAttachmentProps> = ({ 
  attachment,
  className
}) => {
  const isImage = attachment.file_type.startsWith("image/");
  
  const handleDownload = () => {
    // Create a temporary link to download the file
    const link = document.createElement("a");
    link.href = attachment.file_url;
    link.download = attachment.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className={cn("flex flex-col border rounded-md overflow-hidden max-w-xs", className)}>
      {isImage ? (
        <div className="relative">
          <img 
            src={attachment.file_url} 
            alt={`Image: ${attachment.file_name}`}
            className="w-full h-auto max-h-48 object-contain bg-gray-100"
            loading="lazy"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
            onClick={handleDownload}
            aria-label={`Download image: ${attachment.file_name}`}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center p-3 bg-muted/50">
          {attachment.file_type.includes("pdf") ? (
            <FileText className="h-8 w-8 text-red-500 mr-3" />
          ) : attachment.file_type.includes("word") || attachment.file_type.includes("document") ? (
            <FileText className="h-8 w-8 text-blue-500 mr-3" />
          ) : attachment.file_type.includes("excel") || attachment.file_type.includes("sheet") ? (
            <FileText className="h-8 w-8 text-green-500 mr-3" />
          ) : attachment.file_type.includes("presentation") || attachment.file_type.includes("powerpoint") ? (
            <FileText className="h-8 w-8 text-orange-500 mr-3" />
          ) : (
            <File className="h-8 w-8 text-gray-500 mr-3" />
          )}
          
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{attachment.file_name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(attachment.file_size)}</p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={handleDownload}
            aria-label={`Download file: ${attachment.file_name}`}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageAttachment;
