
"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import type { SummaryCardItem } from '@/types';

interface SectorSummaryCardProps {
  items: SummaryCardItem[];
}

export const SectorSummaryCard: React.FC<SectorSummaryCardProps> = ({ items }) => {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-2 -mb-2 no-scrollbar">
      {items.map((item, index) => {
        const isPositive = item.change >= 0;
        return (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow w-64 shrink-0">
            <CardContent className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.companies} COMPANIES</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex justify-between items-baseline text-sm">
                <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                  {item.change.toFixed(2)}%
                </span>
                {item.advances !== undefined && (
                   <div className="flex items-center gap-2 text-xs">
                     <span className="flex items-center text-green-600"><TrendingUp className="h-3 w-3 mr-1" />{item.advances}</span>
                     <span className="flex items-center text-red-600"><TrendingDown className="h-3 w-3 mr-1" />{item.declines}</span>
                   </div>
                )}
                 {item.ltp !== undefined && (
                   <span className="font-semibold">₹{item.ltp.toLocaleString('en-IN')}</span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
