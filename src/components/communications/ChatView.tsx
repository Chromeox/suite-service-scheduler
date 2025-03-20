
import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle } from "lucide-react";
import { Communication } from "./CommunicationsList";
import { Badge } from "@/components/ui/badge";
import MessageInput from "./MessageInput";

interface ChatViewProps {
  selectedChat: Communication | null;
  onSendMessage: (text: string, isPriority: boolean) => void;
  formatTimestamp: (dateString: string) => string;
}

const ChatView: React.FC<ChatViewProps> = ({ 
  selectedChat, 
  onSendMessage,
  formatTimestamp 
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedChat]);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-muted-foreground">
        Select a conversation to start chatting
      </div>
    );
  }

  // For now, we'll simulate a conversation with the initial message
  const conversation = [
    {
      id: selectedChat.id,
      sender: selectedChat.sender,
      message: selectedChat.message,
      timestamp: selectedChat.timestamp,
      isPriority: selectedChat.isPriority
    }
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={selectedChat.sender.avatar} alt={selectedChat.sender.name} />
            <AvatarFallback>{getInitials(selectedChat.sender.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium flex items-center gap-1">
              {selectedChat.subject}
              {selectedChat.isPriority && <AlertCircle className="h-4 w-4 text-red-500" />}
            </div>
            <div className="text-sm text-muted-foreground">
              With {selectedChat.sender.name} {selectedChat.type !== "direct" && `and ${selectedChat.recipients.length} others`}
            </div>
          </div>
        </div>
      </div>
      
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.map((message, index) => (
          <div key={`${message.id}-${index}`} className="flex gap-3">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
              <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{message.sender.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(message.timestamp)}
                </span>
                {message.isPriority && (
                  <Badge variant="destructive" className="text-xs">Priority</Badge>
                )}
              </div>
              <div className="mt-1 text-sm whitespace-pre-line">{message.message}</div>
            </div>
          </div>
        ))}
      </div>
      
      <MessageInput 
        onSendMessage={onSendMessage} 
        placeholder="Type your reply here..."
      />
    </div>
  );
};

export default ChatView;
