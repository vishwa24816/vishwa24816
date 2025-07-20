
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from 'lucide-react';
import { mockCryptoFuturesForWatchlist } from '@/lib/mockData';
import { mockCryptoOptionsForWatchlist } from '@/lib/mockData/cryptoOptionsWatchlist';
import type { Stock } from '@/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type MainTab = 'Futures' | 'Options';
type FuturesFilter = 'New' | 'Top Gainers' | 'Top Volume' | 'Top OI';
type OptionsFilter = 'Top Volume' | 'Top OI';

const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 5,
    }).format(value);
};

const formatVolume = (value: number) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
    return `$${value}`;
};

export function FuturesMarketMovers() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MainTab>('Futures');
  const [activeFuturesFilter, setActiveFuturesFilter] = useState<FuturesFilter>('Top Volume');
  const [activeOptionsFilter, setActiveOptionsFilter] = useState<OptionsFilter>('Top Volume');

  const futuresData = useMemo(() => {
    const data = [...mockCryptoFuturesForWatchlist];
    switch (activeFuturesFilter) {
      case 'Top Gainers':
        return data.sort((a, b) => b.changePercent - a.changePercent);
      case 'Top Volume':
        return data.sort((a, b) => (b.volume || 0) - (a.volume || 0));
      case 'New':
        return data.slice(0, 5); 
      default:
        return data;
    }
  }, [activeFuturesFilter]);

  const optionsData = useMemo(() => {
      const data = [...mockCryptoOptionsForWatchlist];
      // Add sorting logic for 'Top OI' when data is available
      return data.sort((a,b) => (b.volume || 0) - (a.volume || 0));
  }, [activeOptionsFilter]);

  const handleRowClick = (item: Stock) => {
    if (activeTab === 'Futures') {
        router.push(`/order/crypto-future/${item.symbol}`);
    } else {
        router.push(`/order/option/${item.symbol}`); // Assuming a generic options page
    }
  };

  const renderList = (items: Stock[]) => (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center justify-between px-4 py-2 hover:bg-muted/50 cursor-pointer" onClick={() => handleRowClick(item)}>
          <div className="flex-1">
            <p className="font-semibold text-sm flex items-center">{item.symbol} {activeTab === 'Futures' && activeFuturesFilter === 'New' && index < 2 && <Badge className="ml-2 text-xs bg-yellow-400 text-black hover:bg-yellow-500">NEW</Badge>}</p>
            <p className="text-xs text-muted-foreground">{item.name}</p>
          </div>
          <div className="flex-1 text-right">
            <p className="font-semibold text-sm">{formatPrice(item.price)}</p>
            <p className="text-xs text-muted-foreground">{formatVolume(item.volume || 0)}</p>
          </div>
          <div className="w-24 text-right flex justify-end">
            <div className={cn(
                "w-20 py-1.5 text-center text-sm font-medium rounded-md text-white",
                item.changePercent >= 0 ? "bg-green-600" : "bg-red-600"
            )}>
                {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MainTab)} className="w-full">
          <TabsList className="w-full justify-start rounded-none bg-transparent border-b p-0 px-4">
            <TabsTrigger value="Futures" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Futures</TabsTrigger>
            <TabsTrigger value="Options" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Options</TabsTrigger>
          </TabsList>

          <TabsContent value="Futures" className="mt-0">
            <div className="px-4 py-3 flex items-center space-x-2 border-b overflow-x-auto no-scrollbar">
                {(['New', 'Top Gainers', 'Top Volume', 'Top OI'] as FuturesFilter[]).map((filter) => (
                    <Button 
                        key={filter}
                        variant={activeFuturesFilter === filter ? 'secondary': 'ghost'}
                        size="sm"
                        onClick={() => setActiveFuturesFilter(filter)}
                        className="rounded-md text-xs shrink-0"
                    >
                        {filter}
                    </Button>
                ))}
            </div>
             <div className="flex justify-between items-center text-xs text-muted-foreground px-4 py-2">
                <p>Contract</p>
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-muted-foreground">Price <ArrowUpDown className="h-3 w-3 ml-1" /></Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-muted-foreground">24h Chg. <ArrowUpDown className="h-3 w-3 ml-1" /></Button>
                </div>
            </div>
            {renderList(futuresData)}
          </TabsContent>

          <TabsContent value="Options" className="mt-0">
            <div className="px-4 py-3 flex items-center space-x-2 border-b overflow-x-auto no-scrollbar">
                {(['Top Volume', 'Top OI'] as OptionsFilter[]).map((filter) => (
                    <Button 
                        key={filter}
                        variant={activeOptionsFilter === filter ? 'secondary': 'ghost'}
                        size="sm"
                        onClick={() => setActiveOptionsFilter(filter)}
                        className="rounded-md text-xs shrink-0"
                    >
                        {filter}
                    </Button>
                ))}
            </div>
             <div className="flex justify-between items-center text-xs text-muted-foreground px-4 py-2">
                <p>Contract</p>
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-muted-foreground">Price <ArrowUpDown className="h-3 w-3 ml-1" /></Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-muted-foreground">24h Chg. <ArrowUpDown className="h-3 w-3 ml-1" /></Button>
                </div>
            </div>
            {renderList(optionsData)}
          </TabsContent>

        </Tabs>
    </div>
  );
}
