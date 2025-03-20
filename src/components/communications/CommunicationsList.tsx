
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCommunications } from "@/services/mock/communications";
import MobileCommunicationCard from "./MobileCommunicationCard";
import DesktopCommunicationTable from "./DesktopCommunicationTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type CommunicationType = "team" | "direct" | "announcement";

export interface Communication {
  id: string;
  type: CommunicationType;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  recipients: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  subject: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isPriority: boolean;
}

const CommunicationsList = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredCommunications = mockCommunications.filter(comm => {
    if (activeTab === "all") return true;
    if (activeTab === "team") return comm.type === "team";
    if (activeTab === "direct") return comm.type === "direct";
    if (activeTab === "announcements") return comm.type === "announcement";
    return false;
  });

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
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
              {filteredCommunications.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No communications found
                </div>
              ) : (
                filteredCommunications.map((comm) => (
                  <MobileCommunicationCard
                    key={comm.id}
                    communication={comm}
                    isExpanded={expandedId === comm.id}
                    toggleExpand={() => toggleExpand(comm.id)}
                    formatTimestamp={formatTimestamp}
                  />
                ))
              )}
            </div>
          ) : (
            <DesktopCommunicationTable
              communications={filteredCommunications}
              formatTimestamp={formatTimestamp}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationsList;

