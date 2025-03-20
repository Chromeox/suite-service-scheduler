
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatRoom } from "@/services/chatService";

interface MobileCommunicationCardProps {
  room: ChatRoom;
  isExpanded: boolean;
  toggleExpand: () => void;
  formatTimestamp: (dateString: string) => string;
}

const MobileCommunicationCard = ({
  room,
  isExpanded,
  toggleExpand,
  formatTimestamp,
}: MobileCommunicationCardProps) => {
  return (
    <Card className="overflow-hidden transition-colors">
      <CardContent className="p-0">
        <div className="p-3 flex justify-between items-center" onClick={toggleExpand}>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={undefined} alt={room.name} />
              <AvatarFallback>{room.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium flex items-center gap-1">
                {room.name}
                {room.type === "announcement" && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="text-sm text-muted-foreground capitalize">{room.type}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              {formatTimestamp(room.created_at)}
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
                {room.type}
              </Badge>
            </div>
            <div className="text-sm">
              Created: {new Date(room.created_at).toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileCommunicationCard;
