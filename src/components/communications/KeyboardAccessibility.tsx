import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Keyboard, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface KeyboardShortcut {
  keys: string[];
  description: string;
}

const KeyboardAccessibility: React.FC = () => {
  const [open, setOpen] = useState(false);

  const shortcuts: KeyboardShortcut[] = [
    { keys: ['Tab'], description: 'Navigate between interactive elements' },
    { keys: ['Enter', 'Space'], description: 'Activate buttons, links, and other controls' },
    { keys: ['Esc'], description: 'Close dialogs or cancel current action' },
    { keys: ['Ctrl/⌘', 'Enter'], description: 'Send message' },
    { keys: ['Arrow Keys'], description: 'Navigate within components like emoji picker' },
    { keys: ['Shift', 'Tab'], description: 'Navigate backwards through elements' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          aria-label="Keyboard shortcuts"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Keyboard shortcuts to help you navigate the chat interface.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid gap-4">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{shortcut.description}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <kbd 
                      key={keyIndex}
                      className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Press <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">?</kbd> at any time to show this dialog.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardAccessibility;
