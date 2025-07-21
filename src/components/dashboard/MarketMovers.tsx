
"use client";

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, Activity, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Stock } from '@/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface MarketMoversProps {
  stocks: Stock[];
  displayMode: 'trending' | 'gainers-losers' | 'full';
}

const MoverItem: React.FC<{ stock: Stock, onClick: () => void }> = ({ stock, onClick }) => {
  const isPositive = stock.changePercent >= 0;
  const isUsStock = stock.exchange === 'NASDAQ' || stock.exchange === 'NYSE';
  const currencySymbol = isUsStock ? '$' : '₹';
  const isFuture = stock.exchange === 'NFO';

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted"
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{stock.symbol}</p>
        <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
        {isFuture && stock.openInterest && (
            <p className="text-xs text-muted-foreground">OI: {(stock.openInterest / 1_00_00_000).toFixed(2)}Cr</p>
        )}
      </div>
      <div className="text-right shrink-0 pl-2">
        <p className="font-medium text-sm">{currencySymbol}{stock.price.toFixed(2)}</p>
        <p className={cn("text-xs flex items-center justify-end", isPositive ? 'text-green-600' : 'text-red-500')}>
          {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {stock.changePercent.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export function MarketMovers({ stocks, displayMode }: MarketMoversProps) {
  const router = useRouter();

  const handleStockClick = (stock: Stock) => {
    let path = `/order/stock/${stock.symbol}`;
    if (stock.exchange === 'NFO') {
      path = `/order/future/${stock.symbol}`;
    }
    router.push(path);
  };

  const { mostTraded, topGainers, topLosers } = useMemo(() => {
    const isFuture = stocks.some(s => s.exchange === 'NFO');
    const sortedByActivity = [...stocks].sort((a, b) => {
        const activityA = isFuture ? (a.openInterest || a.volume || 0) : (a.volume || 0);
        const activityB = isFuture ? (b.openInterest || b.volume || 0) : (b.volume || 0);
        return activityB - activityA;
    }).slice(0, 5);

    const sortedByGain = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
    const sortedByLoss = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
    return { mostTraded: sortedByActivity, topGainers: sortedByGain, topLosers: sortedByLoss };
  }, [stocks]);
  
  const isFuture = stocks.some(s => s.exchange === 'NFO');
  const trendingTitle = isFuture ? "Trending Futures" : "Trending Stocks";

  const renderTrending = () => (
    <div>
      <h2 className="text-xl font-semibold font-headline text-primary flex items-center mb-2">
        <Flame className="h-6 w-6 mr-2" /> {trendingTitle}
      </h2>
      <div className="space-y-1">
        {mostTraded.map(stock => <MoverItem key={stock.id} stock={stock} onClick={() => handleStockClick(stock)} />)}
      </div>
    </div>
  );
  
  const renderGainersLosers = () => (
     <div>
        <h2 className="text-xl font-semibold font-headline text-primary flex items-center mb-2">
            <Activity className="h-6 w-6 mr-2" /> Top Gainers & Losers
        </h2>
        <Tabs defaultValue="gainers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gainers" className="flex items-center gap-1">
                <ArrowUp className="h-4 w-4 text-green-500" /> Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex items-center gap-1">
                <ArrowDown className="h-4 w-4 text-red-500" /> Losers
            </TabsTrigger>
            </TabsList>
            <TabsContent value="gainers" className="p-2">
            <div className="space-y-1">
                {topGainers.map(stock => <MoverItem key={stock.id} stock={stock} onClick={() => handleStockClick(stock)} />)}
            </div>
            </TabsContent>
            <TabsContent value="losers" className="p-2">
            <div className="space-y-1">
                {topLosers.map(stock => <MoverItem key={stock.id} stock={stock} onClick={() => handleStockClick(stock)} />)}
            </div>
            </TabsContent>
        </Tabs>
      </div>
  );

  switch (displayMode) {
    case 'trending':
      return renderTrending();
    case 'gainers-losers':
      return renderGainersLosers();
    case 'full':
    default:
      return (
        <div className="space-y-6">
          {renderTrending()}
          {renderGainersLosers()}
        </div>
      );
  }
}
