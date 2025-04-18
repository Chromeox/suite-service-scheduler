
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileCommunicationCard from "./MobileCommunicationCard";
import DesktopCommunicationTable from "./DesktopCommunicationTable";
import { ChatRoom } from "@/services/chat";

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
    if (activeTab === "200p") return room.name.toLowerCase().includes("200p");
    if (activeTab === "200k") return room.name.toLowerCase().includes("200k");
    if (activeTab === "500p") return room.name.toLowerCase().includes("500p");
    return false;
  });

  const handleSelectRoom = (roomId: string) => {
    onSelectChat(roomId, null);
  };

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col overflow-hidden">
        <div className="border-b px-2 py-2 flex-shrink-0">
          <TabsList className="grid grid-cols-4 h-9 w-full">
            <TabsTrigger value="all" className="text-xs sm:text-sm truncate">All Suites</TabsTrigger>
            <TabsTrigger value="200p" className="text-xs sm:text-sm truncate">200P</TabsTrigger>
            <TabsTrigger value="200k" className="text-xs sm:text-sm truncate">200K</TabsTrigger>
            <TabsTrigger value="500p" className="text-xs sm:text-sm truncate">500P</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0 flex-1 overflow-auto">
          {isMobile ? (
            <div className="space-y-2 p-2 h-full overflow-y-auto">
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
            <div className="h-full overflow-auto">
              <DesktopCommunicationTable
                rooms={filteredRooms}
                formatTimestamp={formatTimestamp}
                onSelectRoom={handleSelectRoom}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationsList;
