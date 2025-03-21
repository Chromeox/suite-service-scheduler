-- Create message reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(message_id, user_id, emoji)
);

-- Add RLS policies
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Allow users to see all reactions
CREATE POLICY "Reactions are viewable by everyone" 
  ON message_reactions FOR SELECT 
  USING (true);

-- Allow users to create their own reactions
CREATE POLICY "Users can create their own reactions" 
  ON message_reactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own reactions
CREATE POLICY "Users can delete their own reactions" 
  ON message_reactions FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON message_reactions(user_id);

-- Add realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE message_reactions;
