
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileCommunicationCard from "./MobileCommunicationCard";
import DesktopCommunicationTable from "./DesktopCommunicationTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatRoom } from "@/services/chatService";

interface CommunicationsListProps {
  chatRooms: ChatRoom[];
  onSelectChat: (roomId: string | null, userId: string | null) => void;
  formatTimestamp: (dateString: string) => string;
  currentUserId?: string;
}

const CommunicationsList: React.FC<CommunicationsListProps> = ({ 
  chatRooms = [], 
  onSelectChat,
  formatTimestamp,
  currentUserId
}) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredRooms = chatRooms.filter(room => {
    if (activeTab === "all") return true;
    if (activeTab === "team") return room.type === "team";
    if (activeTab === "direct") return room.type === "direct";
    if (activeTab === "announcements") return room.type === "announcement";
    return false;
  });

  const handleSelectRoom = (roomId: string) => {
    onSelectChat(roomId, null);
  };

  return (
    <div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b px-3 py-2">
          <TabsList className="grid grid-cols-4 h-9">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="direct">Direct</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {isMobile ? (
            <div className="space-y-2 p-2">
              {filteredRooms.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No conversations found
                </div>
              ) : (
                filteredRooms.map((room) => (
                  <div key={room.id} onClick={() => handleSelectRoom(room.id)}>
                    <MobileCommunicationCard
                      room={room}
                      isExpanded={expandedId === room.id}
                      toggleExpand={() => toggleExpand(room.id)}
                      formatTimestamp={formatTimestamp}
                    />
                  </div>
                ))
              )}
            </div>
          ) : (
            <DesktopCommunicationTable
              rooms={filteredRooms}
              formatTimestamp={formatTimestamp}
              onSelectRoom={handleSelectRoom}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationsList;
