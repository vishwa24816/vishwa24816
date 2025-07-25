
"use client";

import React, { useState, useMemo } from 'react';
import type { PortfolioHolding, IntradayPosition, FoPosition, CryptoFuturePosition, Stock } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, TrendingUp, TrendingDown, Briefcase, LandPlot, Repeat, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type PositionItem = PortfolioHolding | IntradayPosition | FoPosition | CryptoFuturePosition;

const formatCurrency = (value: number, currency: 'INR' | 'USDT' = 'INR') => {
  if (currency === 'USDT') return `${value.toFixed(2)} USDT`;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const PositionItemRow: React.FC<{ item: PositionItem, onAssetClick: (asset: Stock) => void }> = ({ item, onAssetClick }) => {
  const router = useRouter();
  const { toast } = useToast();

  const { name, symbol, pnl, pnlPercent, isProfit, details } = useMemo(() => {
    let name = '', symbol = '', pnl = 0, pnlPercent = 0, isProfit = true, details = '';

    if ('profitAndLoss' in item) { // PortfolioHolding
      name = item.name;
      symbol = item.symbol || '';
      pnl = item.profitAndLoss;
      pnlPercent = item.profitAndLossPercent;
      isProfit = pnl >= 0;
      details = `${item.quantity.toLocaleString()} units @ ${formatCurrency(item.avgCostPrice)}`;
    } else if ('pAndL' in item) { // IntradayPosition or FoPosition
      name = 'instrumentName' in item ? item.instrumentName : item.name;
      symbol = 'symbol' in item ? item.symbol : '';
      pnl = item.pAndL;
      pnlPercent = item.pAndLPercent;
      isProfit = pnl >= 0;
      details = `${'lots' in item ? item.lots + ' lots' : item.quantity + ' units'} @ ${formatCurrency(item.avgPrice)}`;
    } else if ('unrealizedPnL' in item) { // CryptoFuturePosition
      name = item.symbol;
      pnl = item.unrealizedPnL;
      isProfit = pnl >= 0;
      const totalValue = item.entryPrice * item.quantity;
      pnlPercent = totalValue > 0 ? (pnl / totalValue) * 100 : 0;
      details = `${item.quantity} contracts @ ${formatCurrency(item.entryPrice, 'USDT')}`;
    }
    
    return { name, symbol, pnl, pnlPercent, isProfit, details };
  }, [item]);
  
  const handleItemClick = () => {
    // This is a simplified navigation logic. A real app would need a more robust way
    // to map items to their order page URLs.
     if ('symbol' in item && item.symbol) {
      onAssetClick(item as Stock);
    } else {
      toast({title: "Navigation not available for this item yet."})
    }
  };

  return (
    <div 
        className="text-sm p-3 border-t cursor-pointer hover:bg-primary/5"
        onClick={handleItemClick}
    >
      <div className="flex justify-between items-center">
        <p className="font-medium text-foreground truncate">{name}</p>
        <p className={cn("font-semibold", isProfit ? "text-green-600" : "text-red-600")}>
          {formatCurrency(pnl, 'unrealizedPnL' in item ? 'USDT' : 'INR')}
        </p>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{details}</span>
        <span className={cn(isProfit ? "text-green-600" : "text-red-600")}>
          ({pnlPercent.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
};


interface PortfolioCategoryCardProps {
  title: string;
  items: PositionItem[];
  onAssetClick: (asset: Stock) => void;
}

export function PortfolioCategoryCard({ title, items, onAssetClick }: PortfolioCategoryCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  const { totalValue, totalPnl, icon } = useMemo(() => {
    let totalValue = 0;
    let totalPnl = 0;
    
    items.forEach(item => {
      if ('currentValue' in item) totalValue += item.currentValue;
      if ('ltp' in item && 'quantity' in item && 'avgPrice' in item) { // Intraday
         totalValue += item.ltp * item.quantity;
      }
      if ('ltp' in item && 'lots' in item && 'quantityPerLot' in item) { // F&O
         totalValue += item.ltp * item.lots * item.quantityPerLot;
      }
      // Note: Crypto Futures value is complex (margin-based), so we omit for simplicity here

      if ('profitAndLoss' in item) totalPnl += item.profitAndLoss;
      else if ('pAndL' in item) totalPnl += item.pAndL;
      else if ('unrealizedPnL' in item) totalPnl += item.unrealizedPnL * 80; // Approx INR conversion
    });
    
    let icon = Briefcase;
    if (title.includes('Wealth')) icon = LandPlot;
    if (title.includes('Crypto')) icon = Repeat;
    if (title.includes('Web3')) icon = Globe;

    return { totalValue, totalPnl, icon };
  }, [items, title]);
  
  const isProfit = totalPnl >= 0;
  const Icon = icon;

  return (
    <Card className="shadow-md">
      <CardHeader 
        className="p-3 cursor-pointer flex-row items-center justify-between" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            {title} ({items.length})
        </CardTitle>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-sm font-semibold">{formatCurrency(totalValue)}</p>
                <p className={cn("text-xs", isProfit ? "text-green-600" : "text-red-600")}>
                    {isProfit ? '+' : ''}{formatCurrency(totalPnl)}
                </p>
            </div>
            <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isOpen && "rotate-180")} />
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="p-0 animate-accordion-down">
          {items.map((item, index) => (
            <PositionItemRow key={`${item.id}-${index}`} item={item} onAssetClick={onAssetClick} />
          ))}
        </CardContent>
      )}
    </Card>
  );
}
