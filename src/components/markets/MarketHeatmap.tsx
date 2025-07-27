
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { HeatmapItem } from '@/types';
import { ChevronRight } from 'lucide-react';

interface MarketHeatmapProps {
  title: string;
  items: HeatmapItem[];
}

const getBackgroundColorClass = (change: number) => {
  const intensity = Math.min(Math.abs(change) / 3, 1); // Normalize change for color intensity (cap at 3%)
  if (change > 0) {
    if (intensity > 0.66) return 'bg-green-700 hover:bg-green-600';
    if (intensity > 0.33) return 'bg-green-600 hover:bg-green-500';
    return 'bg-green-500 hover:bg-green-400';
  } else {
    if (intensity > 0.66) return 'bg-red-700 hover:bg-red-600';
    if (intensity > 0.33) return 'bg-red-600 hover:bg-red-500';
    return 'bg-red-500 hover:bg-red-400';
  }
};

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ title, items }) => {
  const totalSize = items.reduce((sum, item) => sum + item.size, 0);

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="text-xs text-muted-foreground">% Day Change</div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "rounded-lg p-2 text-white flex flex-col justify-end h-20 transition-transform hover:scale-105",
                getBackgroundColorClass(item.change)
              )}
            >
              <p className="text-xs font-semibold truncate">{item.name}</p>
              <p className="text-xs">{item.change.toFixed(2)}%</p>
            </div>
          ))}
        </div>
         <Button variant="link" className="w-full justify-end mt-2 pr-0 text-primary">
            View all <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};
