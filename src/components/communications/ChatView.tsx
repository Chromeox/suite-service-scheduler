
import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MessageInput from "./MessageInput";
import { ChatMessage } from "@/services/chatService";
import { ChatRoom } from "@/services/chatService";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatViewProps {
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  onSendMessage: (text: string, isPriority: boolean) => void;
  formatTimestamp: (dateString: string) => string;
  selectedRoom: ChatRoom | null;
  selectedUserId: string | null;
  currentUserId: string | undefined;
}

const ChatView: React.FC<ChatViewProps> = ({ 
  messages,
  isLoadingMessages,
  onSendMessage,
  formatTimestamp,
  selectedRoom,
  selectedUserId,
  currentUserId
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!selectedRoom && !selectedUserId) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-muted-foreground">
        Select a conversation to start chatting
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const renderMessageSkeletons = () => {
    return Array.from({ length: 3 }).map((_, i) => (
      <div key={`skeleton-${i}`} className="flex gap-3 animate-pulse">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-3/4 mt-1" />
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={undefined} alt={selectedRoom?.name || "Chat"} />
            <AvatarFallback>{selectedRoom ? selectedRoom.name.charAt(0) : "C"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium flex items-center gap-1">
              {selectedRoom?.name || "Direct Message"}
              {selectedRoom?.type === "announcement" && <AlertCircle className="h-4 w-4 text-red-500" />}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedRoom
                ? `${selectedRoom.type.charAt(0).toUpperCase() + selectedRoom.type.slice(1)} chat`
                : "Private conversation"}
            </div>
          </div>
        </div>
      </div>
      
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          renderMessageSkeletons()
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.sender_id === currentUserId;
            return (
              <div 
                key={`${message.id}-${index}`} 
                className={`flex gap-3 ${isCurrentUser ? 'justify-end' : ''}`}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={message.sender?.avatar} alt={message.sender?.name || "User"} />
                    <AvatarFallback>{getInitials(message.sender?.name || "User")}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[75%] ${isCurrentUser ? 'text-right' : 'flex-1'}`}>
                  <div className={`flex items-center gap-2 ${isCurrentUser ? 'justify-end' : ''}`}>
                    {!isCurrentUser && <span className="font-medium">{message.sender?.name || "User"}</span>}
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(message.created_at)}
                    </span>
                    {message.is_priority && (
                      <Badge variant="destructive" className="text-xs">Priority</Badge>
                    )}
                  </div>
                  <div className={`mt-1 text-sm whitespace-pre-line p-3 rounded-lg ${
                    isCurrentUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {message.content}
                  </div>
                </div>
                {isCurrentUser && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={message.sender?.avatar} alt="You" />
                    <AvatarFallback>{getInitials(message.sender?.name || "You")}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })
        )}
      </div>
      
      <MessageInput 
        onSendMessage={onSendMessage} 
        placeholder="Type your message here..."
      />
    </div>
  );
};

export default ChatView;
