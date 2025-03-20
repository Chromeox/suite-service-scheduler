
export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  recipient_id?: string;
  room_id?: string;
  created_at: string;
  is_priority: boolean;
  message_type: "direct" | "team" | "announcement";
  is_read: boolean;
  sender?: {
    id: string;
    name: string;
    display_name?: string;
    avatar?: string;
    role?: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  type: "team" | "direct" | "announcement";
  created_at: string;
  created_by: string;
  members?: ChatRoomMember[];
}

export interface ChatRoomMember {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  user?: {
    id: string;
    name: string;
    display_name?: string;
    avatar?: string;
    role?: string;
  };
}
