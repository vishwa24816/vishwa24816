
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Menu, Search, TrendingUp, TrendingDown, MoreHorizontal, SearchX, MoreVertical } from 'lucide-react';
import { mockStocks, mockMarketIndices } from '@/lib/mockData';
import type { Stock, MarketIndex } from '@/types';
import { cn } from '@/lib/utils';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

// Index Card Component for Nifty/Sensex
const IndexCard: React.FC<{ itemData: MarketIndex }> = ({ itemData }) => {
    const isPositive = itemData.change >= 0;
    return (
        <Card className="shrink-0 w-44 shadow-sm">
            <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm font-semibold">{itemData.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <p className="text-lg font-bold">{itemData.value.toFixed(2)}</p>
                <p className={cn("text-xs flex items-center", isPositive ? 'text-green-600' : 'text-red-500')}>
                    {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {itemData.change.toFixed(2)} ({itemData.changePercent.toFixed(2)}%)
                </p>
            </CardContent>
        </Card>
    );
};

// Reusable Section for Market Movers
const MarketCategorySection: React.FC<{ title: string; stocks: Stock[]; icon: React.ElementType; isLoser?: boolean; valueSuffix?: string; }> = ({ title, stocks, icon: Icon, isLoser = false, valueSuffix = '%' }) => {
  return (
    <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold flex items-center gap-2">
                 <Icon className={cn("h-5 w-5", isLoser ? "text-red-500" : "text-green-500")} />
                {title}
            </h2>
            <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stocks.slice(0, 6).map(stock => (
                <Card key={stock.id} className="w-full">
                    <CardContent className="p-3">
                        <p className="font-semibold text-sm text-foreground truncate">{stock.name}</p>
                        <div className="flex justify-between items-center text-xs mt-1">
                             <p className="font-medium text-muted-foreground">{stock.price.toFixed(2)}</p>
                             <p className={cn("flex items-center justify-end font-semibold", isLoser ? "text-red-500" : "text-green-500")}>
                                 {isLoser ? <TrendingDown className="h-3 w-3 mr-0.5" /> : <TrendingUp className="h-3 w-3 mr-0.5" />}
                                 {stock.changePercent.toFixed(2)}{valueSuffix}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </section>
  );
};


// FII/DII Card
const FiiDiiCard = () => (
    <Card className="mb-6">
        <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">FII DII Provisional</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground">FII Net</p>
                <p className="font-bold text-green-600">+₹1,614.43 Cr</p>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
                <p className="text-muted-foreground">DII Net</p>
                <p className="font-bold text-red-600">-₹550.77 Cr</p>
            </div>
        </CardContent>
    </Card>
);

// Main Page Component
export default function StocksMarketPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Indices');
    const tabs = ['Indices', 'Sectors', 'Events Calendar', 'FII & DII', 'Insider'];

    const { topGainers, topLosers, volumeShockers, weekHighs } = useMemo(() => {
        const sortedByGain = [...mockStocks].sort((a, b) => b.changePercent - a.changePercent);
        const sortedByLoss = [...mockStocks].sort((a, b) => a.changePercent - b.changePercent);
        const sortedByVolume = [...mockStocks].sort((a,b) => (b.volume || 0) - (a.volume || 0));
        const sortedByPrice = [...mockStocks].sort((a,b) => (b.price) - (a.price));
        return { 
            topGainers: sortedByGain,
            topLosers: sortedByLoss,
            volumeShockers: sortedByVolume,
            weekHighs: sortedByPrice,
        };
    }, []);

    return (
        <ProtectedRoute>
            <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 text-foreground">
                <header className="sticky top-0 z-20 bg-background shadow-sm">
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <h1 className="text-xl font-bold">Markets</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon">
                                <Search className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto no-scrollbar">
                        <div className="flex items-center border-b px-2">
                            {tabs.map(tab => (
                                <Button
                                    key={tab}
                                    variant="ghost"
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-3 py-4 h-auto text-sm font-medium rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 whitespace-nowrap",
                                        "border-b-2 hover:bg-transparent",
                                        activeTab === tab
                                            ? "text-primary border-primary font-semibold"
                                            : "text-muted-foreground border-transparent hover:text-primary hover:border-primary/30"
                                    )}
                                >
                                    {tab}
                                </Button>
                            ))}
                        </div>
                    </div>
                </header>

                <ScrollArea className="flex-grow">
                    <main className="p-4">
                        <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4 no-scrollbar mb-6">
                            {mockMarketIndices.map(index => <IndexCard key={index.id} itemData={index} />)}
                        </div>
                        
                        <FiiDiiCard />

                        <MarketCategorySection title="Top Gainers" stocks={topGainers} icon={TrendingUp} />
                        <MarketCategorySection title="Top Losers" stocks={topLosers} icon={TrendingDown} isLoser />
                        <MarketCategorySection title="52 Week High" stocks={weekHighs} icon={TrendingUp} />
                        
                        <section className="mb-6">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
                                <TrendingDown className="h-5 w-5 text-red-500" />
                                52 Week Low
                            </h2>
                             <Card className="text-center text-muted-foreground flex flex-col items-center justify-center h-24">
                                <SearchX className="h-8 w-8 mb-2" />
                                <p className="text-xs">No matches in New 52 Week Low</p>
                            </Card>
                        </section>
                        
                        <MarketCategorySection title="Volume Shockers" stocks={volumeShockers} icon={TrendingUp} valueSuffix="x" />

                    </main>
                </ScrollArea>
                 <Button
                    variant="default"
                    size="icon"
                    className="fixed bottom-24 right-4 z-40 rounded-full h-14 w-14 shadow-xl"
                    onClick={() => alert("More options coming soon!")}
                    aria-label="More options"
                    >
                    <MoreVertical className="h-7 w-7" />
                </Button>
            </div>
        </ProtectedRoute>
    );
}
