
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FileUploadZone from "./FileUploadZone";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string, isPriority: boolean, files?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  placeholder = "Type your message here...",
  disabled = false,
  className
}) => {
  const [message, setMessage] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFiles.length > 0) {
      onSendMessage(message, isPriority, selectedFiles.length > 0 ? selectedFiles : undefined);
      setMessage("");
      setIsPriority(false);
      setSelectedFiles([]);
    }
  };
  
  const handleFileButtonClick = () => {
    setShowFileUpload(true);
  };
  
  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setShowFileUpload(false);
  };
  
  const handleCancelFileUpload = () => {
    setShowFileUpload(false);
  };
  
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("border-t p-3 bg-background dark:border-gray-800", className)}>
      {showFileUpload ? (
        <FileUploadZone 
          onFilesSelected={handleFilesSelected}
          onCancel={handleCancelFileUpload}
        />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          {selectedFiles.length > 0 && (
            <div className="p-2 border rounded-md mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Attachments ({selectedFiles.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-muted/50 dark:bg-gray-800 rounded-full px-2 py-1 text-xs"
                  >
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1"
                      onClick={() => handleRemoveFile(index)}
                      aria-label={`Remove file ${file.name}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] resize-none dark:bg-gray-900"
            disabled={disabled}
            aria-label="Message content"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (message.trim() || selectedFiles.length > 0) {
                  handleSubmit(e as any);
                }
              }
            }}
          />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="priority" 
                  checked={isPriority}
                  onCheckedChange={(checked) => setIsPriority(checked === true)}
                  disabled={disabled}
                  aria-label="Mark message as priority"
                />
                <Label htmlFor="priority" className={cn("text-sm font-medium cursor-pointer", disabled && "opacity-50")}>
                  Mark as Priority
                </Label>
              </div>
              
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="ml-2" 
                onClick={handleFileButtonClick}
                disabled={disabled}
                aria-label="Attach files"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              type="submit" 
              className="gap-1" 
              disabled={disabled || (message.trim() === "" && selectedFiles.length === 0)}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
              {!isMobile && "Send"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MessageInput;
