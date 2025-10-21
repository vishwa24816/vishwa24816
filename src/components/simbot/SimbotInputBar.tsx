
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
    isRealMode?: boolean;
}

export function SimbotInputBar({ onNavigateRequest, showSuggestions = false, isRealMode = false }: SimbotInputBarProps) {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (messageText: string) => {
        const trimmedInput = messageText.trim();
        if (!trimmedInput) return;

        setIsLoading(true);
        setInputValue('');

        const result = await sendMessageToSimbotAction(trimmedInput);
        setIsLoading(false);
        
        // In a real implementation, we'd add the response to a global message state.
        console.log("Simbot Reply:", result.reply);

        if (result.navigationTarget) {
            if(result.navigationTarget === 'strategy-builder') {
                 // The 'legs' will be handled by the page calling this component
                 if(onNavigateRequest) {
                     onNavigateRequest({} as Stock, { ...result.initialOrderDetails, legs: result.legs });
                 }
            } else {
                const assetSymbol = result.navigationTarget.split('/').pop();
                const asset = allAssets.find(a => a.symbol === assetSymbol);
                if (asset) {
                    onNavigateRequest(asset, result.initialOrderDetails);
                }
            }
        }
    };
    
    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSendMessage(inputValue);
    };
    
    const handleSuggestionClick = (suggestion: { message: string, symbol?: string, details?: InitialOrderDetails, action?: string }) => {
        const asset = suggestion.symbol ? allAssets.find(a => a.symbol === suggestion.symbol) : undefined;
        
        if (suggestion.action === 'create_nifty_straddle') {
            const expiry = '25 JUL 2024';
            const atmStrike = 22000;
            const legs = [
                { id: `leg1-${Date.now()}`, underlyingSymbol: 'NIFTY', instrumentName: `NIFTY ${expiry} ${atmStrike} CE`, expiryDate: expiry, strikePrice: atmStrike, optionType: 'Call', action: 'Sell', ltp: 150, quantity: 1 },
                { id: `leg2-${Date.now()}`, underlyingSymbol: 'NIFTY', instrumentName: `NIFTY ${expiry} ${atmStrike} PE`, expiryDate: expiry, strikePrice: atmStrike, optionType: 'Put', action: 'Sell', ltp: 130, quantity: 1 },
            ];
             if(onNavigateRequest) {
                onNavigateRequest({} as Stock, { navigationTarget: 'strategy_builder', targetView: 'Fiat', legs });
            }
            return;
        }

        if (asset && onNavigateRequest && suggestion.details) {
            onNavigateRequest(asset, suggestion.details);
        } else {
            // Fallback to AI for more complex queries or when direct nav isn't specified
            handleSendMessage(suggestion.message);
        }
    };

    const demoSuggestions = [
        { message: 'Buy Bitcoin', symbol: 'BTC', details: {} },
        { message: 'Buy reliance qty 123', symbol: 'RELIANCE', details: { quantity: 123 } },
        { message: 'Do an SIP on Parag Parikh Flexi cap for 100rs weekly', symbol: 'PARAGPARIKH', details: { orderType: 'SIP', sipAmount: 100, sipFrequency: 'Weekly' } },
        { message: 'Make a short straddle on nifty July', action: 'create_nifty_straddle' },
    ];

    const realSuggestions = [
        { message: 'Buy ether futures at 500rs at 10x leverage', symbol: 'ETHINR.P' },
        { message: 'Make a long straddle on nearest expiry on bitcoin' },
    ];

    const suggestions = isRealMode ? realSuggestions : demoSuggestions;

    return (
        <div className="w-full pt-2">
             {showSuggestions && (
                 <div className="flex items-center space-x-2 mb-2 overflow-x-auto no-scrollbar pb-1 px-4">
                    {suggestions.map((s, i) => (
                         <Button key={i} variant="outline" size="sm" onClick={() => handleSuggestionClick(s as any)}>
                            {s.message}
                        </Button>
                    ))}
                 </div>
            )}
            <form onSubmit={handleFormSubmit} className="flex items-center space-x-2 px-2">
            <Input
                type="text"
                placeholder="Ask Simbot..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow h-9"
                disabled={isLoading}
                autoFocus={showSuggestions} // Only autofocus on main simbot page
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full shadow-sm h-9 w-9 shrink-0"
                disabled={isLoading}
                onClick={() => alert("Voice input coming soon!")}
            >
                <Mic className="h-4 w-4" />
                <span className="sr-only">Use Microphone</span>
            </Button>
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="h-9 w-9 shrink-0">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send message</span>
            </Button>
            </form>
        </div>
    );
}
