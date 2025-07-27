
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MarketIndex } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IndexCardProps {
  index: MarketIndex;
}

export const IndexCard: React.FC<IndexCardProps> = ({ index }) => {
  const isPositive = index.change >= 0;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow w-48 shrink-0">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm font-semibold">{index.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <p className="text-lg font-bold">{index.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className={`text-xs flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {isPositive ? '+' : ''}{index.change.toFixed(2)} ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
        </p>
      </CardContent>
    </Card>
  );
};
