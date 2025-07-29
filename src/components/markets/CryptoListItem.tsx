
"use client";

import React from 'react';
import type { Stock } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CryptoListItemProps {
  asset: Stock;
  rank: number;
  currency: 'usd' | 'inr';
  onClick: () => void;
}

const formatCurrency = (value: number, currency: 'usd' | 'inr', compact: boolean = false) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        notation: compact ? 'compact' : 'standard',
        minimumFractionDigits: 2,
        maximumFractionDigits: compact ? 2 : (value < 1 ? 6 : 2),
    });
    return formatter.format(value);
};

export const CryptoListItem: React.FC<CryptoListItemProps> = ({ asset, rank, currency, onClick }) => {
    const isPositive = asset.changePercent >= 0;

    // A simple mock conversion. In a real app, you'd fetch this.
    const USD_TO_INR_RATE = 83;
    
    const displayPrice = currency === 'inr' ? asset.price : asset.price / USD_TO_INR_RATE;
    const marketCapValue = asset.marketCap ? parseFloat(asset.marketCap.replace('₹', '').replace('T', '')) * 1e12 : 0;
    const displayMarketCap = currency === 'inr' ? marketCapValue : marketCapValue / USD_TO_INR_RATE;
    const volumeValue = asset.volume || 0;
    const displayVolume = currency === 'inr' ? volumeValue : volumeValue / USD_TO_INR_RATE;

    return (
        <div className="px-4 py-3 hover:bg-muted/50 cursor-pointer" onClick={onClick}>
            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-6 text-center">{rank}</span>
                <Avatar className="h-8 w-8 text-xs">
                    <AvatarFallback>{asset.symbol.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                         <p className="font-semibold text-foreground text-sm">{asset.symbol}</p>
                         <p className="text-xs text-muted-foreground">{asset.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Mkt Cap: {formatCurrency(displayMarketCap, currency, true)}
                    </p>
                </div>
                 <div className="text-right shrink-0">
                    <p className="font-semibold text-foreground text-sm">{formatCurrency(displayPrice, currency)}</p>
                    <p className={cn("text-xs flex items-center justify-end", isPositive ? 'text-green-600' : 'text-red-500')}>
                        {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {asset.changePercent.toFixed(2)}%
                    </p>
                </div>
                 <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </div>
             <p className="text-xs text-muted-foreground mt-1 text-right">
                Vol (24h): {formatCurrency(displayVolume, currency, true)}
            </p>
        </div>
    );
};
