
"use client";

import React from 'react';
import { IpoCard } from './IpoCard';
import { mockIpoData } from '@/lib/mockData/ipo';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from 'lucide-react';

interface IpoSectionProps {
  activeTab: string;
}

export const IpoSection: React.FC<IpoSectionProps> = ({ activeTab }) => {
    
    const ipos = React.useMemo(() => {
        switch(activeTab) {
            case 'Upcoming':
                return mockIpoData.filter(ipo => ipo.status === 'Upcoming');
            case 'Open':
                return mockIpoData.filter(ipo => ipo.status === 'Open');
            case 'Applied':
                 // Mock applied by picking one or two closed ones
                return mockIpoData.filter(ipo => ipo.id === 'ipo6' || ipo.id === 'ipo7');
            case 'All':
            default:
                return mockIpoData;
        }
    }, [activeTab]);

    const mainboardIpos = ipos.filter(ipo => ipo.type === 'Mainboard');
    const smeIpos = ipos.filter(ipo => ipo.type === 'SME');

    if (ipos.length === 0) {
        return (
            <div className="text-center py-10">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                    No IPOs in the "{activeTab}" category.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search IPOs..." className="pl-9" />
            </div>

            <Tabs defaultValue="mainboard">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="mainboard">Mainboard ({mainboardIpos.length})</TabsTrigger>
                    <TabsTrigger value="sme">SME ({smeIpos.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="mainboard" className="space-y-4 mt-4">
                    {mainboardIpos.length > 0 ? (
                        mainboardIpos.map(ipo => <IpoCard key={ipo.id} ipo={ipo} isApplied={activeTab === 'Applied'} />)
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No Mainboard IPOs found.</p>
                    )}
                </TabsContent>
                <TabsContent value="sme" className="space-y-4 mt-4">
                     {smeIpos.length > 0 ? (
                        smeIpos.map(ipo => <IpoCard key={ipo.id} ipo={ipo} isApplied={activeTab === 'Applied'} />)
                     ) : (
                        <p className="text-muted-foreground text-center py-4">No SME IPOs found.</p>
                     )}
                </TabsContent>
            </Tabs>
        </div>
    );
};
