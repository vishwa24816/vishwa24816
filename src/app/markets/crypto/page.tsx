
"use client";

import React, { useState, useMemo } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreVertical } from 'lucide-react';
import { mockCryptoAssets } from '@/lib/mockData';
import { CryptoListItem } from '@/components/markets/CryptoListItem';
import { ScrollArea } from '@/components/ui/scroll-area';

type CryptoFilter = 'all' | 'my_coins' | 'trending' | 'gainers' | 'losers';

export default function CryptoMarketsPage() {
    const [activeTab, setActiveTab] = useState<CryptoFilter>('all');
    const [currency, setCurrency] = useState('usd');
    const [timeframe, setTimeframe] = useState('24h');

    const filteredAssets = useMemo(() => {
        let assets = [...mockCryptoAssets];
        switch (activeTab) {
            case 'gainers':
                return assets.sort((a, b) => b.changePercent - a.changePercent);
            case 'losers':
                return assets.sort((a, b) => a.changePercent - b.changePercent);
            case 'trending':
                 return assets.sort((a, b) => (b.volume || 0) - (a.volume || 0));
            case 'my_coins':
                return assets.slice(0, 5); // Mock "My Coins"
            case 'all':
            default:
                return assets;
        }
    }, [activeTab]);

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen">
                <AppHeader 
                    isRealMode={false} 
                    activeMode={'Crypto'}
                />
                <main className="flex-grow flex flex-col">
                    <div className="border-b bg-background sticky top-16 z-10">
                        <div className="px-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
                                <Button variant={activeTab === 'my_coins' ? 'link' : 'ghost'} onClick={() => setActiveTab('my_coins')} className="text-sm px-3 shrink-0">My Coins</Button>
                                <Button variant={activeTab === 'all' ? 'link' : 'ghost'} onClick={() => setActiveTab('all')} className="text-sm px-3 shrink-0">All</Button>
                                <Button variant={activeTab === 'trending' ? 'link' : 'ghost'} onClick={() => setActiveTab('trending')} className="text-sm px-3 shrink-0">Trending Coins</Button>
                                <Button variant={activeTab === 'gainers' ? 'link' : 'ghost'} onClick={() => setActiveTab('gainers')} className="text-sm px-3 shrink-0">Top Gainers</Button>
                                <Button variant={activeTab === 'losers' ? 'link' : 'ghost'} onClick={() => setActiveTab('losers')} className="text-sm px-3 shrink-0">Top Losers</Button>
                            </div>
                        </div>
                    </div>
                    <div className="border-b bg-background p-4 flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="capitalize">{currency} <ChevronDown className="h-4 w-4 ml-1" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuRadioGroup value={currency} onValueChange={setCurrency}>
                                    <DropdownMenuRadioItem value="usd">USD</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="inr">INR</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="capitalize">{timeframe} <ChevronDown className="h-4 w-4 ml-1" /></Button>
                            </DropdownMenuTrigger>
                             <DropdownMenuContent>
                                <DropdownMenuRadioGroup value={timeframe} onValueChange={setTimeframe}>
                                    <DropdownMenuRadioItem value="1h">1 Hour</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="24h">24 Hour</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="7d">7 Days</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="30d">30 Days</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <ScrollArea className="flex-grow">
                        <div className="divide-y divide-border">
                            {filteredAssets.map((asset, index) => (
                                <CryptoListItem key={asset.id} asset={asset} rank={index + 1} currency={currency} />
                            ))}
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </ProtectedRoute>
    );
}

