
"use client";

import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockInsights } from '@/lib/mockData/insights';
import { InsightCard } from './InsightCard';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type InsightFilter = 'all' | 'beat' | 'miss';

export function InsightsDisplay() {
  const [filter, setFilter] = useState<InsightFilter>('all');

  const filteredInsights = useMemo(() => {
    if (filter === 'all') {
      return mockInsights;
    }
    if (filter === 'beat') {
      return mockInsights.filter(i => i.tag === 'Estimates Beat');
    }
    if (filter === 'miss') {
      return mockInsights.filter(i => i.tag === 'Estimates Miss');
    }
    return mockInsights;
  }, [filter]);

  return (
    <div className="flex flex-col h-full bg-muted/30">
      <div className="p-2 bg-background border-b flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Estimate</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={filter} onValueChange={(value) => setFilter(value as InsightFilter)}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="beat">Estimates Beat</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="miss">Estimates Miss</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-2 space-y-2">
          {filteredInsights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
