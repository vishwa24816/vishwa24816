
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MarketIndex, Stock } from '@/types'; // Import Stock type
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

// Make IndexCardProps more generic
interface IndexCardProps {
  itemData: MarketIndex | Stock;
}

const IndexCard: React.FC<IndexCardProps> = ({ itemData }) => {
  // Adapt to use MarketIndex or Stock properties
  const name = itemData.name;
  // Use 'price' if 'value' is not available (for Stock type)
  const value = 'value' in itemData ? itemData.value : itemData.price;
  const change = itemData.change;
  const changePercent = itemData.changePercent;

  const isPositive = change >= 0;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-48 h-24 flex flex-col shrink-0">
      <CardHeader className="p-1.5 pb-0 flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-xs font-medium font-headline">{name}</CardTitle>
        <Activity className="h-2.5 w-2.5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-1.5 pt-0 flex flex-col flex-grow justify-between">
        <div className="flex-grow flex items-center justify-center my-0.5" data-ai-hint="stock chart graph">
          <svg viewBox="0 0 100 35" className="w-full h-auto max-h-[20px]">
            <polyline
              fill="none"
              stroke={isPositive ? 'hsl(var(--positive))' : 'hsl(var(--destructive))'}
              strokeWidth="2.5"
              points={isPositive ? "5,30 15,20 25,25 35,15 45,18 55,10 65,13 75,20 85,15 95,22" : "5,12 15,22 25,18 35,28 45,25 55,32 65,29 75,22 85,28 95,20"}
            />
          </svg>
        </div>
        
        <div>
          <div className="text-base font-bold">{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className={`text-xs ${isPositive ? 'text-[hsl(var(--positive))]' : 'text-destructive'} flex items-center`}>
            {isPositive ? <TrendingUp className="h-2 w-2 mr-1" /> : <TrendingDown className="h-2 w-2 mr-1" />}
            {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Make MarketOverview accept items and title as props
interface MarketOverviewProps {
  title: string;
  items: (MarketIndex | Stock)[];
}

export function MarketOverview({ title, items }: MarketOverviewProps) {
  return (
    <section aria-labelledby="market-overview-title">
      <h2 id="market-overview-title" className="text-lg font-semibold font-headline mb-3 text-primary">
        {title} {/* Use prop title */}
      </h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4 no-scrollbar">
        {items.map((item) => (
          <IndexCard key={item.id} itemData={item} />
        ))}
        {/* Add a few more for better scroll visualization if needed */}
        {items.length < 5 && items.length > 0 && items.map((item) => (
          <IndexCard key={`${item.id}-clone`} itemData={{...item, id: `${item.id}-clone`}} />
        ))}
      </div>
    </section>
  );
}
