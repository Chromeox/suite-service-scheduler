
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
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={undefined} alt={room.name} />
              <AvatarFallback>{room.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium flex items-center gap-1">
                {room.name}
                {room.type === "announcement" && <AlertCircle className="h-4 w-4 text-red-500" />}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatTimestamp(room.created_at)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {room.type}
            </Badge>
            <button 
              onClick={toggleExpand}
              className="p-1 hover:bg-muted rounded-full"
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
              <span>Messages available</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default MobileCommunicationCard;
