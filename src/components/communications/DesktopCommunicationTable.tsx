
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Communication } from "./CommunicationsList";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle } from "lucide-react";

interface DesktopCommunicationTableProps {
  communications: Communication[];
  formatTimestamp: (dateString: string) => string;
  onSelectRow?: (communication: Communication) => void;
}

const DesktopCommunicationTable = ({
  communications,
  formatTimestamp,
  onSelectRow,
}: DesktopCommunicationTableProps) => {
  if (communications.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No communications found
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sender</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {communications.map((comm) => {
            const initials = comm.sender.name
              .split(" ")
              .map(n => n[0])
              .join("")
              .toUpperCase();
            
            return (
              <TableRow 
                key={comm.id} 
                className={`${!comm.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''} ${onSelectRow ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                onClick={() => onSelectRow && onSelectRow(comm)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comm.sender.avatar} alt={comm.sender.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{comm.sender.name}</div>
                      <div className="text-xs text-muted-foreground">{comm.sender.role}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {comm.subject}
                    {comm.isPriority && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {comm.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {comm.recipients.length > 1 
                      ? `${comm.recipients.length} recipients` 
                      : comm.recipients[0].name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatTimestamp(comm.timestamp)}</div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DesktopCommunicationTable;
