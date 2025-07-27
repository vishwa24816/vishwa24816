
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function MarketsHeader() {
  return (
    <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-sm border-b p-4">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search stocks, indices..."
                className="h-11 pl-10 pr-4 rounded-md w-full"
            />
        </div>
    </div>
  );
}
