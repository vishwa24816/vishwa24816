
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
          
          const pnlStrength = Math.min(Math.abs(item.pnlPercent) / 5, 1); // Normalize pnl % for color intensity (cap at 5%)
          
          // Determine the base color and intensity. Tailwind needs full class names, so we can't build them dynamically with string interpolation easily.
          // We'll use CSS variables to handle the color intensity dynamically.
          const colorClass = isPositive
            ? 'bg-green-500/80 hover:bg-green-500/100'
            : 'bg-red-500/80 hover:bg-red-500/100';
          const textColor = pnlStrength > 0.6 ? 'text-white' : 'text-gray-800 dark:text-gray-200';

          return (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <div 
                  style={{
                    flexBasis: `${sizePercent}%`,
                    flexGrow: sizePercent,
                    // The background color will be set by Tailwind classes
                  }}
                  className={cn(
                      "p-2 rounded-md flex flex-col justify-between flex-shrink-0 min-h-[60px] min-w-[80px] shadow-inner transition-all duration-300",
                      colorClass,
                      "border-2 border-transparent hover:border-primary/50"
                  )}
                >
                  <span className={cn("text-xs font-semibold", textColor)}>{item.name}</span>
                  <span className={cn("text-xs", textColor, "opacity-80")}>
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
