
import { User } from "@supabase/supabase-js";
import { ChatMessage, ChatRoom } from "@/services/chat";
import { UserProfile } from "./useAuthState";

export interface ChatState {
  user: User | null;
  userProfile: UserProfile | null;
  isLoadingAuth: boolean;
  chatRooms: ChatRoom[];
  selectedRoom: ChatRoom | null;
  selectedUserId: string | null;
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  isLoadingRooms: boolean;
}

export interface ChatActions {
  setSelectedRoom: (room: ChatRoom | null) => void;
  setSelectedUserId: (userId: string | null) => void;
  sendMessage: (content: string, isPriority?: boolean) => Promise<void>;
  createRoom: (name: string, type: "team" | "direct" | "announcement") => Promise<ChatRoom | null>;
  markAsRead: (messageId: string) => Promise<void>;
  refreshRooms: () => Promise<void>;
  refreshMessages: () => Promise<void>;
}

export type UseChatReturn = ChatState & ChatActions;
