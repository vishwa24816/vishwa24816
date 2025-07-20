
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from 'lucide-react';
import { mockCryptoFuturesForWatchlist } from '@/lib/mockData';
import type { Stock } from '@/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type ActiveFuturesFilter = 'New' | 'Top Gainers' | 'Top Volume' | 'Top OI';

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
  const [activeTab, setActiveTab] = useState('Futures');
  const [activeFilter, setActiveFilter] = useState<ActiveFuturesFilter>('Top Volume');

  // Simple sorting logic for demonstration
  const sortedData = useMemo(() => {
    const data = [...mockCryptoFuturesForWatchlist]; // Use a copy to avoid mutating original data
    switch (activeFilter) {
      case 'Top Gainers':
        return data.sort((a, b) => b.changePercent - a.changePercent);
      case 'Top Volume':
        return data.sort((a, b) => (b.volume || 0) - (a.volume || 0));
      // 'New' and 'Top OI' would require dedicated data properties
      case 'New':
        // Assuming the first few items are "new" for demo purposes
        return data.slice(0, 5); 
      default:
        return data;
    }
  }, [activeFilter]);
  
  const handleRowClick = (symbol: string) => {
    router.push(`/order/crypto-future/${symbol}`);
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none bg-transparent border-b p-0 px-4">
            <TabsTrigger value="Futures" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Futures</TabsTrigger>
            <TabsTrigger value="BTC" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none" disabled>BTC Options</TabsTrigger>
            <TabsTrigger value="ETH" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none" disabled>ETH Options</TabsTrigger>
          </TabsList>
          <TabsContent value="Futures" className="mt-0">
            <div className="px-4 py-3 flex items-center space-x-2 border-b overflow-x-auto no-scrollbar">
                {(['New', 'Top Gainers', 'Top Volume', 'Top OI'] as ActiveFuturesFilter[]).map((filter) => (
                    <Button 
                        key={filter}
                        variant={activeFilter === filter ? 'secondary': 'ghost'}
                        size="sm"
                        onClick={() => setActiveFilter(filter)}
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

            <div className="space-y-2">
              {sortedData.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-2 hover:bg-muted/50 cursor-pointer" onClick={() => handleRowClick(item.symbol)}>
                  <div className="flex-1">
                    <p className="font-semibold text-sm flex items-center">{item.symbol.replace('.P','')} {index < 2 && activeFilter === 'New' && <Badge className="ml-2 text-xs bg-yellow-400 text-black hover:bg-yellow-500">NEW</Badge>}</p>
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
