
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { MarketsHeader } from '@/components/markets/MarketsHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMarketIndices, mockStocks, sectorsHeatmap, industriesHeatmap, indicesHeatmap, sectorsSummary, industriesSummary, indicesSummary, mockUsStocks } from '@/lib/mockData';
import { MarketMoversCard, MoverCategory } from '@/components/markets/MarketMoversCard';
import { FiiDiiCard } from '@/components/markets/FiiDiiCard';
import { MarketHeatmap } from '@/components/markets/MarketHeatmap';
import { SectorSummaryCard } from '@/components/markets/SectorSummaryCard';
import { EventsCalendar } from '@/components/markets/EventsCalendar';
import { FiiDiiActivity } from '@/components/markets/FiiDiiActivity';
import { InsiderDealsDisplay } from '@/components/markets/InsiderDealsDisplay';
import { BulkBlockDealsDisplay } from '@/components/markets/BulkBlockDealsDisplay';
import { EarningsCallsDisplay } from '@/components/markets/EarningsCallsDisplay';
import { InsightsDisplay } from '@/components/markets/InsightsDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderPageDispatcher } from '@/components/order/OrderPageDispatcher';
import type { Stock } from '@/types';
import type { InitialOrderDetails } from '@/app/page';


const marketMoversCategories: MoverCategory[] = [
    { title: "Top Gainers", type: 'gainers' },
    { title: "Top Losers", type: 'losers' },
    { title: "New 52 Week High", type: '52w-high' },
    { title: "New 52 Week Low", type: '52w-low' },
    { title: "Volume Shockers", type: 'volume-shockers' },
    { title: "High Volume, High Gain", type: 'high-vol-gain' },
    { title: "High Volume, Top Losers", type: 'high-vol-loss' },
];

function MarketsPageContent() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'indian_stocks';
    
    const [activeMode, setActiveMode] = useState<'Fiat' | 'Crypto'>('Fiat');
    const [activeTab, setActiveTab] = useState(initialTab);
    const [selectedAsset, setSelectedAsset] = useState<Stock | null>(null);
    const [initialOrderDetails, setInitialOrderDetails] = useState<InitialOrderDetails | null>(null);
    const [productTypeForOrder, setProductTypeForOrder] = useState('Delivery');
    
    useEffect(() => {
        const tab = searchParams.get('tab');
        const validTabs = ['indian_stocks', 'us_stocks', 'sectors', 'events', 'fii-dii', 'insider-deals', 'bulk-deals', 'insights', 'earnings-calls'];
        if (tab && validTabs.includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleAssetClick = (asset: Stock, details?: InitialOrderDetails) => {
        setSelectedAsset(asset);
        setInitialOrderDetails(details || null);
    };
    
    const handleBack = () => {
        setSelectedAsset(null);
    }

    if(selectedAsset) {
        return (
             <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                    <AppHeader 
                        isRealMode={false} 
                        activeMode={activeMode} 
                        onModeChange={setActiveMode} 
                    />
                    <OrderPageDispatcher 
                        asset={selectedAsset}
                        onBack={handleBack}
                        initialDetails={initialOrderDetails}
                        productType={productTypeForOrder}
                        onProductTypeChange={setProductTypeForOrder}
                    />
                </div>
            </ProtectedRoute>
        )
    }

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
                            <TabsTrigger value="indian_stocks">Indian Stocks</TabsTrigger>
                            <TabsTrigger value="us_stocks">US Stocks</TabsTrigger>
                            <TabsTrigger value="sectors">Sectors</TabsTrigger>
                            <TabsTrigger value="events">Events Calendar</TabsTrigger>
                            <TabsTrigger value="fii-dii">FII &amp; DII</TabsTrigger>
                            <TabsTrigger value="insider-deals">Insider trade deals</TabsTrigger>
                            <TabsTrigger value="bulk-deals">Bulk/Block Deals</TabsTrigger>
                            <TabsTrigger value="insights">Insights</TabsTrigger>
                            <TabsTrigger value="earnings-calls">Earnings Calls</TabsTrigger>
                        </TabsList>
                        
                        <MarketsHeader />

                        <TabsContent value="indian_stocks">
                             <div className="p-4 space-y-6">
                                {marketMoversCategories.map(category => (
                                    <MarketMoversCard 
                                        key={category.type}
                                        title={category.title}
                                        category={category.type}
                                        stocks={mockStocks}
                                        onAssetClick={handleAssetClick}
                                    />
                                ))}
                                <FiiDiiCard />
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="us_stocks">
                             <div className="p-4 space-y-6">
                                {marketMoversCategories.map(category => (
                                    <MarketMoversCard 
                                        key={category.type}
                                        title={category.title}
                                        category={category.type}
                                        stocks={mockUsStocks}
                                        onAssetClick={handleAssetClick}
                                    />
                                ))}
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

                        <TabsContent value="insider-deals" className="p-0">
                           <InsiderDealsDisplay />
                        </TabsContent>
                        <TabsContent value="bulk-deals" className="p-0">
                            <BulkBlockDealsDisplay />
                        </TabsContent>
                        <TabsContent value="insights" className="p-0">
                            <InsightsDisplay />
                        </TabsContent>
                         <TabsContent value="earnings-calls" className="p-0">
                            <EarningsCallsDisplay />
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </ProtectedRoute>
    );
}


function MarketsPageFallback() {
    return (
        <div className="flex flex-col min-h-screen">
            <AppHeader isRealMode={false} />
            <main className="flex-grow p-4 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </main>
        </div>
    );
}

export default function MarketsPage() {
    return (
        <Suspense fallback={<MarketsPageFallback />}>
            <MarketsPageContent />
        </Suspense>
    )
}
