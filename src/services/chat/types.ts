
export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  created_at: string;
  thumbnail_url?: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
    display_name?: string;
    avatar?: string;
  };
}

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
  has_attachments?: boolean;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
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
