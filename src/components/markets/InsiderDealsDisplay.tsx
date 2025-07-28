
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockInsiderTrades } from '@/lib/mockData/insiderTrades';
import type { InsiderTrade } from '@/types';
import { InsiderTradeCard } from './InsiderTradeCard';

export function InsiderDealsDisplay() {
    const [activeTab, setActiveTab] = useState('all');

    const filteredTrades = useMemo(() => {
        if (activeTab === 'all') {
            return mockInsiderTrades;
        }
        return mockInsiderTrades.filter(trade => {
            const relation = trade.insiderRelation.toLowerCase();
            const tab = activeTab.toLowerCase();

            if (tab === 'promoters') return relation.includes('promoter');
            if (tab === 'officers') return relation.includes('officer') || relation.includes('key managerial personnel');
            if (tab === 'directors') return relation.includes('director');
            if (tab === 'others') return !relation.includes('promoter') && !relation.includes('officer') && !relation.includes('director') && !relation.includes('key managerial personnel');
            
            return false;
        });
    }, [activeTab]);


    return (
        <div className="flex flex-col h-full bg-muted/30">
            <div className="p-2 bg-background border-b">
                 <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5 h-auto p-0 gap-1 bg-transparent">
                        <TabsTrigger value="all" className="text-xs px-1 py-2">All</TabsTrigger>
                        <TabsTrigger value="promoters" className="text-xs px-1 py-2">Promoters</TabsTrigger>
                        <TabsTrigger value="officers" className="text-xs px-1 py-2">Officers</TabsTrigger>
                        <TabsTrigger value="directors" className="text-xs px-1 py-2">Directors</TabsTrigger>
                        <TabsTrigger value="others" className="text-xs px-1 py-2">Others</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
             <p className="text-xs text-muted-foreground p-2">SAST Disclosures are in Rs Crores</p>
            <ScrollArea className="flex-grow">
                <div className="p-2 space-y-2">
                    {filteredTrades.map(trade => (
                        <InsiderTradeCard key={trade.id} trade={trade} />
                    ))}
                     {filteredTrades.length === 0 && (
                        <p className="text-center text-muted-foreground pt-10">No insider trades found for this category.</p>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
