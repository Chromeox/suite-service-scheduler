
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchChatRooms, createChatRoom, addMemberToChatRoom, ChatRoom } from "@/services/chat";

export const useChatRooms = (userId: string | undefined) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const { toast } = useToast();

  const loadChatRooms = useCallback(async () => {
    if (!userId) return;
    
    try {
      setIsLoadingRooms(true);
      const rooms = await fetchChatRooms();
      setChatRooms(rooms);
    } catch (error) {
      console.error("Error loading chat rooms:", error);
      toast({
        title: "Error loading chat rooms",
        description: "Couldn't retrieve chat rooms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRooms(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    if (userId) {
      loadChatRooms();
    }
  }, [userId, loadChatRooms]);

  const createRoom = useCallback(async (name: string, type: "team" | "direct" | "announcement") => {
    if (!userId) return null;
    
    try {
      const newRoom = await createChatRoom(name, type, userId);
      await addMemberToChatRoom(newRoom.id, userId);
      setChatRooms((prevRooms) => [newRoom, ...prevRooms]);
      return newRoom;
    } catch (error) {
      console.error("Error creating chat room:", error);
      toast({
        title: "Error creating chat room",
        description: "The chat room couldn't be created. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [userId, toast]);

  return {
    chatRooms,
    isLoadingRooms,
    createRoom,
    refreshRooms: loadChatRooms
  };
};
