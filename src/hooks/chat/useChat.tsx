
import { useState } from "react";
import { ChatRoom } from "@/services/chat";
import { useAuthState } from "./useAuthState";
import { useChatRooms } from "./useChatRooms";
import { useChatMessages } from "./useChatMessages";
import { UseChatReturn } from "./types";

export const useChat = (): UseChatReturn => {
  const { user } = useAuthState();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const { 
    chatRooms, 
    isLoadingRooms, 
    createRoom, 
    refreshRooms 
  } = useChatRooms(user?.id);
  
  const { 
    messages, 
    isLoadingMessages, 
    sendMessage, 
    markAsRead, 
    refreshMessages 
  } = useChatMessages(user?.id, selectedRoom, selectedUserId);

  return {
    user,
    chatRooms,
    selectedRoom,
    setSelectedRoom,
    selectedUserId,
    setSelectedUserId,
    messages,
    isLoadingMessages,
    isLoadingRooms,
    sendMessage,
    createRoom,
    markAsRead,
    refreshRooms,
    refreshMessages
  };
};
