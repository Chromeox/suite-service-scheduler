import React, { useState } from "react";
import { MessageReaction } from "@/services/chat/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SmilePlus } from "lucide-react";

interface MessageReactionsProps {
  reactions?: MessageReaction[];
  messageId: string;
  currentUserId?: string;
  onAddReaction: (messageId: string, emoji: string) => void;
}

// Common emoji reactions
const COMMON_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "👏", "🎉", "🙏"];

// Group reactions by emoji
function groupReactionsByEmoji(reactions: MessageReaction[] = []) {
  return reactions.reduce<Record<string, MessageReaction[]>>((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {});
}

// Get initials from name
function getInitials(name: string) {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions = [],
  messageId,
  currentUserId,
  onAddReaction,
}) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const groupedReactions = groupReactionsByEmoji(reactions);

  const handleEmojiSelect = (emoji: string) => {
    onAddReaction(messageId, emoji);
    setIsEmojiPickerOpen(false);
  };

  // Check if current user has already reacted with this emoji
  const hasUserReacted = (emoji: string) => {
    return groupedReactions[emoji]?.some(r => r.user_id === currentUserId);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 mt-1">
      {Object.entries(groupedReactions).map(([emoji, emojiReactions]) => (
        <TooltipProvider key={emoji}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                  hasUserReacted(emoji)
                    ? "bg-primary/10 text-primary"
                    : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => onAddReaction(messageId, emoji)}
                aria-label={`${emoji} reaction with ${emojiReactions.length} ${emojiReactions.length === 1 ? 'person' : 'people'}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onAddReaction(messageId, emoji);
                  }
                }}
              >
                <span className="mr-1">{emoji}</span>
                <span>{emojiReactions.length}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                {emojiReactions.map(reaction => (
                  <div key={reaction.id} className="flex items-center gap-1 py-0.5">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={reaction.user?.avatar} alt={reaction.user?.name || "User"} />
                      <AvatarFallback className="text-[8px]">
                        {reaction.user?.name ? getInitials(reaction.user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{reaction.user?.name || "User"}</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full"
            aria-label="Add reaction"
          >
            <SmilePlus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {COMMON_EMOJIS.map(emoji => (
              <button
                key={emoji}
                className="text-lg hover:bg-muted p-1 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => handleEmojiSelect(emoji)}
                aria-label={`Add ${emoji} reaction`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleEmojiSelect(emoji);
                  }
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MessageReactions;
