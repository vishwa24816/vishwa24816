"use client";

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, Send, Mic, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import { sendMessageToSimbotAction } from '@/app/actions';
import { useAuth } from '@/contexts/AuthContext';

export default function SimbotPage() {
  const { user: authUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const isRealMode = authUser?.id === 'REAL456';
  const [searchMode, setSearchMode] = useState<'Fiat' | 'Exchange' | 'Web3'>(isRealMode ? 'Exchange' : 'Fiat');

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
    // Initial greeting from Simbot
    setMessages([
      {
        id: 'initial-greeting',
        text: 'Hello! I am Simbot, your AI assistant for market insights. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const result = await sendMessageToSimbotAction(trimmedInput);
    
    let botReplyText = "Sorry, I couldn't process that. Please try again.";
    if (result.reply) {
      botReplyText = result.reply;
    } else if (result.error) {
      botReplyText = `Error: ${result.error}`;
    }

    const botMessage: ChatMessage = {
      id: Date.now().toString() + '-bot',
      text: botReplyText,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };
  
  const userEmailInitial = authUser?.email?.[0].toUpperCase() || "U";
  
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-full">
        <AppHeader
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
          isRealMode={isRealMode}
        />
        
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
                        <AvatarImage src="https://placehold.co/40x40.png?text=B" alt="Simbot" data-ai-hint="bot avatar" />
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
                        <AvatarImage src={`https://placehold.co/40x40.png?text=${userEmailInitial}`} alt="User" data-ai-hint="user avatar" />
                        <AvatarFallback>{userEmailInitial}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 mr-auto justify-start max-w-[85%] sm:max-w-[75%]">
                    <Avatar className="h-8 w-8 self-start">
                      <AvatarImage src="https://placehold.co/40x40.png?text=B" alt="Simbot typing" data-ai-hint="bot avatar" />
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
          <div className="w-full px-4 py-3">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Ask Simbot about markets, stocks, or strategies..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow"
                  disabled={isLoading}
                  autoFocus
                />
                <Button
                  type="button"
                  variant="default" 
                  size="icon"
                  className="rounded-full shadow-sm"
                  disabled={isLoading}
                  onClick={() => alert("Voice input coming soon!")}
                >
                  <Mic className="h-5 w-5" />
                  <span className="sr-only">Use Microphone</span>
                </Button>
                <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
