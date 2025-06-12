
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/shared/AppHeader'; // Assuming you might want the header
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStocks, mockCryptoAssets, mockMutualFunds, mockBonds, mockIndexFuturesForWatchlist, mockStockFuturesForWatchlist, mockOptionsForWatchlist } from '@/lib/mockData';
import type { Stock } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TrendingUp, TrendingDown, Info, CalendarDays, Maximize2, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Combine all mock asset lists for easier lookup
const allMockAssets: Stock[] = [
  ...mockStocks,
  ...mockCryptoAssets,
  ...mockMutualFunds,
  ...mockBonds,
  ...mockIndexFuturesForWatchlist,
  ...mockStockFuturesForWatchlist,
  ...mockOptionsForWatchlist
];

const PerformanceBar: React.FC<{ low: number; high: number; current?: number; labelLow: string; labelHigh: string }> = ({ low, high, current, labelLow, labelHigh }) => {
  const range = high - low;
  const currentPositionPercent = current && range > 0 ? ((current - low) / range) * 100 : undefined;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{labelLow}: <span className="font-semibold text-foreground">{low.toFixed(2)}</span></span>
        <span>{labelHigh}: <span className="font-semibold text-foreground">{high.toFixed(2)}</span></span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-muted">
        <div className="absolute h-2 rounded-full bg-primary/30" style={{ left: 0, right: 0 }}></div>
        {currentPositionPercent !== undefined && (
          <div
            className="absolute -top-1 -translate-x-1/2 h-4 w-1 bg-primary rounded-sm shadow"
            style={{ left: `${currentPositionPercent}%` }}
          >
            <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] border-b-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};


export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const symbol = typeof params.symbol === 'string' ? decodeURIComponent(params.symbol) : undefined;

  const [stock, setStock] = useState<Stock | null>(null);
  const [activeTimescale, setActiveTimescale] = useState('1D');

  useEffect(() => {
    if (symbol) {
      const foundStock = allMockAssets.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
      if (foundStock) {
        setStock(foundStock);
      } else {
        toast({
          title: "Error",
          description: `Asset with symbol ${symbol} not found.`,
          variant: "destructive",
        });
        router.push('/'); 
      }
    }
  }, [symbol, router, toast]);

  const handleBuy = () => {
    toast({ title: "Buy Action (Mock)", description: `Initiating BUY for ${stock?.symbol}` });
    // router.push(`/place-order/${stock?.symbol}?action=BUY`); // Future: navigate to actual order form
  };

  const handleSell = () => {
    toast({ title: "Sell Action (Mock)", description: `Initiating SELL for ${stock?.symbol}` });
    // router.push(`/place-order/${stock?.symbol}?action=SELL`); // Future: navigate to actual order form
  };

  if (!stock) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
           {/* No AppHeader here as per image style, back button is manual */}
          <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
            <p>Loading asset details...</p>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const isPositiveChange = stock.change >= 0;
  const timescaleButtons = ['NSE', '1D', '1W', '1M', '1Y', '5Y', 'ALL'];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Manual Header for dark theme */}
        <header className="px-4 py-3 sticky top-0 z-10 bg-background border-b border-border">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-foreground hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-grow overflow-y-auto pb-20"> {/* Padding for fixed footer */}
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Stock Info Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-semibold">{stock.name}</h1>
                <p className={`text-3xl font-bold ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                  ₹{stock.price.toFixed(2)}
                </p>
                <p className={`text-sm ${isPositiveChange ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  {isPositiveChange ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%) 1D
                </p>
              </div>
              {stock.sector && (
                <Badge variant="outline" className="text-xs">{stock.sector}</Badge>
              )}
            </div>

            {/* Chart Area - Placeholder */}
            <div className="h-64 bg-muted rounded-md flex items-center justify-center my-4 relative overflow-hidden" data-ai-hint="stock chart graph">
              <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
                <path d="M0 100 L30 90 L60 110 L90 80 L120 95 L150 70 L180 85 L210 60 L240 75 L270 50 L300 65" 
                      fill="none" 
                      stroke={isPositiveChange ? "hsl(var(--positive))" : "hsl(var(--destructive))"} 
                      strokeWidth="2"/>
                <line x1="0" y1="120" x2="300" y2="120" stroke="hsl(var(--border))" strokeDasharray="4 2" />
              </svg>
               <div className="absolute top-2 right-2 flex space-x-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary"> <Maximize2 className="h-4 w-4" /> </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary"> <BarChart2 className="h-4 w-4" /> </Button>
              </div>
            </div>


            {/* Timescale Buttons */}
            <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2">
              {timescaleButtons.map(ts => (
                <Button
                  key={ts}
                  variant={activeTimescale === ts ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTimescale(ts)}
                  className={cn(
                    "rounded-full px-3 text-xs shrink-0",
                     activeTimescale === ts ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {ts}
                </Button>
              ))}
            </div>

            {/* Create Stock SIP Banner */}
            <Card className="bg-muted/50 hover:bg-muted/70 cursor-pointer" onClick={() => toast({title: "Stock SIP feature coming soon!"})}>
              <CardContent className="p-4 flex items-center space-x-3">
                <CalendarDays className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-sm text-foreground">Create Stock SIP</p>
                  <p className="text-xs text-muted-foreground">Automate your investments in this stock</p>
                </div>
                <ArrowLeft className="h-4 w-4 text-muted-foreground ml-auto transform rotate-180" />
              </CardContent>
            </Card>

            {/* Tabs for Overview, News, Events */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/30">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-md font-semibold flex items-center">
                    Performance 
                    <Info className="h-3 w-3 ml-1.5 text-muted-foreground cursor-pointer" onClick={() => toast({title: "Performance Info Clicked"})} />
                  </h3>
                </div>
                {stock.todayLow && stock.todayHigh && (
                  <PerformanceBar low={stock.todayLow} high={stock.todayHigh} current={stock.price} labelLow="Today's Low" labelHigh="Today's High" />
                )}
                {stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh && (
                  <PerformanceBar low={stock.fiftyTwoWeekLow} high={stock.fiftyTwoWeekHigh} current={stock.price} labelLow="52 Week Low" labelHigh="52 Week High" />
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Open</p>
                    <p className="font-semibold text-foreground">{stock.openPrice?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Prev. Close</p>
                    <p className="font-semibold text-foreground">{stock.prevClosePrice?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="font-semibold text-foreground">{stock.volume?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="news" className="mt-4">
                <p className="text-muted-foreground text-center py-8">News section coming soon.</p>
              </TabsContent>
              <TabsContent value="events" className="mt-4">
                <p className="text-muted-foreground text-center py-8">Events section coming soon.</p>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Fixed Footer Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 shadow-md_ z-20">
          <div className="container mx-auto flex space-x-3">
            <Button onClick={handleSell} variant="destructive" className="flex-1 text-base py-3 bg-red-600 hover:bg-red-700">
              Sell
            </Button>
            <Button onClick={handleBuy} className="flex-1 text-base py-3 bg-green-600 hover:bg-green-700 text-white">
              Buy
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
