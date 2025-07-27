
"use client";

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockEarningsCalls } from '@/lib/mockData';
import { EarningsCallCard } from './EarningsCallCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function EarningsCallsDisplay() {
  return (
    <div className="flex flex-col h-full bg-muted/30">
      <div className="p-4 bg-background border-b space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="rounded-full px-4">Earnings Calls</Button>
          <Button variant="outline" size="sm" className="rounded-full px-4">Investor Presentations</Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search for stock" className="pl-9 h-9" />
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-2 space-y-2">
          {mockEarningsCalls.map(call => (
            <EarningsCallCard key={call.id} call={call} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
