
import React from "react";
import { CheckCheck, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReadReceiptProps {
  isDelivered: boolean;
  isRead: boolean;
  readAt?: string;
  className?: string;
}

const ReadReceipt: React.FC<ReadReceiptProps> = ({ 
  isDelivered, 
  isRead,
  readAt,
  className = ""
}) => {
  // Format the timestamp if available
  const readTime = readAt ? new Date(readAt).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  }) : '';
  
  // Determine tooltip text based on message status
  const tooltipText = isRead 
    ? `Read ${readTime ? 'at ' + readTime : ''}` 
    : isDelivered 
      ? 'Delivered' 
      : 'Sending...';
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className={`inline-flex items-center ${className}`}>
            {isRead ? (
              <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
            ) : isDelivered ? (
              <Check className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <Check className="h-3.5 w-3.5 text-muted-foreground opacity-50" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ReadReceipt;
