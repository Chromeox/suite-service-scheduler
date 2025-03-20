
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MessageInputProps {
  onSendMessage: (message: string, isPriority: boolean) => void;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  placeholder = "Type your message here..." 
}) => {
  const [message, setMessage] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, isPriority);
      setMessage("");
      setIsPriority(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-3 bg-background">
      <div className="flex flex-col space-y-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="min-h-[80px] resize-none"
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="priority"
              checked={isPriority}
              onChange={(e) => setIsPriority(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="priority" className="text-sm font-medium">
              Mark as Priority
            </label>
          </div>
          <Button type="submit" className="gap-1">
            <Send className="h-4 w-4" />
            {!isMobile && "Send"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
