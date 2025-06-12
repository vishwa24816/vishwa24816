"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockMarketIndices } from '@/lib/mockData';
import type { MarketIndex } from '@/types';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const IndexCard: React.FC<{ indexData: MarketIndex }> = ({ indexData }) => {
  const isPositive = indexData.change >= 0;
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium font-headline">{indexData.name}</CardTitle>
        <Activity className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{indexData.value.toLocaleString()}</div>
        <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockMarketIndices.map((index) => (
          <IndexCard key={index.id} indexData={index} />
        ))}
      </div>
    </section>
  );
}
