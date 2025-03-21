import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { MessageAttachment } from "./types";

// Maximum file size in bytes (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
export const ALLOWED_FILE_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  // Text
  "text/plain",
  "text/csv",
];

// Check if file is valid
export const isValidFile = (file: File): boolean => {
  return (
    file.size <= MAX_FILE_SIZE && 
    ALLOWED_FILE_TYPES.includes(file.type)
  );
};

// Get file extension from file type
export const getFileExtension = (fileType: string): string => {
  const parts = fileType.split("/");
  if (parts.length === 2) {
    if (parts[1] === "vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return "docx";
    } else if (parts[1] === "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      return "xlsx";
    } else if (parts[1] === "vnd.openxmlformats-officedocument.presentationml.presentation") {
      return "pptx";
    } else if (parts[1] === "msword") {
      return "doc";
    } else if (parts[1] === "vnd.ms-excel") {
      return "xls";
    } else if (parts[1] === "vnd.ms-powerpoint") {
      return "ppt";
    }
    return parts[1];
  }
  return "";
};

// Upload file to Supabase storage
export const uploadFile = async (
  file: File,
  userId: string
): Promise<{ path: string; url: string }> => {
  const fileExt = getFileExtension(file.type);
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("chat-attachments")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file:", error);
    throw error;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("chat-attachments")
    .getPublicUrl(filePath);

  return {
    path: data.path,
    url: urlData.publicUrl,
  };
};

// Create attachment record in database
export const createAttachment = async (
  messageId: string,
  file: File,
  fileUrl: string,
  thumbnailUrl?: string
): Promise<MessageAttachment> => {
  const attachment = {
    id: uuidv4(),
    message_id: messageId,
    file_name: file.name,
    file_size: file.size,
    file_type: file.type,
    file_url: fileUrl,
    thumbnail_url: thumbnailUrl,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("message_attachments" as any)
    .insert(attachment)
    .select()
    .single();

  if (error) {
    console.error("Error creating attachment record:", error);
    throw error;
  }

  return data as unknown as MessageAttachment;
};

// Fetch attachments for a message
export const fetchMessageAttachments = async (
  messageId: string
): Promise<MessageAttachment[]> => {
  const { data, error } = await supabase
    .from("message_attachments" as any)
    .select("*")
    .eq("message_id", messageId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching message attachments:", error);
    throw error;
  }

  return data as unknown as MessageAttachment[];
};

// Delete attachment
export const deleteAttachment = async (
  attachmentId: string,
  filePath: string
): Promise<void> => {
  // Delete file from storage
  const { error: storageError } = await supabase.storage
    .from("chat-attachments")
    .remove([filePath]);

  if (storageError) {
    console.error("Error deleting file from storage:", storageError);
    throw storageError;
  }

  // Delete record from database
  const { error: dbError } = await supabase
    .from("message_attachments" as any)
    .delete()
    .eq("id", attachmentId);

  if (dbError) {
    console.error("Error deleting attachment record:", dbError);
    throw dbError;
  }
};
