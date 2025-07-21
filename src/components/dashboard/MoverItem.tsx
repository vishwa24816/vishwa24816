
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { Stock } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MoverItemProps {
  stock: Stock;
}

export const MoverItem: React.FC<MoverItemProps> = ({ stock }) => {
  const router = useRouter();

  const handleStockClick = () => {
    let path = `/order/stock/${stock.symbol}`;
    if (stock.exchange === 'NFO' || stock.exchange === 'Crypto Options') {
        const type = (stock.name.toLowerCase().includes('future') || stock.symbol.includes('FUT')) ? 'future' : 'option';
        path = `/order/${type}/${stock.symbol}`;
    } else if (stock.exchange === 'Crypto' || stock.exchange === 'Crypto Futures') {
         const type = (stock.exchange === 'Crypto Futures') ? 'crypto-future' : 'crypto';
         path = `/order/${type}/${stock.symbol}`;
    }
    router.push(path);
  };
    
  const isPositive = stock.changePercent >= 0;
  const isUsStock = stock.exchange === 'NASDAQ' || stock.exchange === 'NYSE';
  const currencySymbol = isUsStock ? '$' : '₹';
  
  return (
    <div
      onClick={handleStockClick}
      className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted"
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{stock.symbol}</p>
        <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
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
