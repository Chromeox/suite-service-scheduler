import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { MessageReaction } from "./types";

// Since the message_reactions table might not be defined in the Supabase types,
// we'll use a more generic approach

// Fetch reactions for a message
export const fetchMessageReactions = async (messageId: string): Promise<MessageReaction[]> => {
  const { data, error } = await supabase
    .from("message_reactions" as any)
    .select(`
      *,
      user:user_id(
        id,
        user_profiles:id(first_name, last_name, display_name, avatar)
      )
    `)
    .eq("message_id", messageId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching message reactions:", error);
    throw error;
  }

  // Format the reactions to include user information
  return data.map((reaction: any) => ({
    ...reaction,
    user: {
      id: reaction.user?.id,
      name: reaction.user?.user_profiles?.display_name || 
        `${reaction.user?.user_profiles?.first_name || ''} ${reaction.user?.user_profiles?.last_name || ''}`.trim() || 
        'Unknown User',
      display_name: reaction.user?.user_profiles?.display_name,
      avatar: reaction.user?.user_profiles?.avatar
    }
  }));
};

// Add a reaction to a message
export const addMessageReaction = async (
  messageId: string,
  userId: string,
  emoji: string
): Promise<MessageReaction> => {
  // Validate inputs
  if (!messageId || !userId || !emoji) {
    throw new Error("Missing required parameters for adding reaction");
  }
  
  // Sanitize emoji input - only allow a single emoji (prevent XSS)
  const sanitizedEmoji = emoji.trim().slice(0, 8); // Limit to reasonable length
  // Check if user already reacted with this emoji
  const { data: existingReaction, error: fetchError } = await supabase
    .from("message_reactions" as any)
    .select("*")
    .eq("message_id", messageId)
    .eq("user_id", userId)
    .eq("emoji", sanitizedEmoji)
    .single();
    
  if (fetchError && fetchError.code !== 'PGRST116') { // Ignore 'not found' errors
    console.error("Error checking existing reaction:", fetchError);
    throw fetchError;
  }

  // If reaction already exists, remove it (toggle behavior)
  if (existingReaction !== null && typeof existingReaction === 'object' && 'id' in existingReaction) {
    // Safely assert the type with a type guard
    const typedReaction = existingReaction as { id: string };
    
    // Create a safe copy with only the fields we need
    const reactionCopy: MessageReaction = {
      id: typedReaction.id,
      message_id: messageId,
      user_id: userId,
      emoji: sanitizedEmoji,
      created_at: new Date().toISOString()
    };
    
    const { error: deleteError } = await supabase
      .from("message_reactions" as any)
      .delete()
      .eq("id", reactionCopy.id);
    
    if (deleteError) {
      console.error("Error removing existing reaction:", deleteError);
      throw deleteError;
    }
    
    return reactionCopy;
  }

  // Otherwise, add new reaction
  const newReaction = {
    id: uuidv4(),
    message_id: messageId,
    user_id: userId,
    emoji: sanitizedEmoji,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("message_reactions" as any)
    .insert(newReaction)
    .select()
    .single();

  if (error) {
    console.error("Error adding message reaction:", error);
    throw error;
  }

  return data as unknown as MessageReaction;
};

// Remove a reaction from a message
export const removeMessageReaction = async (reactionId: string): Promise<void> => {
  // Validate input
  if (!reactionId) {
    throw new Error("Missing reaction ID");
  }
  
  const { error } = await supabase
    .from("message_reactions" as any)
    .delete()
    .eq("id", reactionId);

  if (error) {
    console.error("Error removing message reaction:", error);
    throw error;
  }
};
