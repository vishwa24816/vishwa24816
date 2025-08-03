
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { Stock } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MoverItemProps {
  stock: Stock;
  onAssetClick: (asset: Stock) => void;
}

export const MoverItem: React.FC<MoverItemProps> = ({ stock, onAssetClick }) => {

  const handleStockClick = () => {
    onAssetClick(stock);
  };
    
  const isPositive = stock.changePercent >= 0;
  const currencySymbol = '₹';
  
  // Extract initials for the avatar
  const fallbackText = stock.symbol.substring(0, 2);
  
  return (
    <div
      onClick={handleStockClick}
      className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted"
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <Avatar className="h-9 w-9 text-xs">
          <AvatarFallback>{fallbackText}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{stock.symbol}</p>
          <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
        </div>
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
