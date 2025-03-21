-- Create message attachments table
CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add column to messages table to indicate if a message has attachments
ALTER TABLE messages ADD COLUMN IF NOT EXISTS has_attachments BOOLEAN DEFAULT FALSE;

-- Add RLS policies
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- Allow users to see all attachments
CREATE POLICY "Attachments are viewable by everyone" 
  ON message_attachments FOR SELECT 
  USING (true);

-- Allow users to create attachments for messages they send
CREATE POLICY "Users can create attachments for their messages" 
  ON message_attachments FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages 
      WHERE messages.id = message_id AND messages.sender_id = auth.uid()
    )
  );

-- Allow users to delete their own attachments
CREATE POLICY "Users can delete their own attachments" 
  ON message_attachments FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM messages 
      WHERE messages.id = message_id AND messages.sender_id = auth.uid()
    )
  );

-- Create index for faster queries
CREATE INDEX idx_message_attachments_message_id ON message_attachments(message_id);

-- Add realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE message_attachments;

-- Create storage bucket for chat attachments if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Anyone can view chat attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-attachments');

CREATE POLICY "Authenticated users can upload chat attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'chat-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own chat attachments"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'chat-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);
