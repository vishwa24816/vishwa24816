
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
          const colorIntensity = 400 + Math.floor(pnlStrength * 300); // from 400 to 700

          return (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <div 
                  style={{
                    flexBasis: `${sizePercent}%`,
                    flexGrow: sizePercent,
                    backgroundColor: isPositive 
                      ? `hsl(140 60% ${95 - pnlStrength * 50}%)` 
                      : `hsl(0 60% ${95 - pnlStrength * 50}%)`,
                  }}
                  className={cn(
                      "p-2 rounded-md flex flex-col justify-between text-white flex-shrink-0 min-h-[60px] min-w-[80px] shadow-inner transition-all duration-300",
                      isPositive 
                          ? `bg-green-${colorIntensity} hover:bg-green-${colorIntensity + 100}` 
                          : `bg-red-${colorIntensity} hover:bg-red-${colorIntensity + 100}`,
                      "border-2 border-transparent hover:border-primary/50"
                  )}
                >
                  <span className={cn("text-xs font-semibold", colorIntensity > 600 ? "text-white" : "text-gray-800")}>{item.name}</span>
                  <span className={cn("text-xs", colorIntensity > 600 ? "text-white/80" : "text-gray-700")}>
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
