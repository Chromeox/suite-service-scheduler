
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import CommunicationsList, { Communication } from "@/components/communications/CommunicationsList";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ChatView from "@/components/communications/ChatView";
import { mockCommunications } from "@/services/mock/communications";

const Communications = () => {
  const { role } = useParams<{ role: string }>();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [selectedChat, setSelectedChat] = useState<Communication | null>(null);
  const [conversations, setConversations] = useState(mockCommunications);
  const [showList, setShowList] = useState(true);

  const handleNewMessage = () => {
    toast({
      title: "Create new message",
      description: "This feature will be available soon",
    });
  };

  const handleChatSelect = (communication: Communication) => {
    // Mark as read when selected
    if (!communication.isRead) {
      const updatedConversations = conversations.map(conv => 
        conv.id === communication.id ? { ...conv, isRead: true } : conv
      );
      setConversations(updatedConversations);
    }
    
    setSelectedChat(communication);
    
    if (isMobile) {
      setShowList(false);
    }
  };

  const handleBackToList = () => {
    setShowList(true);
    setSelectedChat(null);
  };

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

  const handleSendMessage = (text: string, isPriority: boolean) => {
    if (!selectedChat) return;
    
    // In a real implementation, this would send to a backend
    toast({
      title: "Message sent",
      description: "Your message has been delivered",
    });
    
    // For now, just simulate a confirmation that the message was sent
    console.log("Message sent:", text, "Priority:", isPriority);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {isMobile && selectedChat && !showList ? (
            <Button variant="ghost" onClick={handleBackToList} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <h1 className="text-2xl font-bold tracking-tight">Communications</h1>
          )}
          
          <Button onClick={handleNewMessage} size={isMobile ? "sm" : "default"} className="gap-1">
            <Plus className="h-4 w-4" />
            {!isMobile && "New Message"}
          </Button>
        </div>
        
        {(showList || !isMobile) && (
          <p className="text-muted-foreground">
            Coordinate with team members in real-time
          </p>
        )}
        
        <div className={`flex ${isMobile ? "flex-col" : "gap-4 h-[calc(100vh-220px)]"}`}>
          {(showList || !isMobile) && (
            <Card className={`p-0 ${isMobile ? "w-full" : "w-1/3"}`}>
              <CommunicationsList 
                onSelectChat={handleChatSelect} 
                communications={conversations}
              />
            </Card>
          )}
          
          {(!showList || !isMobile) && (
            <Card className={`p-0 ${isMobile ? "w-full" : "w-2/3 overflow-hidden"}`}>
              <ChatView 
                selectedChat={selectedChat} 
                onSendMessage={handleSendMessage}
                formatTimestamp={formatTimestamp}
              />
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Communications;
