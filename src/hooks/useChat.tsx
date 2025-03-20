
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  ChatMessage, 
  ChatRoom, 
  fetchDirectMessages, 
  fetchRoomMessages, 
  sendMessage as sendMessageApi, 
  subscribeToMessages,
  markMessageAsRead,
  fetchChatRooms,
  createChatRoom,
  addMemberToChatRoom
} from "@/services/chatService";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useChat = () => {
  const [user, setUser] = useState<User | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Load chat rooms
  const loadChatRooms = useCallback(async () => {
    if (!user) return;
    
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
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      loadChatRooms();
    }
  }, [user, loadChatRooms]);

  // Load messages for selected conversation
  const loadMessages = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoadingMessages(true);
      let loadedMessages: ChatMessage[] = [];
      
      if (selectedRoom) {
        // Load room messages
        loadedMessages = await fetchRoomMessages(selectedRoom.id);
      } else if (selectedUserId) {
        // Load direct messages
        loadedMessages = await fetchDirectMessages(user.id, selectedUserId);
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
  }, [user, selectedRoom, selectedUserId, toast]);

  useEffect(() => {
    if (user && (selectedRoom || selectedUserId)) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [user, selectedRoom, selectedUserId, loadMessages]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!user) return;

    const roomId = selectedRoom?.id || null;
    
    const unsubscribe = subscribeToMessages(roomId, (newMessage) => {
      // Only add messages that are relevant to the current conversation
      if (
        (selectedRoom && newMessage.room_id === selectedRoom.id) ||
        (!selectedRoom && selectedUserId && (
          (newMessage.sender_id === selectedUserId && newMessage.recipient_id === user.id) ||
          (newMessage.sender_id === user.id && newMessage.recipient_id === selectedUserId)
        ))
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, selectedRoom, selectedUserId]);

  // Send a message
  const sendMessage = useCallback(async (content: string, isPriority: boolean = false) => {
    if (!user) {
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
          user.id, 
          isPriority, 
          undefined, 
          selectedRoom.id, 
          selectedRoom.type
        );
      } else if (selectedUserId) {
        // Send direct message
        await sendMessageApi(
          content, 
          user.id, 
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
  }, [user, selectedRoom, selectedUserId, toast]);

  // Create a chat room
  const createRoom = useCallback(async (name: string, type: "team" | "direct" | "announcement") => {
    if (!user) return null;
    
    try {
      const newRoom = await createChatRoom(name, type, user.id);
      await addMemberToChatRoom(newRoom.id, user.id);
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
  }, [user, toast]);

  // Mark message as read
  const markAsRead = useCallback(async (messageId: string) => {
    if (!user) return;
    
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
  }, [user]);

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
    refreshRooms: loadChatRooms,
    refreshMessages: loadMessages
  };
};
