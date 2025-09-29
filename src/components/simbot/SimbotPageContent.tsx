
"use client";

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage, Stock, InitialOrderDetails } from '@/types';
import { sendMessageToSimbotAction } from '@/app/actions';
import { useAuth } from '@/contexts/AuthContext';
import { SimbotInputBar } from './SimbotInputBar';

export function SimbotPageContent({ onNavigateRequest }: { onNavigateRequest: (asset: Stock, details?: InitialOrderDetails) => void; }) {
  const { user: authUser, language, isRealMode } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const greeting = language === 'hindi' ? 'नमस्ते! "रिलायंस खरीदें" पूछकर एक कमांड आज़माएँ!' : 'Hello! Ask me to "buy RELIANCE" to try out a command!';
    setMessages([
      {
        id: 'initial-greeting',
        text: greeting,
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, [language]);
  
  const userEmailInitial = authUser?.email?.[0].toUpperCase() || "U";
  
  return (
      <div className="flex flex-col h-full">
        <main className="flex-grow overflow-hidden">
            <ScrollArea className="h-full px-4 pt-4" ref={scrollAreaRef}> 
              <div className="space-y-6 pb-24">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end space-x-2 max-w-[85%] sm:max-w-[75%]",
                      msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                    )}
                  >
                    {msg.sender === 'bot' && (
                      <Avatar className="h-8 w-8 self-start">
                        <AvatarFallback>B</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'p-3 rounded-xl shadow',
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p className="text-xs text-right mt-1 opacity-70">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {msg.sender === 'user' && (
                      <Avatar className="h-8 w-8 self-start">
                        <AvatarFallback>{userEmailInitial}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 mr-auto justify-start max-w-[85%] sm:max-w-[75%]">
                    <Avatar className="h-8 w-8 self-start">
                      <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-xl shadow bg-muted text-foreground rounded-bl-none">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
        </main>
        
        <footer className="fixed bottom-16 left-0 right-0 bg-background/80 backdrop-blur-sm border-t z-10">
          <SimbotInputBar onNavigateRequest={onNavigateRequest} showSuggestions={true} isRealMode={isRealMode} />
        </footer>
      </div>
  );
}

    