
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useParams } from "react-router-dom";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateChat: (type: "team" | "direct" | "announcement", name: string, userIds?: string[]) => void;
}

const NewChatDialog: React.FC<NewChatDialogProps> = ({
  open,
  onOpenChange,
  onCreateChat
}) => {
  const { role } = useParams<{ role: string }>();
  const [chatType, setChatType] = useState<"team" | "direct" | "announcement">("team");
  const [chatName, setChatName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const isSupervisor = role === "supervisor";

  const handleCreate = async () => {
    if (!chatName.trim()) return;
    
    setIsCreating(true);
    try {
      await onCreateChat(chatType, chatName);
      setChatName("");
      setChatType("team");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
          <DialogDescription>
            Start a new conversation. Choose a type and enter a name.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="chatType">Chat Type</Label>
            <RadioGroup 
              defaultValue="team" 
              value={chatType}
              onValueChange={(value) => setChatType(value as "team" | "direct" | "announcement")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="team" id="team" />
                <Label htmlFor="team">Team Chat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="direct" id="direct" />
                <Label htmlFor="direct">Direct Message</Label>
              </div>
              {isSupervisor && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="announcement" id="announcement" />
                  <Label htmlFor="announcement">Announcement</Label>
                </div>
              )}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="chatName">Chat Name</Label>
            <Input
              id="chatName"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Enter a name for your chat"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!chatName.trim() || isCreating}
          >
            {isCreating ? "Creating..." : "Create Chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
