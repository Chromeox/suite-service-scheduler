
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "./types";

// Subscribe to messages in a room
export const subscribeToMessages = (
  roomId: string | null,
  callback: (message: ChatMessage) => void
) => {
  let channel;
  
  if (roomId) {
    // Subscribe to room messages
    channel = supabase
      .channel(`room_messages_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();
  } else {
    // Subscribe to all messages (mainly for direct messages)
    channel = supabase
      .channel('all_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();
  }

  return () => {
    supabase.removeChannel(channel);
  };
};

// Subscribe to message read status updates
export const subscribeToMessageReadStatus = (
  callback: (message: ChatMessage) => void
) => {
  const channel = supabase
    .channel('message_read_updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: 'is_read=eq.true'
      },
      (payload) => {
        callback(payload.new as ChatMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
