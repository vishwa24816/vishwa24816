
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


interface PortfolioCategoryCardProps {
  title: string;
  items: PositionItem[];
  onCategoryClick: (categoryTitle: string) => void;
}

export function PortfolioCategoryCard({ title, items, onCategoryClick }: PortfolioCategoryCardProps) {

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
    <Card 
        className="shadow-md cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => onCategoryClick(title)}
    >
      <CardHeader 
        className="p-3 flex-row items-center justify-between"
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
        </div>
      </CardHeader>
    </Card>
  );
}
