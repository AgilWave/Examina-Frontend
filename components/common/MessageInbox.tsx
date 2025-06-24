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
import { UserCircle, Shield } from 'lucide-react';

interface MessageInboxProps {
  open: boolean;
  onClose: () => void;
  messages: { from: string; message: string }[];
  onSend?: (msg: string) => void;
  canSend?: boolean;
  participantName?: string;
  participantId?: string;
  isProctor?: boolean;
  selfId?: string; // socket id of self, for message alignment
}

export default function MessageInbox({
  open,
  onClose,
  messages,
  onSend,
  canSend,
  participantName,
  participantId,
  isProctor = false,
  selfId,
}: MessageInboxProps) {
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

  // Helper to get sender label
  // eslint-disable-next-line @typescript-eslint/no-explicit-any  
  const getSenderLabel = (msg: any) => {
    if (msg.from === selfId) return 'You';
    if (msg.studentName) return msg.studentName;
    if (isProctor) {
      if (msg.from === 'admin') return 'You (Proctor)';
      return participantName || 'Student';
    } else {
      if (msg.from === 'admin' || msg.from === 'proctor') return 'Proctor';
      return participantName || 'Student';
    }
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStudentId = (msg: any) => {
    if (msg.from === selfId || msg.from === 'admin' || msg.from === 'proctor') return '';
    if (msg.studentId) return msg.studentId;
    return participantId || '-';
  }

  // Helper to get avatar
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAvatar = (msg: any) => {
    if (isProctor) {
      if (msg.from === 'admin') return <Shield className="w-7 h-7 text-blue-500 bg-blue-100 rounded-full p-1" />;
      return (
        <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
          {(msg.studentName?.[0] || participantName?.[0] || 'S')}
        </div>
      );
    } else {
      if (msg.from === selfId) return <UserCircle className="w-7 h-7 text-teal-600 bg-teal-100 rounded-full p-1" />;
      if (msg.from === 'admin' || msg.from === 'proctor') return <Shield className="w-7 h-7 text-blue-500 bg-blue-100 rounded-full p-1" />;
      return (
        <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
          {(msg.studentName?.[0] || participantName?.[0] || 'S')}
        </div>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogOverlay />
      <DialogTitle className="sr-only">Message Inbox</DialogTitle>
      <DialogContent
        className="!top-6 !left-6 !translate-x-0 !translate-y-0 w-[350px] max-w-full p-0 rounded-xl shadow-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 flex flex-col"
        style={{ position: 'fixed' }}
      >
        {/* Header with participant info */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-2 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 rounded-t-xl">
          {isProctor ? (
            <>
              <Shield className="w-8 h-8 text-blue-500 bg-blue-100 rounded-full p-1" />
              <div>
                <div className="font-bold text-gray-900 dark:text-gray-100">Proctor</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Admin</div>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg">
                {participantName?.[0] || 'S'}
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-gray-100">{participantName || 'Student'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">ID: {participantId || '-'}</div>
              </div>
            </>
          )}
          <div className="flex-1" />
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
        {/* Messages area */}
        <ScrollArea className="flex-1 px-4 py-3 bg-white dark:bg-zinc-900 min-h-[200px] max-h-[200px] overflow-y-auto scrollbar-custom">
          <div className="flex flex-col space-y-3">
            {messages.length === 0 ? (
              <div className="text-gray-400 dark:text-gray-500 text-sm text-center mt-8">No messages yet.</div>
            ) : (
              messages.map((msg, idx) => {
                const isSelf = isProctor ? msg.from === 'admin' : msg.from === selfId;
                return (
                  <div
                    key={idx}
                    className={`flex items-end gap-2 ${isSelf ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isSelf && <div>{getAvatar(msg)}</div>}
                    <div
                      className={`rounded-lg px-3 py-2 max-w-[70%] text-sm shadow-sm ${
                        isSelf
                          ? 'bg-teal-600 text-white rounded-br-none'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                      }`}
                    >
                      <div className="font-semibold text-xs mb-0.5">
                        {getSenderLabel(msg)}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                        {getStudentId(msg)}
                      </div>
                      <div>{msg.message}</div>
                    </div>
                    {isSelf && <div>{getAvatar(msg)}</div>}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        {/* Input area */}
        {canSend && (
          <form
            onSubmit={e => {
              e.preventDefault();
              if (input.trim() && onSend) {
                onSend(input.trim());
                setInput('');
              }
            }}
            className="flex gap-2 px-4 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 rounded-b-xl"
          >
            <Input
              ref={inputRef}
              className="flex-1 bg-white dark:bg-zinc-900 border-none focus:ring-2 focus:ring-teal-500"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <Button type="submit" className="px-4 py-2 rounded-lg" variant="default">
              Send
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 