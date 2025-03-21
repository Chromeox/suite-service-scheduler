
import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MessageInput from "./MessageInput";
import { ChatMessage, ChatRoom } from "@/services/chat";
import { addMessageReaction } from "@/services/chat/reactions";
import { Skeleton } from "@/components/ui/skeleton";
import ReadReceipt from "./ReadReceipt";
import MessageReactions from "./MessageReactions";
import MessageAttachment from "./MessageAttachment";

interface ChatViewProps {
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  onSendMessage: (text: string, isPriority: boolean, files?: File[]) => void;
  formatTimestamp: (dateString: string) => string;
  selectedRoom: ChatRoom | null;
  selectedUserId: string | null;
  currentUserId: string | undefined;
  onClose?: () => void;
  onAddReaction?: (messageId: string, emoji: string) => Promise<void>;
}

const ChatView: React.FC<ChatViewProps> = ({ 
  messages,
  isLoadingMessages,
  onSendMessage,
  formatTimestamp,
  selectedRoom,
  selectedUserId,
  currentUserId,
  onClose,
  onAddReaction
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const swipeStartXRef = useRef<number | null>(null);
  
  // Handle message reactions
  const handleAddReaction = async (messageId: string, emoji: string) => {
    if (!currentUserId) return;
    
    try {
      if (onAddReaction) {
        await onAddReaction(messageId, emoji);
      } else {
        // Default implementation if not provided by parent
        await addMessageReaction(messageId, currentUserId, emoji);
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle closing animation
  useEffect(() => {
    if (isClosing && onClose) {
      // Try to trigger vibration if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      const timer = setTimeout(() => {
        onClose();
        setIsClosing(false);
        setSwipeProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);
  
  // Show swipe hint after a delay
  useEffect(() => {
    if (onClose) { // Only show hint on mobile
      const timer = setTimeout(() => {
        setShowSwipeHint(true);
      }, 2000);
      
      const hideTimer = setTimeout(() => {
        setShowSwipeHint(false);
      }, 5000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [onClose]);

  const swipeHandlers = useSwipeable({
    onSwipeStart: (event) => {
      // Store the starting X position
      swipeStartXRef.current = event.initial[0];
    },
    onSwiping: (event) => {
      // Only allow swipes that start from near the left edge (within 50px)
      if (swipeStartXRef.current !== null && swipeStartXRef.current < 50) {
        if (event.dir === 'Right') {
          // Apply resistance effect - square root function creates resistance
          const resistance = Math.sqrt(event.deltaX) / Math.sqrt(200);
          const progress = Math.min(1, Math.max(0, resistance));
          setSwipeProgress(progress);
        }
      }
    },
    onSwiped: (event) => {
      // Only process swipes that started from the edge
      if (swipeStartXRef.current !== null && swipeStartXRef.current < 50) {
        if (event.dir === 'Right' && event.deltaX > 120 && onClose) {
          setIsClosing(true);
        } else {
          setSwipeProgress(0);
        }
      }
      swipeStartXRef.current = null;
    },
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
    delta: 10, // Minimum distance before a swipe is detected
  });

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
        <Skeleton className="h-8 w-8 rounded-full dark:bg-gray-800" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24 dark:bg-gray-800" />
            <Skeleton className="h-3 w-16 dark:bg-gray-800" />
          </div>
          <Skeleton className="h-4 w-full mt-2 dark:bg-gray-800" />
          <Skeleton className="h-4 w-3/4 mt-1 dark:bg-gray-800" />
        </div>
      </div>
    ));
  };

  // Calculate styles based on swipe progress
  const translateX = `translateX(${swipeProgress * 100}px)`;
  const opacity = 1 - swipeProgress * 0.5;
  
  // Accessibility function for closing
  const handleAccessibleClose = () => {
    if (onClose) {
      setIsClosing(true);
    }
  };
  
  return (
    <div 
      className={`flex flex-col h-full max-h-full transition-transform ${isClosing ? 'animate-slide-out-right' : ''} relative dark:bg-background`} 
      style={{ transform: isClosing ? 'translateX(100%)' : translateX, opacity }}
      {...swipeHandlers}
      aria-label="Chat window, swipe right to close"
    >
      {/* Swipe indicator */}
      {onClose && (
        <div 
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-16 w-1.5 bg-primary/20 rounded-r-md transition-opacity ${showSwipeHint ? 'opacity-100' : 'opacity-0'} ${swipeProgress > 0 ? 'opacity-0' : ''}`}
          aria-hidden="true"
        />
      )}
      <div className="border-b p-3 flex-shrink-0 relative dark:border-gray-800">
        {swipeProgress > 0 && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-background/80 text-primary font-medium z-10"
            style={{ opacity: swipeProgress }}
          >
            {swipeProgress > 0.5 ? "Release to close" : "Slide right to close"}
          </div>
        )}
        
        {/* Accessible close button for mobile */}
        {onClose && (
          <button
            onClick={handleAccessibleClose}
            className="absolute left-3 top-1/2 -translate-y-1/2 md:hidden"
            aria-label="Close chat"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
        <div className="flex items-center gap-3 ml-8 md:ml-0">
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
      
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 space-y-4 dark:bg-background">
        {isLoadingMessages ? (
          renderMessageSkeletons()
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.sender_id === currentUserId;
            // Use the sender's display name
            const senderName = message.sender?.name || "User";
            
            return (
              <div 
                key={`${message.id}-${index}`} 
                className={`flex gap-3 ${isCurrentUser ? 'justify-end' : ''}`}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                    <AvatarImage src={message.sender?.avatar} alt={senderName} />
                    <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[75%] ${isCurrentUser ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 ${isCurrentUser ? 'justify-end' : ''}`}>
                    {!isCurrentUser && <span className="font-medium">{senderName}</span>}
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(message.created_at)}
                    </span>
                    {message.is_priority && (
                      <Badge variant="destructive" className="text-xs">Priority</Badge>
                    )}
                  </div>
                  <div className={`mt-1 text-sm whitespace-pre-line p-3 rounded-lg ${
                    isCurrentUser 
                      ? 'bg-primary text-primary-foreground dark:bg-indigo-600' 
                      : 'bg-muted dark:bg-gray-800'
                  }`}>
                    {message.content}
                    
                    {/* Display attachments if any */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment) => (
                          <MessageAttachment 
                            key={attachment.id} 
                            attachment={attachment} 
                            className={isCurrentUser ? "border-primary-foreground/20" : ""}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mt-0.5`}>
                    <MessageReactions 
                      reactions={message.reactions} 
                      messageId={message.id}
                      currentUserId={currentUserId}
                      onAddReaction={handleAddReaction}
                    />
                    
                    {isCurrentUser && (
                      <div className="flex ml-2">
                        <ReadReceipt 
                          isDelivered={true} 
                          isRead={message.is_read} 
                          className="text-xs text-muted-foreground"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {isCurrentUser && (
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                    <AvatarImage src={message.sender?.avatar} alt="You" />
                    <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })
        )}
      </div>
      
      <div className="flex-shrink-0 border-t dark:border-gray-800">
        <MessageInput 
          onSendMessage={onSendMessage} 
          placeholder="Type your message here..."
          className="dark:bg-background"
        />
      </div>
    </div>
  );
};

export default ChatView;
