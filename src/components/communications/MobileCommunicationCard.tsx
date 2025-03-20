
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { Communication } from "./CommunicationsList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface MobileCommunicationCardProps {
  communication: Communication;
  isExpanded: boolean;
  toggleExpand: () => void;
  formatTimestamp: (dateString: string) => string;
}

const MobileCommunicationCard = ({
  communication,
  isExpanded,
  toggleExpand,
  formatTimestamp,
}: MobileCommunicationCardProps) => {
  const initials = communication.sender.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className={`overflow-hidden transition-colors ${!communication.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}>
      <CardContent className="p-0">
        <div className="p-3 flex justify-between items-center" onClick={toggleExpand}>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={communication.sender.avatar} alt={communication.sender.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium flex items-center gap-1">
                {communication.subject}
                {communication.isPriority && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">{communication.sender.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              {formatTimestamp(communication.timestamp)}
            </div>
            {isExpanded ? 
              <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            }
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-3 border-t space-y-3">
            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize">
                {communication.type}
              </Badge>
            </div>
            <div className="text-sm whitespace-pre-line">
              {communication.message}
            </div>
            <div className="text-xs text-muted-foreground">
              {communication.recipients.length > 1 
                ? `Sent to ${communication.recipients.length} people` 
                : `Sent to ${communication.recipients[0].name}`}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileCommunicationCard;

