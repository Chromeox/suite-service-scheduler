
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  ChatMessage, 
  ChatRoom, 
  fetchDirectMessages, 
  fetchRoomMessages, 
  sendMessage as sendMessageApi, 
  subscribeToMessages,
  markMessageAsRead
} from "@/services/chat";

export const useChatMessages = (
  userId: string | undefined, 
  selectedRoom: ChatRoom | null, 
  selectedUserId: string | null
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { toast } = useToast();

  const loadMessages = useCallback(async () => {
    if (!userId) return;
    
    try {
      setIsLoadingMessages(true);
      let loadedMessages: ChatMessage[] = [];
      
      if (selectedRoom) {
        // Load room messages
        loadedMessages = await fetchRoomMessages(selectedRoom.id);
      } else if (selectedUserId) {
        // Load direct messages
        loadedMessages = await fetchDirectMessages(userId, selectedUserId);
      }
      
      setMessages(loadedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error loading messages",
        description: "Couldn't retrieve messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMessages(false);
    }
  }, [userId, selectedRoom, selectedUserId, toast]);

  useEffect(() => {
    if (userId && (selectedRoom || selectedUserId)) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [userId, selectedRoom, selectedUserId, loadMessages]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!userId) return;

    const roomId = selectedRoom?.id || null;
    
    const unsubscribe = subscribeToMessages(roomId, (newMessage) => {
      // Only add messages that are relevant to the current conversation
      if (
        (selectedRoom && newMessage.room_id === selectedRoom.id) ||
        (!selectedRoom && selectedUserId && (
          (newMessage.sender_id === selectedUserId && newMessage.recipient_id === userId) ||
          (newMessage.sender_id === userId && newMessage.recipient_id === selectedUserId)
        ))
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userId, selectedRoom, selectedUserId]);

  const sendMessage = useCallback(async (content: string, isPriority: boolean = false) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to send messages",
        variant: "destructive",
      });
      return;
    }

    try {
      if (selectedRoom) {
        // Send room message
        await sendMessageApi(
          content, 
          userId, 
          isPriority, 
          undefined, 
          selectedRoom.id, 
          selectedRoom.type
        );
      } else if (selectedUserId) {
        // Send direct message
        await sendMessageApi(
          content, 
          userId, 
          isPriority, 
          selectedUserId
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Your message couldn't be sent. Please try again.",
        variant: "destructive",
      });
    }
  }, [userId, selectedRoom, selectedUserId, toast]);

  const markAsRead = useCallback(async (messageId: string) => {
    if (!userId) return;
    
    try {
      await markMessageAsRead(messageId);
      setMessages((prevMessages) => 
        prevMessages.map((msg) => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  }, [userId]);

  return {
    messages,
    isLoadingMessages,
    sendMessage,
    markAsRead,
    refreshMessages: loadMessages
  };
};
