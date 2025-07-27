
"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { MarketsHeader } from '@/components/markets/MarketsHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMarketIndices, mockStocks } from '@/lib/mockData';
import { MarketMoversCard, MoverCategory } from '@/components/markets/MarketMoversCard';
import { FiiDiiCard } from '@/components/markets/FiiDiiCard';
import { IndexCard } from '@/components/markets/IndexCard';

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
    const [activeMode, setActiveMode] = useState<'Fiat' | 'Crypto'>('Fiat');

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen">
                <AppHeader 
                    isRealMode={false} 
                    activeMode={activeMode} 
                    onModeChange={setActiveMode} 
                />
                <main className="flex-grow">
                    <MarketsHeader />
                    <div className="p-4 space-y-6">
                        <div className="flex space-x-4 overflow-x-auto pb-2 -mb-2 no-scrollbar">
                            {mockMarketIndices.map(index => (
                                <IndexCard key={index.id} index={index} />
                            ))}
                        </div>

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
                </main>
            </div>
        </ProtectedRoute>
    );
}
