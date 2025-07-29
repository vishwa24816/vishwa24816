
"use client";

import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, BarChart } from 'lucide-react';
import { MoverItem } from './MoverItem';
import type { Stock } from '@/types';

interface VolumeOiSectionProps {
  optionsData: Stock[];
  onAssetClick: (asset: Stock) => void;
}

export const VolumeOiSection: React.FC<VolumeOiSectionProps> = ({ optionsData, onAssetClick }) => {
  const { topVolume, topOi } = useMemo(() => {
    const sortedByVolume = [...optionsData].sort((a, b) => (b.volume || 0) - (a.volume || 0)).slice(0, 5);
    const sortedByOi = [...optionsData].sort((a, b) => (b.openInterest || 0) - (a.openInterest || 0)).slice(0, 5);
    return { topVolume: sortedByVolume, topOi: sortedByOi };
  }, [optionsData]);

  return (
    <div>
      <h2 className="text-xl font-semibold font-headline text-primary flex items-center mb-2">
         Top Volume/OI
      </h2>
      <Tabs defaultValue="volume" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="volume" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" /> Top Volume
          </TabsTrigger>
          <TabsTrigger value="oi" className="flex items-center gap-1">
            <AreaChart className="h-4 w-4" /> Top Open Interest
          </TabsTrigger>
        </TabsList>
        <TabsContent value="volume" className="p-2">
          <div className="space-y-1">
            {topVolume.map(stock => <MoverItem key={stock.id} stock={stock} onAssetClick={onAssetClick} />)}
          </div>
        </TabsContent>
        <TabsContent value="oi" className="p-2">
          <div className="space-y-1">
            {topOi.map(stock => <MoverItem key={stock.id} stock={stock} onAssetClick={onAssetClick} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
