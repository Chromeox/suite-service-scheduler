
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import CommunicationsList from "@/components/communications/CommunicationsList";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ChatView from "@/components/communications/ChatView";
import { useChat } from "@/hooks/chat";
import NewChatDialog from "@/components/communications/NewChatDialog";
import { supabase } from "@/integrations/supabase/client";

const Communications = () => {
  const { role } = useParams<{ role: string }>();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [showList, setShowList] = useState(true);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  
  const {
    user,
    chatRooms,
    selectedRoom,
    setSelectedRoom,
    selectedUserId,
    setSelectedUserId,
    messages,
    isLoadingMessages,
    sendMessage,
    createRoom
  } = useChat();

  const handleSelectChat = (roomId: string | null, userId: string | null) => {
    setSelectedRoom(roomId ? chatRooms.find(room => room.id === roomId) || null : null);
    setSelectedUserId(userId);
    
    if (isMobile) {
      setShowList(false);
    }
  };

  const handleBackToList = () => {
    setShowList(true);
    setSelectedRoom(null);
    setSelectedUserId(null);
  };

  const handleNewMessage = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to create new chats",
        variant: "destructive",
      });
      return;
    }
    setIsNewChatOpen(true);
  };

  const handleCreateNewChat = async (type: "team" | "direct" | "announcement", name: string, userIds?: string[]) => {
    if (!user) return;
    
    try {
      const newRoom = await createRoom(name, type);
      if (newRoom && userIds && userIds.length > 0) {
        // Add selected users to the room
        // This would be implemented in a more complex app
        toast({
          title: "Chat room created",
          description: `${name} has been created successfully`,
        });
      }
      setIsNewChatOpen(false);
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast({
        title: "Error creating chat",
        description: "Couldn't create new chat. Please try again.",
        variant: "destructive",
      });
    }
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
    sendMessage(text, isPriority);
  };

  // Check authentication and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "Please log in to use the chat feature",
          variant: "destructive",
        });
      }
    };
    
    checkAuth();
  }, [toast]);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {isMobile && (selectedRoom || selectedUserId) && !showList ? (
            <Button variant="ghost" onClick={handleBackToList} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <h1 className="text-2xl font-bold tracking-tight">Communications</h1>
          )}
          
          <Button onClick={handleNewMessage} size={isMobile ? "sm" : "default"} className="gap-1">
            <Plus className="h-4 w-4" />
            {!isMobile && "New Chat"}
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
                chatRooms={chatRooms}
                onSelectChat={handleSelectChat}
                formatTimestamp={formatTimestamp}
                currentUserId={user?.id}
              />
            </Card>
          )}
          
          {(!showList || !isMobile) && (
            <Card className={`p-0 ${isMobile ? "w-full" : "w-2/3 overflow-hidden"}`}>
              <ChatView 
                messages={messages}
                isLoadingMessages={isLoadingMessages}
                onSendMessage={handleSendMessage}
                formatTimestamp={formatTimestamp}
                selectedRoom={selectedRoom}
                selectedUserId={selectedUserId}
                currentUserId={user?.id}
              />
            </Card>
          )}
        </div>
      </div>
      
      <NewChatDialog 
        open={isNewChatOpen} 
        onOpenChange={setIsNewChatOpen}
        onCreateChat={handleCreateNewChat}
      />
    </DashboardLayout>
  );
};

export default Communications;
