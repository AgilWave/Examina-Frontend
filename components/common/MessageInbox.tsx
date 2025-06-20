import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessageInboxProps {
  open: boolean;
  onClose: () => void;
  messages: { from: string; message: string }[];
  onSend?: (msg: string) => void;
  canSend?: boolean;
}

export default function MessageInbox({ open, onClose, messages, onSend, canSend }: MessageInboxProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (open && canSend && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, messages, canSend]);

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogOverlay />
      <DialogTitle className="sr-only">Message Inbox</DialogTitle>
      <DialogContent
        className="!top-6 !left-6 !translate-x-0 !translate-y-0 w-80 p-4 rounded shadow-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700"
        style={{ position: 'fixed' }}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">Message Inbox</h3>
          <DialogClose asChild>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
              aria-label="Close"
            >
              &times;
            </Button> */}
          </DialogClose>
        </div>
        <ScrollArea className="h-40 mb-2 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded p-2">
          {messages.length === 0 ? (
            <div className="text-gray-400 dark:text-gray-500 text-sm">No messages yet.</div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="mb-1 text-gray-900 dark:text-gray-100">
                <span className="font-semibold">{msg.from}:</span> {msg.message}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
        {canSend && (
          <form
            onSubmit={e => {
              e.preventDefault();
              if (input.trim() && onSend) {
                onSend(input.trim());
                setInput('');
              }
            }}
            className="flex gap-2"
          >
            <Input
              ref={inputRef}
              className="flex-1"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <Button type="submit" className="px-3 py-1 rounded" variant="default">
              Send
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 