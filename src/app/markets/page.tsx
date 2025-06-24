
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Menu, Search, TrendingUp, TrendingDown, MoreHorizontal, SearchX, MoreVertical, ChevronRight, BarChartHorizontal } from 'lucide-react';
import { mockStocks, mockMarketIndices, sectorsHeatmap, industriesHeatmap, indicesHeatmap, sectorsSummary, industriesSummary, indicesSummary } from '@/lib/mockData';
import type { Stock, MarketIndex, HeatmapItem, SummaryCardItem } from '@/types';
import { cn } from '@/lib/utils';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


// #region Indices View Components

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

const IndicesView: React.FC = () => {
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
        <>
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
        </>
    );
};

// #endregion

// #region Sectors View Components

const HeatmapItemTile: React.FC<{ item: HeatmapItem }> = ({ item }) => {
    const isPositive = item.change >= 0;
    const sizeStyle = { flexBasis: `${item.size}%` };

    return (
        <div 
            style={sizeStyle}
            className={cn(
                "p-2 rounded-md flex flex-col justify-between text-white flex-grow min-h-[60px] min-w-[80px]",
                isPositive ? 'bg-green-600/80 hover:bg-green-600' : 'bg-red-600/80 hover:bg-red-600'
            )}
        >
            <span className="text-xs font-semibold">{item.name}</span>
            <span className="text-xs">{item.change.toFixed(2)}%</span>
        </div>
    );
};

const Heatmap: React.FC<{ items: HeatmapItem[] }> = ({ items }) => (
    <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-muted/20">
        {items.map(item => (
            <HeatmapItemTile key={item.name} item={item} />
        ))}
    </div>
);

const SummaryCard: React.FC<{ item: SummaryCardItem }> = ({ item }) => (
    <Card className="shrink-0 w-60 shadow-sm">
        <CardHeader className="p-3 pb-1">
            <CardTitle className="text-sm font-semibold text-primary flex justify-between items-center">
                <span>{item.name}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
            <p className="text-xs text-muted-foreground">{item.companies} COMPANIES</p>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs">
            <div className="flex justify-between items-center">
                <div>
                    <p className={cn("text-lg font-bold", item.change >= 0 ? 'text-green-600' : 'text-red-500')}>
                        {item.change.toFixed(2)}%
                    </p>
                    <p className="text-muted-foreground">Day Change %</p>
                </div>
                {item.ltp !== undefined ? (
                    <div className="text-right">
                        <p className="text-lg font-bold">{item.ltp.toLocaleString('en-IN')}</p>
                        <p className="text-muted-foreground">LTP</p>
                    </div>
                ) : (
                    <div className="text-right">
                        <p className="text-green-600 font-semibold">{item.advances || 0} Adv</p>
                        <p className="text-red-600 font-semibold">{item.declines || 0} Dec</p>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
);

const HeatmapSection: React.FC<{ title: string, items: HeatmapItem[], summaryCards: SummaryCardItem[] }> = ({ title, items, summaryCards }) => (
    <section className="mb-8">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <BarChartHorizontal className="h-5 w-5 text-primary" />
                {title}
            </h3>
            <span className="text-xs text-muted-foreground">1 Day Change</span>
        </div>
        <Heatmap items={items} />
        <div className="flex space-x-4 overflow-x-auto pt-4 no-scrollbar">
            {summaryCards.map(card => <SummaryCard key={card.name} item={card} />)}
            <Button variant="ghost" className="shrink-0 self-center text-primary">View all <ChevronRight className="h-4 w-4 ml-1" /></Button>
        </div>
    </section>
);

const SectorsView: React.FC = () => {
    const [subTab, setSubTab] = useState('Dashboard');
    const subTabs = ['Dashboard', 'Sectors', 'Industries', 'Indices'];

    return (
        <div className="space-y-4">
             <div className="w-full overflow-x-auto no-scrollbar">
                <div className="flex items-center border rounded-lg p-1 bg-muted/50 w-fit">
                    {subTabs.map(tab => (
                        <Button
                            key={tab}
                            variant={subTab === tab ? "secondary" : "ghost"}
                            onClick={() => setSubTab(tab)}
                            className="px-4 py-1.5 h-auto text-sm font-medium rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 whitespace-nowrap"
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-muted-foreground">ANALYZE BY</p>
                <Select defaultValue="day_change">
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Select analysis type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day_change">% DAY CHANGE</SelectItem>
                    <SelectItem value="week_change">% WEEK CHANGE</SelectItem>
                    <SelectItem value="month_change">% MONTH CHANGE</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            
            <div className="mt-6">
                <HeatmapSection title="Sectors" items={sectorsHeatmap} summaryCards={sectorsSummary} />
                <HeatmapSection title="Industries" items={industriesHeatmap} summaryCards={industriesSummary} />
                <HeatmapSection title="Indices" items={indicesHeatmap} summaryCards={indicesSummary} />
            </div>

            <p className="text-xs text-muted-foreground text-center pt-4">*All financials are in Rs Crores</p>
        </div>
    );
};


// #endregion

// Main Page Component
export default function StocksMarketPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Indices');
    const tabs = ['Indices', 'Sectors', 'Events Calendar', 'FII & DII', 'Insider'];

    const renderContent = () => {
        switch (activeTab) {
            case 'Indices':
                return <IndicesView />;
            case 'Sectors':
                return <SectorsView />;
            default:
                return <div className="text-center py-10 text-muted-foreground">Content for {activeTab} is coming soon.</div>;
        }
    };


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
                        {renderContent()}
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
