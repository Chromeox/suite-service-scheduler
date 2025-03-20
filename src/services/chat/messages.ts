
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "./types";

// Fetch messages for direct conversation
export const fetchDirectMessages = async (userId: string, otherUserId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:sender_id(
        id,
        user_profiles:id(first_name, last_name, role)
      )
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .or(`sender_id.eq.${otherUserId},recipient_id.eq.${otherUserId}`)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching direct messages:", error);
    throw error;
  }

  // Format the messages to include sender information
  return data.map((message: any) => ({
    ...message,
    message_type: message.message_type as "direct" | "team" | "announcement",
    sender: {
      id: message.sender?.id,
      name: `${message.sender?.user_profiles?.first_name || ''} ${message.sender?.user_profiles?.last_name || ''}`.trim() || 'Unknown User',
      role: message.sender?.user_profiles?.role
    }
  }));
};

// Fetch messages for a specific room
export const fetchRoomMessages = async (roomId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:sender_id(
        id,
        user_profiles:id(first_name, last_name, role)
      )
    `)
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching room messages:", error);
    throw error;
  }

  // Format the messages to include sender information
  return data.map((message: any) => ({
    ...message,
    message_type: message.message_type as "direct" | "team" | "announcement",
    sender: {
      id: message.sender?.id,
      name: `${message.sender?.user_profiles?.first_name || ''} ${message.sender?.user_profiles?.last_name || ''}`.trim() || 'Unknown User',
      role: message.sender?.user_profiles?.role
    }
  }));
};

// Send a message
export const sendMessage = async (
  content: string,
  senderId: string,
  isPriority: boolean = false,
  recipientId?: string,
  roomId?: string,
  messageType: "direct" | "team" | "announcement" = "direct"
): Promise<ChatMessage> => {
  const newMessage = {
    id: uuidv4(),
    content,
    sender_id: senderId,
    recipient_id: recipientId,
    room_id: roomId,
    is_priority: isPriority,
    message_type: messageType,
    is_read: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("messages")
    .insert(newMessage)
    .select();

  if (error) {
    console.error("Error sending message:", error);
    throw error;
  }

  return {
    ...data[0],
    message_type: data[0].message_type as "direct" | "team" | "announcement"
  };
};

// Mark message as read
export const markMessageAsRead = async (messageId: string): Promise<void> => {
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", messageId);

  if (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};
