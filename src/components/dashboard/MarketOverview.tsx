// @ts-nocheck
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockMarketIndices } from '@/lib/mockData';
import type { MarketIndex } from '@/types';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const IndexCard: React.FC<{ indexData: MarketIndex }> = ({ indexData }) => {
  const isPositive = indexData.change >= 0;
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-48 h-48 flex flex-col justify-between shrink-0">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium font-headline">{indexData.name}</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col justify-end">
        <div className="text-2xl font-bold">{indexData.value.toLocaleString()}</div>
        <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {isPositive ? '+' : ''}{indexData.change.toFixed(2)} ({isPositive ? '+' : ''}{indexData.changePercent.toFixed(2)}%)
        </p>
      </CardContent>
    </Card>
  );
};

export function MarketOverview() {
  return (
    <section aria-labelledby="market-overview-title">
      <h2 id="market-overview-title" className="text-2xl font-semibold font-headline mb-6 text-primary">
        Market Overview
      </h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4">
        {mockMarketIndices.map((index) => (
          <IndexCard key={index.id} indexData={index} />
        ))}
        {/* Add a few more for better scroll visualization if needed */}
        {mockMarketIndices.length < 5 && mockMarketIndices.map((index) => (
          <IndexCard key={`${index.id}-clone`} indexData={{...index, id: `${index.id}-clone`}} />
        ))}
      </div>
    </section>
  );
}
