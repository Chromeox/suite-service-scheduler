
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ChatRoom } from "./types";

// Get all chat rooms
export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }

  return data.map(room => ({
    ...room,
    type: room.type as "team" | "direct" | "announcement"
  }));
};

// Get chat rooms with members
export const fetchChatRoomsWithMembers = async (): Promise<ChatRoom[]> => {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select(`
      *,
      members:chat_room_members(
        *,
        user:user_id(
          id,
          user_profiles:id(first_name, last_name, role)
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching chat rooms with members:", error);
    throw error;
  }

  return data.map((room: any) => ({
    ...room,
    type: room.type as "team" | "direct" | "announcement",
    members: room.members?.map((member: any) => ({
      ...member,
      user: {
        id: member.user?.id,
        name: `${member.user?.user_profiles?.first_name || ''} ${member.user?.user_profiles?.last_name || ''}`.trim() || 'Unknown User',
        role: member.user?.user_profiles?.role
      }
    }))
  }));
};

// Create a new chat room
export const createChatRoom = async (
  name: string,
  type: "team" | "direct" | "announcement",
  createdBy: string
): Promise<ChatRoom> => {
  const newRoom = {
    id: uuidv4(),
    name,
    type,
    created_by: createdBy,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("chat_rooms")
    .insert(newRoom)
    .select();

  if (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }

  return {
    ...data[0],
    type: data[0].type as "team" | "direct" | "announcement"
  };
};

// Add member to chat room
export const addMemberToChatRoom = async (roomId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from("chat_room_members")
    .insert({
      room_id: roomId,
      user_id: userId,
      joined_at: new Date().toISOString()
    });

  if (error) {
    console.error("Error adding member to chat room:", error);
    throw error;
  }
};
