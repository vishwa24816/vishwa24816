
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface HeatmapItem {
  name: string;
  value: number;
  pnl: number;
  pnlPercent: number;
}

interface PortfolioHeatmapProps {
  items: HeatmapItem[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
};

const getBackgroundColor = (pnl: number, pnlPercent: number) => {
    const isPositive = pnl >= 0;
    const strength = Math.min(Math.abs(pnlPercent) / 5, 1); // Normalize pnl % for color intensity (cap at 5%)

    if (isPositive) {
        if (strength > 0.8) return 'bg-green-700 hover:bg-green-600';
        if (strength > 0.5) return 'bg-green-600 hover:bg-green-500';
        if (strength > 0.2) return 'bg-green-500 hover:bg-green-400';
        return 'bg-green-400 hover:bg-green-300';
    } else {
        if (strength > 0.8) return 'bg-red-700 hover:bg-red-600';
        if (strength > 0.5) return 'bg-red-600 hover:bg-red-500';
        if (strength > 0.2) return 'bg-red-500 hover:bg-red-400';
        return 'bg-red-400 hover:bg-red-300';
    }
};

const getTextColor = (pnlPercent: number) => {
    const strength = Math.min(Math.abs(pnlPercent) / 5, 1);
    return strength > 0.5 ? 'text-white' : 'text-gray-800 dark:text-gray-200';
};


export function PortfolioHeatmap({ items }: PortfolioHeatmapProps) {
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);

  if (items.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No data available for heatmap.</p>;
  }

  const sortedItems = [...items].sort((a, b) => b.value - a.value);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-muted/20 w-full h-full min-h-[250px] content-start">
        {sortedItems.map(item => {
          const sizePercent = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
          const isPositive = item.pnl >= 0;

          return (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <div 
                  style={{
                    flexBasis: `${sizePercent}%`,
                    flexGrow: sizePercent,
                  }}
                  className={cn(
                      "p-2 rounded-md flex flex-col justify-between flex-shrink-0 min-h-[60px] min-w-[80px] shadow-inner transition-all duration-300",
                      getBackgroundColor(item.pnl, item.pnlPercent),
                      "border-2 border-transparent hover:border-primary/50"
                  )}
                >
                  <span className={cn("text-xs font-semibold", getTextColor(item.pnlPercent))}>{item.name}</span>
                  <span className={cn("text-xs", getTextColor(item.pnlPercent), "opacity-80")}>
                    {isPositive ? '+' : ''}{item.pnlPercent.toFixed(2)}%
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{item.name}</p>
                <p>Value: {formatCurrency(item.value)}</p>
                <p>P&L: {formatCurrency(item.pnl)} ({item.pnlPercent.toFixed(2)}%)</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
