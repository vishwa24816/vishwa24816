
"use client";

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Send, Mic, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage, Stock } from '@/types';
import { sendMessageToSimbotAction } from '@/app/actions';
import { useAuth } from '@/contexts/AuthContext';
import { mockStocks, mockCryptoAssets, mockMutualFunds } from '@/lib/mockData';
import type { InitialOrderDetails } from '@/app/page';

const allAssets = [...mockStocks, ...mockCryptoAssets, ...mockMutualFunds];

export function SimbotPageContent({ onNavigateRequest }: { onNavigateRequest: (asset: Stock, details?: InitialOrderDetails) => void; }) {
  const { user: authUser, language } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
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
    // Initial greeting from Simbot
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

  const handleSendMessage = async (messageText: string, assetToNavigate?: { asset: Stock, details?: InitialOrderDetails }) => {
    const trimmedInput = messageText.trim();
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

    if (assetToNavigate) {
       setTimeout(() => {
            onNavigateRequest(assetToNavigate.asset, assetToNavigate.details);
       }, 1000);
    }
    
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

    if (result.navigationTarget && !assetToNavigate) {
        const assetSymbol = result.navigationTarget.split('/').pop();
        const asset = allAssets.find(a => a.symbol === assetSymbol);
        if (asset) {
          onNavigateRequest(asset);
        }
    }

    setIsLoading(false);
  };
  
  const handleSuggestionClick = (message: string, symbol: string, details?: InitialOrderDetails) => {
    const asset = allAssets.find(a => a.symbol === symbol);
    if (asset) {
        handleSendMessage(message, { asset, details });
    } else {
        handleSendMessage(message);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };
  
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
          <div className="w-full px-4 py-3">
              <div className="flex items-center space-x-2 mb-2 overflow-x-auto no-scrollbar pb-1">
                <Button variant="outline" size="sm" onClick={() => handleSuggestionClick('Buy Bitcoin', 'BTC')}>बिटकॉइन खरीदें</Button>
                <Button variant="outline" size="sm" onClick={() => handleSuggestionClick('Buy reliance qty 123', 'RELIANCE', { quantity: 123 })}>Buy reliance qty 123</Button>
                <Button variant="outline" size="sm" onClick={() => handleSuggestionClick('Do an SIP on Parag Parikh Flexi cap for 100rs weekly', 'PARAGPARIKH', { orderType: 'SIP', sipAmount: 100, sipFrequency: 'Weekly' })}>Do an SIP on Parag Parikh Flexi cap for 100rs weekly</Button>
              </div>
              <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
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
  );
}
