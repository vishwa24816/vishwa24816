
"use client";

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockInsights } from '@/lib/mockData';
import { InsightCard } from './InsightCard';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

export function InsightsDisplay() {
  return (
    <div className="flex flex-col h-full bg-muted/30">
        <div className="p-2 bg-background border-b flex justify-end">
             <Button variant="ghost" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2"/>
                Filter
            </Button>
        </div>
      <ScrollArea className="flex-grow">
        <div className="p-2 space-y-2">
          {mockInsights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
