
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { MarketsHeader } from '@/components/markets/MarketsHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMarketIndices, mockStocks, sectorsHeatmap, industriesHeatmap, indicesHeatmap, sectorsSummary, industriesSummary, indicesSummary } from '@/lib/mockData';
import { MarketMoversCard, MoverCategory } from '@/components/markets/MarketMoversCard';
import { FiiDiiCard } from '@/components/markets/FiiDiiCard';
import { MarketHeatmap } from '@/components/markets/MarketHeatmap';
import { SectorSummaryCard } from '@/components/markets/SectorSummaryCard';
import { EventsCalendar } from '@/components/markets/EventsCalendar';
import { FiiDiiActivity } from '@/components/markets/FiiDiiActivity';

const marketMoversCategories: MoverCategory[] = [
    { title: "Top Gainers", type: 'gainers' },
    { title: "Top Losers", type: 'losers' },
    { title: "New 52 Week High", type: '52w-high' },
    { title: "New 52 Week Low", type: '52w-low' },
    { title: "Volume Shockers", type: 'volume-shockers' },
    { title: "High Volume, High Gain", type: 'high-vol-gain' },
    { title: "High Volume, Top Losers", type: 'high-vol-loss' },
];

export default function MarketsPage() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'stocks';
    
    const [activeMode, setActiveMode] = useState<'Fiat' | 'Crypto'>('Fiat');
    const [activeTab, setActiveTab] = useState(initialTab);
    
    useEffect(() => {
        const tab = searchParams.get('tab');
        const validTabs = ['stocks', 'sectors', 'events', 'fii-dii', 'insider-deals', 'bulk-deals', 'earnings-calls'];
        if (tab && validTabs.includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen">
                <AppHeader 
                    isRealMode={false} 
                    activeMode={activeMode} 
                    onModeChange={setActiveMode} 
                />
                <main className="flex-grow">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start rounded-none bg-background p-0 px-4 sticky top-16 z-30 border-b overflow-x-auto no-scrollbar">
                            <TabsTrigger value="stocks">Stocks</TabsTrigger>
                            <TabsTrigger value="sectors">Sectors</TabsTrigger>
                            <TabsTrigger value="events">Events Calendar</TabsTrigger>
                            <TabsTrigger value="fii-dii">FII & DII</TabsTrigger>
                            <TabsTrigger value="insider-deals">Insider trade deals</TabsTrigger>
                            <TabsTrigger value="bulk-deals">Bulk/Block Deals</TabsTrigger>
                            <TabsTrigger value="earnings-calls">Earnings Calls</TabsTrigger>
                        </TabsList>
                        
                        <MarketsHeader />

                        <TabsContent value="stocks">
                             <div className="p-4 space-y-6">
                                {marketMoversCategories.map(category => (
                                    <MarketMoversCard 
                                        key={category.type}
                                        title={category.title}
                                        category={category.type}
                                        stocks={mockStocks}
                                    />
                                ))}
                                <FiiDiiCard />
                            </div>
                        </TabsContent>

                        <TabsContent value="sectors">
                             <div className="p-4 space-y-6">
                                <MarketHeatmap title="Sectors" items={sectorsHeatmap} />
                                <SectorSummaryCard items={sectorsSummary} />
                                <MarketHeatmap title="Industries" items={industriesHeatmap} />
                                <SectorSummaryCard items={industriesSummary} />
                                <MarketHeatmap title="Indices" items={indicesHeatmap} />
                                <SectorSummaryCard items={indicesSummary} />
                             </div>
                        </TabsContent>

                        <TabsContent value="events" className="p-0">
                            <EventsCalendar />
                        </TabsContent>

                        <TabsContent value="fii-dii" className="p-0">
                            <FiiDiiActivity />
                        </TabsContent>

                        <TabsContent value="insider-deals" className="p-4">
                            <p className="text-center text-muted-foreground">Insider trade deals content coming soon.</p>
                        </TabsContent>
                        <TabsContent value="bulk-deals" className="p-4">
                            <p className="text-center text-muted-foreground">Bulk/Block deals content coming soon.</p>
                        </TabsContent>
                        <TabsContent value="earnings-calls" className="p-4">
                            <p className="text-center text-muted-foreground">Earnings calls content coming soon.</p>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </ProtectedRoute>
    );
}
