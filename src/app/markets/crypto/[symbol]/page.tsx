
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCryptoAssets, mockNewsArticles } from '@/lib/mockData';
import type { Stock, NewsArticle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TrendingUp, TrendingDown, Info, Maximize2, BarChart2, Bell, Star, Briefcase, ExternalLink, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// News relevance function - can be moved to a shared util
function getRelevantNewsForCrypto(asset: Stock | null, allNews: NewsArticle[]): NewsArticle[] {
    if (!asset || !allNews.length) return [];
    const keywords = [asset.name.toLowerCase(), asset.symbol.toLowerCase()];
    return allNews.filter(news => keywords.some(keyword => news.headline.toLowerCase().includes(keyword)));
}

const FundamentalRow: React.FC<{ label: string; value: string | number; isPositive?: boolean, isNegative?: boolean, className?: string }> = ({ label, value, isPositive, isNegative, className }) => (
    <div className={cn("flex justify-between items-center py-2.5 px-3 even:bg-muted/30", className)}>
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={cn("text-sm font-semibold text-foreground", isPositive && "text-green-600", isNegative && "text-red-600")}>
            {value}
        </span>
    </div>
);

interface CryptoMarketPageProps {
  params: { symbol: string };
  onBack: () => void;
}

export function CryptoMarketPage({ params, onBack }: CryptoMarketPageProps) {
    const { toast } = useToast();
    const symbol = typeof params.symbol === 'string' ? decodeURIComponent(params.symbol) : undefined;
    
    const [asset, setAsset] = useState<Stock | null>(null);
    const [assetSpecificNews, setAssetSpecificNews] = useState<NewsArticle[]>([]);
    const [activeTimescale, setActiveTimescale] = useState('1M');

    useEffect(() => {
        if (symbol) {
            const foundAsset = mockCryptoAssets.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
            if (foundAsset) {
                setAsset(foundAsset);
                setAssetSpecificNews(getRelevantNewsForCrypto(foundAsset, mockNewsArticles));
            } else {
                toast({ title: "Error", description: `Asset with symbol ${symbol} not found.`, variant: "destructive" });
                onBack();
            }
        }
    }, [symbol, toast, onBack]);

    if (!asset) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                <p>Loading asset details...</p>
            </div>
        );
    }
    
    const isPositiveChange = asset.change >= 0;
    const timescaleButtons = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
    
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="px-4 py-3 sticky top-16 z-20 bg-background border-b border-border flex justify-between items-center">
                <Button variant="ghost" size="icon" onClick={onBack} className="text-foreground hover:bg-muted">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold">{asset.name}</h1>
                <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><Star className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><Briefcase className="h-5 w-5" /></Button>
                </div>
            </header>
            
            <main className="flex-grow overflow-y-auto">
                <Tabs defaultValue="market" className="w-full">
                    <TabsList className="w-full justify-start rounded-none bg-background p-0 px-4 sticky top-32 z-10 border-b overflow-x-auto no-scrollbar">
                        <TabsTrigger value="market">Market</TabsTrigger>
                        <TabsTrigger value="news">News</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                        <TabsTrigger value="study">Study</TabsTrigger>
                    </TabsList>

                    <TabsContent value="market" className="p-4 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">{asset.name} / U.S. Dollar</p>
                            <p className="text-3xl font-bold">${(asset.price / 83).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: (asset.price / 83) < 1 ? 6 : 2})}</p>
                            <p className={cn("text-sm flex items-center", isPositiveChange ? 'text-green-500' : 'text-red-500')}>
                              {isPositiveChange ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                              {(asset.change / 83).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: (asset.price / 83) < 1 ? 6 : 2, signDisplay: 'always'})} 
                              <span className="ml-1">({asset.changePercent.toFixed(2)}%)</span>
                              <span className="ml-2 text-muted-foreground text-xs">Past month</span>
                            </p>
                          </div>
                           <Avatar className="h-10 w-10">
                            <AvatarFallback>{asset.symbol.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>

                         <div className="h-64 bg-muted rounded-md flex items-center justify-center my-4 relative overflow-hidden" data-ai-hint="crypto chart graph">
                          <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
                            <path d="M0 130 C 20 120, 40 100, 60 110 S 100 140, 120 120 S 160 80, 180 90 S 220 110, 240 70, 280 40, 300 50" 
                                  fill="none" 
                                  stroke={isPositiveChange ? "hsl(var(--positive))" : "hsl(var(--destructive))"} 
                                  strokeWidth="2"/>
                          </svg>
                        </div>
          
                        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2">
                          {timescaleButtons.map(ts => (
                            <Button
                              key={ts}
                              variant={activeTimescale === ts ? 'secondary' : 'ghost'}
                              size="sm"
                              onClick={() => setActiveTimescale(ts)}
                              className="rounded-md px-4 text-xs shrink-0"
                            >
                              {ts}
                            </Button>
                          ))}
                        </div>

                        <Card>
                            <CardHeader><CardTitle>Fundamental</CardTitle></CardHeader>
                            <CardContent className="divide-y p-0">
                               <FundamentalRow label="Total Volume" value={`$${((asset.volume || 0) / 83 / 1e9).toFixed(2)} B`} />
                               <FundamentalRow label="Market Cap" value={`$${(parseFloat(asset.marketCap?.replace('₹', '').replace('T', ''))*1e12 / 83 / 1e9).toFixed(2)} B`} />
                               <FundamentalRow label="Total Supply" value="120.71 M" />
                               <FundamentalRow label="Circulating Supply" value="120.71 M" />
                               <FundamentalRow label="High (24h)" value={`$${((asset.todayHigh || 0) / 83).toLocaleString('en-US', {minimumFractionDigits: 2})}`} />
                               <FundamentalRow label="Low (24h)" value={`$${((asset.todayLow || 0) / 83).toLocaleString('en-US', {minimumFractionDigits: 2})}`} />
                               <FundamentalRow label="Max Supply" value="No data" />
                               <FundamentalRow label="Change (1h)" value="1.26%" isPositive />
                               <FundamentalRow label="Change (24h)" value="-0.37%" isNegative />
                               <FundamentalRow label="Change (7d)" value="5.04%" isPositive />
                            </CardContent>
                        </Card>

                        {asset.aboutCompany && (
                            <Card>
                                <CardHeader><CardTitle>About Coin</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="text-sm text-foreground/80 leading-relaxed">
                                        {asset.aboutCompany} 
                                        <Button variant="link" className="p-0 h-auto ml-1">Show More</Button>
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                    <TabsContent value="news" className="p-4">
                        <NewsSection articles={assetSpecificNews} title={`News related to ${asset.name}`} />
                    </TabsContent>
                     <TabsContent value="analysis" className="p-4 text-center text-muted-foreground">
                        <p>Analysis tools and data will be available here soon.</p>
                    </TabsContent>
                     <TabsContent value="study" className="p-4 text-center text-muted-foreground">
                        <p>Educational content and studies will be available here soon.</p>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
