"use client";

import React, { useState, useEffect } from 'react';
import type { Stock } from '@/types';
import { mockStocks } from '@/lib/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItemProps {
  stock: Stock;
}

const TickerItem: React.FC<TickerItemProps> = ({ stock: initialStock }) => {
  const [stock, setStock] = useState(initialStock);
  const [flashColor, setFlashColor] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const priceChange = (Math.random() - 0.5) * (stock.price * 0.01); // Max 1% change
      const newPrice = Math.max(0, stock.price + priceChange); // Ensure price doesn't go negative
      const newChange = newPrice - initialStock.price; // Change from original price for stability
      const newChangePercent = (newChange / initialStock.price) * 100;

      setStock(prevStock => ({
        ...prevStock,
        price: newPrice,
        change: newChange,
        changePercent: newChangePercent,
      }));

      setFlashColor(priceChange >= 0 ? 'text-green-400' : 'text-red-400');
      setTimeout(() => setFlashColor(''), 500);
    }, Math.random() * 5000 + 3000); // Update every 3-8 seconds

    return () => clearInterval(interval);
  }, [initialStock, stock.price]);


  const isPositive = stock.change >= 0;

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-md mx-2 min-w-[200px] transition-colors duration-300 ${flashColor}`}>
      <span className="font-semibold text-sm">{stock.symbol}</span>
      <span className="text-sm">{stock.price.toFixed(2)}</span>
      <span className={`text-xs flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
        {stock.changePercent.toFixed(2)}%
      </span>
    </div>
  );
};

export function StockTicker() {
  const extendedStocks = [...mockStocks, ...mockStocks, ...mockStocks]; // Triple the content for smooth infinite scroll

  return (
    <section aria-label="Stock Ticker" className="py-4 bg-card border-y border-border overflow-hidden shadow-sm">
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap group-hover:pause">
          {extendedStocks.map((stock, index) => (
            <TickerItem key={`${stock.id}-${index}-1`} stock={stock} />
          ))}
        </div>
        <div className="absolute top-0 flex animate-marquee-reverse whitespace-nowrap group-hover:pause">
           {extendedStocks.map((stock, index) => (
            <TickerItem key={`${stock.id}-${index}-2`} stock={stock} />
          ))}
        </div>
      </div>
    </section>
  );
}
