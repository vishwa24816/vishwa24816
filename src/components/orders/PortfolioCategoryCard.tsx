
"use client";

import React, { useMemo } from 'react';
import type { PortfolioHolding, IntradayPosition, FoPosition, CryptoFuturePosition, Stock } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Briefcase, LandPlot, Repeat, Globe, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type PositionItem = PortfolioHolding | IntradayPosition | FoPosition | CryptoFuturePosition;

const formatCurrency = (value: number, currency: 'INR' | 'USDT' = 'INR') => {
  if (currency === 'USDT') {
    if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(2)}M USDT`;
    if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(2)}K USDT`;
    return `${value.toFixed(2)} USDT`;
  }

  if (Math.abs(value) >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};


interface PortfolioCategoryCardProps {
  title: string;
  items: PositionItem[];
  onCategoryClick: () => void;
  onAssetClick: (asset: Stock) => void;
}

export function PortfolioCategoryCard({ title, items, onCategoryClick, onAssetClick }: PortfolioCategoryCardProps) {
  const router = useRouter();

  const { totalValue, totalPnl, icon } = useMemo(() => {
    let totalValue = 0;
    let totalPnl = 0;
    
    items.forEach(item => {
      if ('currentValue' in item && item.currentValue) totalValue += item.currentValue;
      else if ('ltp' in item && 'quantity' in item) { // Intraday
         totalValue += item.ltp * ('lots' in item && item.lots && item.quantityPerLot ? item.lots * item.quantityPerLot : item.quantity);
      }
      
      if ('profitAndLoss' in item && item.profitAndLoss) totalPnl += item.profitAndLoss;
      else if ('pAndL' in item && item.pAndL) totalPnl += item.pAndL;
      else if ('unrealizedPnL' in item && item.unrealizedPnL) totalPnl += item.unrealizedPnL * 80; // Approx INR conversion
    });
    
    let icon = Briefcase;
    if (title.includes('Wealth')) icon = LandPlot;
    if (title.includes('Crypto')) icon = Repeat;
    if (title.includes('Web3')) icon = Globe;

    return { totalValue, totalPnl, icon };
  }, [items, title]);
  
  const isProfit = totalPnl >= 0;
  const Icon = icon;

  const handleAssetItemClick = (e: React.MouseEvent, item: PositionItem) => {
    e.stopPropagation(); // Prevent card click from firing
    
    // This is a simplification. A real app would need a more robust way
    // to map a position back to a full Stock object.
    const asset = {
      id: 'symbol' in item ? item.symbol : 'instrumentName' in item ? item.instrumentName : 'unknown',
      symbol: 'symbol' in item ? item.symbol : 'instrumentName' in item ? item.instrumentName : 'Unknown',
      name: 'name' in item ? item.name : 'instrumentName' in item ? item.instrumentName : 'Unknown',
      price: 'ltp' in item ? item.ltp : ('markPrice' in item ? item.markPrice : 0),
      change: 0,
      changePercent: 0,
    } as Stock;
    
    onAssetClick(asset);
  };

  return (
    <Card 
        className="shadow-md cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onCategoryClick}
    >
    <CardHeader 
        className="p-3 flex-row items-center justify-between"
    >
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            {title.replace(' Assets', '')}
        </CardTitle>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-sm font-semibold">{formatCurrency(totalValue)}</p>
                <p className={cn("text-xs", isProfit ? "text-green-600" : "text-red-600")}>
                    {isProfit ? '+' : ''}{formatCurrency(totalPnl)}
                </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
    </CardHeader>
      {items.length > 0 && (
         <CardContent className="px-3 pb-3 text-sm">
           <div className="space-y-2">
            {items.slice(0, 3).map((item, index) => {
              const pnl = ('pAndL' in item ? item.pAndL : 'profitAndLoss' in item ? item.profitAndLoss : 'unrealizedPnL' in item ? item.unrealizedPnL * 80 : 0) || 0;
              const isItemProfit = pnl >= 0;
              const name = 'name' in item ? item.name : 'instrumentName' in item ? item.instrumentName : 'symbol' in item ? item.symbol : 'Unknown';

              return (
                 <button key={index} onClick={(e) => handleAssetItemClick(e, item)} className="w-full text-left p-2 rounded-md hover:bg-background/50">
                    <div className="flex justify-between items-center">
                        <span className="font-medium truncate w-1/2 pr-2">{name}</span>
                        <span className={cn(isItemProfit ? 'text-green-600' : 'text-red-600', 'font-mono')}>
                            {isItemProfit ? '+' : ''}{formatCurrency(pnl)}
                        </span>
                    </div>
                </button>
              )
            })}
             {items.length > 3 && (
                <div className="text-center text-xs text-muted-foreground pt-1">
                    + {items.length - 3} more
                </div>
            )}
           </div>
        </CardContent>
      )}
    </Card>
  );
}
