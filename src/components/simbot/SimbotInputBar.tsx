
"use client";

import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mic, Send } from 'lucide-react';
import type { Stock, InitialOrderDetails } from '@/types';
import { sendMessageToSimbotAction } from '@/app/actions';
import { allAssets } from '@/lib/mockData';

interface SimbotInputBarProps {
    onNavigateRequest: (asset: Stock, details?: InitialOrderDetails) => void;
    showSuggestions?: boolean;
}

export function SimbotInputBar({ onNavigateRequest, showSuggestions = false }: SimbotInputBarProps) {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (messageText: string, assetToNavigate?: { asset: Stock, details?: InitialOrderDetails }) => {
        const trimmedInput = messageText.trim();
        if (!trimmedInput) return;

        setIsLoading(true);
        setInputValue('');

        if (assetToNavigate) {
            setTimeout(() => {
                onNavigateRequest(assetToNavigate.asset, assetToNavigate.details);
            }, 1000);
        }

        const result = await sendMessageToSimbotAction(trimmedInput);

        if (result.navigationTarget && !assetToNavigate) {
            const assetSymbol = result.navigationTarget.split('/').pop();
            const asset = allAssets.find(a => a.symbol === assetSymbol);
            if (asset) {
                onNavigateRequest(asset);
            }
        }
        
        // In a real implementation, we'd add the response to a global message state.
        // For this integration, we are just handling the navigation part.
        console.log("Simbot Reply:", result.reply);

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

    return (
        <div className="w-full px-4 py-3">
             {showSuggestions && (
                 <div className="flex items-center space-x-2 mb-2 overflow-x-auto no-scrollbar pb-1">
                    <Button variant="outline" size="sm" onClick={() => handleSuggestionClick('Buy Bitcoin', 'BTC')}>बिटकॉइन खरीदें</Button>
                    <Button variant="outline" size="sm" onClick={() => handleSuggestionClick('Buy reliance qty 123', 'RELIANCE', { quantity: 123 })}>Buy reliance qty 123</Button>
                    <Button variant="outline" size="sm" onClick={() => handleSuggestionClick('Do an SIP on Parag Parikh Flexi cap for 100rs weekly', 'PARAGPARIKH', { orderType: 'SIP', sipAmount: 100, sipFrequency: 'Weekly' })}>Do an SIP on Parag Parikh Flexi cap for 100rs weekly</Button>
                 </div>
            )}
            <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
            <Input
                type="text"
                placeholder="Ask Simbot about markets, stocks, or strategies..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow"
                disabled={isLoading}
                autoFocus={showSuggestions} // Only autofocus on main simbot page
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
    );
}
