
"use client";

import React, { useMemo } from 'react';
import type { Stock } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

export type MoverCategory = 'gainers' | 'losers' | '52w-high' | '52w-low' | 'volume-shockers' | 'high-vol-gain' | 'high-vol-loss';

interface MarketMoversCardProps {
  title: string;
  category: MoverCategory;
  stocks: Stock[];
}

const StockItem = ({ stock }: { stock: Stock }) => {
    const isPositive = (stock.changePercent || 0) >= 0;
    return (
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{stock.name}</p>
                <p className="text-xs text-muted-foreground">{stock.sector}</p>
            </div>
            <div className="text-right shrink-0 pl-2">
                <p className="font-semibold text-sm">₹{stock.price.toFixed(2)}</p>
                <p className={`text-xs flex items-center justify-end ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </p>
            </div>
        </div>
    );
};


export const MarketMoversCard: React.FC<MarketMoversCardProps> = ({ title, category, stocks }) => {

    const filteredStocks = useMemo(() => {
        let sortedStocks = [...stocks];
        switch(category) {
            case 'gainers':
                sortedStocks.sort((a, b) => b.changePercent - a.changePercent);
                break;
            case 'losers':
                sortedStocks.sort((a, b) => a.changePercent - b.changePercent);
                break;
            case '52w-high':
                 sortedStocks.sort((a, b) => (b.price / (b.fiftyTwoWeekHigh || b.price)) - (a.price / (a.fiftyTwoWeekHigh || a.price)));
                break;
            case '52w-low':
                sortedStocks.sort((a, b) => (a.price / (a.fiftyTwoWeekLow || a.price)) - (b.price / (b.fiftyTwoWeekLow || b.price)));
                break;
            case 'volume-shockers':
            case 'high-vol-gain':
            case 'high-vol-loss':
                 sortedStocks.sort((a, b) => (b.volume || 0) - (a.volume || 0));
                break;
        }
        return sortedStocks.slice(0, 3);
    }, [stocks, category]);

    const Icon = title.includes('Gainers') || title.includes('High') ? TrendingUp : TrendingDown;

    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${title.includes('Gainers') || title.includes('High') ? 'text-green-500' : 'text-red-500'}`} />
                    {title}
                </CardTitle>
                <Button variant="link" size="sm" className="text-primary pr-0">View all</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    {filteredStocks.map(stock => <StockItem key={stock.id} stock={stock} />)}
                </div>
            </CardContent>
        </Card>
    );
};
