
"use client";

import React from 'react';
import { IpoCard } from './IpoCard';
import { mockIpoData } from '@/lib/mockData/ipo';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export const IpoSection = () => {
    const mainboardIpos = mockIpoData.filter(ipo => ipo.type === 'Mainboard');
    const smeIpos = mockIpoData.filter(ipo => ipo.type === 'SME');

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search IPOs..." className="pl-9" />
            </div>

            <Tabs defaultValue="mainboard">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="mainboard">Mainboard</TabsTrigger>
                    <TabsTrigger value="sme">SME</TabsTrigger>
                </TabsList>
                <TabsContent value="mainboard" className="space-y-4 mt-4">
                    {mainboardIpos.map(ipo => <IpoCard key={ipo.id} ipo={ipo} />)}
                </TabsContent>
                <TabsContent value="sme" className="space-y-4 mt-4">
                    {smeIpos.map(ipo => <IpoCard key={ipo.id} ipo={ipo} />)}
                </TabsContent>
            </Tabs>
        </div>
    );
};
