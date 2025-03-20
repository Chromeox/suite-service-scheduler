
import React from "react";
import { ChatRoom } from "@/services/chat";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

interface MobileCommunicationCardProps {
  room: ChatRoom;
  isExpanded: boolean;
  toggleExpand: () => void;
  formatTimestamp: (dateString: string) => string;
}

const MobileCommunicationCard: React.FC<MobileCommunicationCardProps> = ({
  room,
  isExpanded,
  toggleExpand,
  formatTimestamp
}) => {
  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={undefined} alt={room.name} />
              <AvatarFallback>{room.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-medium flex items-center gap-1 truncate">
                <span className="truncate">{room.name}</span>
                {room.type === "announcement" && <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {formatTimestamp(room.created_at)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            <Badge variant="outline" className="capitalize text-xs whitespace-nowrap">
              {room.type}
            </Badge>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand();
              }}
              className="p-1 hover:bg-muted rounded-full flex-shrink-0"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-3 pt-2">
          <div className="text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare size={14} />
              <span className="truncate">Messages available</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default MobileCommunicationCard;
