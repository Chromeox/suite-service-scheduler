
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import CommunicationsList from "@/components/communications/CommunicationsList";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ChatView from "@/components/communications/ChatView";
import { useChat } from "@/hooks/chat";
import NewChatDialog from "@/components/communications/NewChatDialog";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { addMessageReaction } from "@/services/chat/reactions";
import { uploadFile, createAttachment } from "@/services/chat/attachments";

const Communications = () => {
  const { role } = useParams<{ role: string }>();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [showList, setShowList] = useState(true);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  
  const {
    user,
    userProfile,
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

  const handleSendMessage = async (text: string, isPriority: boolean, files?: File[]) => {
    // If no files, just send the message normally
    if (!files || files.length === 0) {
      sendMessage(text, isPriority);
      return;
    }
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to send files",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // First send the message to get the message ID
      const messageId = await sendMessage(text, isPriority, true);
      
      if (!messageId) {
        throw new Error("Failed to send message");
      }
      
      // Upload each file and create attachment records
      const uploadPromises = files.map(async (file) => {
        // Upload file to storage
        const { url } = await uploadFile(file, user.id!);
        
        // Create attachment record in database
        await createAttachment(messageId, file, url);
      });
      
      await Promise.all(uploadPromises);
      
      // Message will be updated via realtime subscription
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Error uploading files",
        description: "Some files could not be uploaded. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleAddReaction = async (messageId: string, emoji: string) => {
    if (!user?.id) return;
    
    try {
      await addMessageReaction(messageId, user.id, emoji);
      // Refresh messages will happen automatically via subscription
    } catch (error) {
      console.error("Error adding reaction:", error);
      toast({
        title: "Error",
        description: "Could not add reaction. Please try again.",
        variant: "destructive",
      });
    }
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
      <div className="flex flex-col h-[calc(100vh-130px)] md:h-[calc(100vh-160px)] overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          {isMobile && (selectedRoom || selectedUserId) && !showList ? (
            <Button variant="ghost" onClick={handleBackToList} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <h1 className="text-2xl font-bold tracking-tight">Communications</h1>
          )}
          
          <div className="flex items-center gap-2">
            <Button onClick={handleNewMessage} size={isMobile ? "sm" : "default"} className="gap-1">
              <Plus className="h-4 w-4" />
              {!isMobile && "New Chat"}
            </Button>
            
            <Link to={`/dashboard/${role}/settings`}>
              <Button variant="outline" size={isMobile ? "sm" : "default"} className="gap-1">
                <Settings className="h-4 w-4" />
                {!isMobile && "Settings"}
              </Button>
            </Link>
          </div>
        </div>
        
        {(showList || !isMobile) && (
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted-foreground">
              Coordinate with team members in real-time
            </p>
            {userProfile?.display_name && (
              <p className="text-sm">
                Chatting as: <span className="font-medium">{userProfile.display_name}</span>
              </p>
            )}
          </div>
        )}
        
        <div className={`flex flex-1 gap-3 ${isMobile ? "flex-col" : ""} overflow-hidden`}>
          {(showList || !isMobile) && (
            <Card className={`${isMobile ? "w-full flex-1" : "w-1/3"} overflow-hidden flex flex-col`}>
              <CommunicationsList 
                chatRooms={chatRooms}
                onSelectChat={handleSelectChat}
                formatTimestamp={formatTimestamp}
                currentUserId={user?.id}
              />
            </Card>
          )}
          
          {(!showList || !isMobile) && (
            <Card className={`${isMobile ? "w-full flex-1" : "w-2/3"} overflow-hidden flex flex-col`}>
              <ChatView 
                messages={messages}
                isLoadingMessages={isLoadingMessages}
                onSendMessage={handleSendMessage}
                formatTimestamp={formatTimestamp}
                selectedRoom={selectedRoom}
                selectedUserId={selectedUserId}
                currentUserId={user?.id}
                onClose={isMobile ? handleBackToList : undefined}
                onAddReaction={handleAddReaction}
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
