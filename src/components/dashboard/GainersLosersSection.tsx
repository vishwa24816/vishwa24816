
"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, ArrowUp, ArrowDown } from 'lucide-react';
import { MoverItem } from './MoverItem';
import type { Stock } from '@/types';

interface GainersLosersSectionProps {
  gainers: Stock[];
  losers: Stock[];
  onAssetClick: (asset: Stock) => void;
}

export const GainersLosersSection: React.FC<GainersLosersSectionProps> = ({ gainers, losers, onAssetClick }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold font-headline text-primary flex items-center mb-2">
        <Activity className="h-6 w-6 mr-2" /> Top Gainers & Losers
      </h2>
      <Tabs defaultValue="gainers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gainers" className="flex items-center gap-1">
            <ArrowUp className="h-4 w-4 text-green-500" /> Gainers
          </TabsTrigger>
          <TabsTrigger value="losers" className="flex items-center gap-1">
            <ArrowDown className="h-4 w-4 text-red-500" /> Losers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gainers" className="p-2">
          <div className="space-y-1">
            {gainers.map(stock => <MoverItem key={stock.id} stock={stock} onAssetClick={onAssetClick} />)}
          </div>
        </TabsContent>
        <TabsContent value="losers" className="p-2">
          <div className="space-y-1">
            {losers.map(stock => <MoverItem key={stock.id} stock={stock} onAssetClick={onAssetClick} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
