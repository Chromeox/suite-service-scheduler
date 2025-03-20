
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle } from "lucide-react";
import { ChatRoom } from "@/services/chatService";

interface DesktopCommunicationTableProps {
  rooms: ChatRoom[];
  formatTimestamp: (dateString: string) => string;
  onSelectRoom: (roomId: string) => void;
}

const DesktopCommunicationTable = ({
  rooms,
  formatTimestamp,
  onSelectRoom,
}: DesktopCommunicationTableProps) => {
  if (rooms.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No conversations found
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow 
              key={room.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelectRoom(room.id)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={undefined} alt={room.name} />
                    <AvatarFallback>{room.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1">
                    <div className="font-medium">{room.name}</div>
                    {room.type === "announcement" && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {room.type}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">{formatTimestamp(room.created_at)}</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DesktopCommunicationTable;
