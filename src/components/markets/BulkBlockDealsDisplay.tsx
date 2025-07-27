
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBulkBlockDeals } from '@/lib/mockData';
import type { BulkBlockDeal } from '@/types';
import { DealCard } from './DealCard';
import { ArrowUpDown } from 'lucide-react';

export function BulkBlockDealsDisplay() {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="flex flex-col h-full bg-muted/30">
            <div className="p-4 bg-background border-b space-y-4">
                 <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-muted-foreground">SORT BY:</p>
                    <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                        <Button variant="secondary" size="sm" className="rounded-md px-3 text-xs shrink-0">
                            Date <ArrowUpDown className="h-3 w-3 ml-1" />
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-md px-3 text-xs shrink-0">Actions</Button>
                        <Button variant="outline" size="sm" className="rounded-md px-3 text-xs shrink-0">%Traded</Button>
                        <Button variant="outline" size="sm" className="rounded-md px-3 text-xs shrink-0">Quantity</Button>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">*All financials are in Rs Crores</p>
            </div>

            <ScrollArea className="flex-grow">
                <div className="p-2 space-y-2">
                    {mockBulkBlockDeals.map(deal => (
                        <DealCard key={deal.id} deal={deal} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
