
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
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted"
    >
      <div className="flex-1">
        <p className="font-semibold text-sm">{stock.symbol}</p>
        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{stock.name}</p>
      </div>
      <div className="text-right">
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

  const handleStockClick = (symbol: string) => {
    const isUsStock = stocks.find(s => s.symbol === symbol)?.exchange === 'NASDAQ' || stocks.find(s => s.symbol === symbol)?.exchange === 'NYSE';
    router.push(`/order/stock/${symbol}`);
  };

  const { mostTraded, topGainers, topLosers } = useMemo(() => {
    const sortedByVolume = [...stocks].sort((a, b) => (b.volume || 0) - (a.volume || 0)).slice(0, 5);
    const sortedByGain = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
    const sortedByLoss = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
    return { mostTraded: sortedByVolume, topGainers: sortedByGain, topLosers: sortedByLoss };
  }, [stocks]);
  
  const renderTrending = () => (
    <div>
      <h2 className="text-xl font-semibold font-headline text-primary flex items-center mb-2">
        <Flame className="h-6 w-6 mr-2" /> Trending Stocks
      </h2>
      <div className="space-y-1">
        {mostTraded.map(stock => <MoverItem key={stock.id} stock={stock} onClick={() => handleStockClick(stock.symbol)} />)}
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
                {topGainers.map(stock => <MoverItem key={stock.id} stock={stock} onClick={() => handleStockClick(stock.symbol)} />)}
            </div>
            </TabsContent>
            <TabsContent value="losers" className="p-2">
            <div className="space-y-1">
                {topLosers.map(stock => <MoverItem key={stock.id} stock={stock} onClick={() => handleStockClick(stock.symbol)} />)}
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
