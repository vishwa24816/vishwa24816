
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MarketsHeader() {
  return (
    <div className="sticky top-20 z-20 bg-background/80 backdrop-blur-sm border-b">
        <div className="p-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search stocks, indices..."
                    className="h-11 pl-10 pr-4 rounded-md w-full"
                />
            </div>
        </div>
      <Tabs defaultValue="indices" className="w-full">
        <TabsList className="w-full justify-start rounded-none bg-transparent p-0 px-4">
            <TabsTrigger value="indices">Indices</TabsTrigger>
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
            <TabsTrigger value="events">Events Calendar</TabsTrigger>
            <TabsTrigger value="fii-dii">FII & DII</TabsTrigger>
            <TabsTrigger value="insider">Insider</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
