
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allMockAssets, mockNewsArticles } from '@/lib/mockData'; // Import all assets
import type { Stock, NewsArticle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TrendingUp, TrendingDown, Info, Maximize2, BarChart2, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { OrderPlacementForm } from '@/components/order/OrderPlacementForm';

// Performance Bar Component (can be shared or defined locally)
const PerformanceBar: React.FC<{ low: number; high: number; current?: number; labelLow: string; labelHigh: string }> = ({ low, high, current, labelLow, labelHigh }) => {
  const range = high - low;
  const currentPositionPercent = current && range > 0 ? ((current - low) / range) * 100 : undefined;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{labelLow}: <span className="font-semibold text-foreground">₹{low.toFixed(2)}</span></span>
        <span>{labelHigh}: <span className="font-semibold text-foreground">₹{high.toFixed(2)}</span></span>
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

// Collapsible Section Component (can be shared or defined locally)
const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ElementType }> = ({ title, children, defaultOpen = false, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mt-6">
      <button
        className="flex justify-between items-center w-full mb-2 text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-md font-semibold flex items-center">
          {Icon && <Icon className="h-5 w-5 mr-2 text-primary" />}
          {title}
        </h3>
        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {isOpen && <div className="mt-2 text-sm text-muted-foreground animate-accordion-down">{children}</div>}
    </div>
  );
};

// News relevance function
function getRelevantNewsForCrypto(asset: Stock | null, allNews: NewsArticle[]): NewsArticle[] {
    if (!asset || !allNews.length) {
        return [];
    }
    const relevantNews: NewsArticle[] = [];
    const assetKeywords = [asset.name.toLowerCase(), asset.symbol.toLowerCase()];

    allNews.forEach(news => {
        const headlineLower = news.headline.toLowerCase();
        if (assetKeywords.some(keyword => keyword && headlineLower.includes(keyword))) {
        relevantNews.push(news);
        }
    });
    return relevantNews;
}


export default function CryptoOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const symbol = typeof params.symbol === 'string' ? decodeURIComponent(params.symbol) : undefined;

  const [asset, setAsset] = useState<Stock | null>(null);
  const [assetSpecificNews, setAssetSpecificNews] = useState<NewsArticle[]>([]);
  const [activeTimescale, setActiveTimescale] = useState('24H');
  // For crypto, productType is always longterm/spot in this context, but we keep state for consistency
  const [productTypeForOrder, setProductTypeForOrder] = useState('Longterm');


  useEffect(() => {
    if (symbol) {
      const foundAsset = allMockAssets.find(s => 
        s.symbol.toUpperCase() === symbol.toUpperCase() &&
        s.exchange === 'Crypto'
      );
      if (foundAsset) {
        setAsset(foundAsset);
        const relevantNews = getRelevantNewsForCrypto(foundAsset, mockNewsArticles);
        setAssetSpecificNews(relevantNews);

      } else {
        toast({
          title: "Error",
          description: `Crypto Asset with symbol ${symbol} not found.`,
          variant: "destructive",
        });
        router.push('/'); 
      }
    }
  }, [symbol, router, toast]);

  const handleBuyAction = () => {
    toast({ title: "Buy Action (Mock)", description: `Initiating BUY for ${asset?.symbol}.` });
  };

  const handleSellAction = () => {
    toast({ title: "Sell Action (Mock)", description: `Initiating SELL for ${asset?.symbol}.` });
  };


  if (!asset) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
            <p>Loading asset details...</p>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const isPositiveChange = asset.change >= 0;
  const timescaleButtons = ['24H', '1D', '1W', '1M', '1Y', 'ALL'];
  
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="px-4 py-3 sticky top-0 z-10 bg-background border-b border-border">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-foreground hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-grow overflow-y-auto pb-20">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-semibold">{asset.name}</h1>
                <p className={`text-3xl font-bold ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                  ₹{asset.price.toFixed(2)}
                </p>
                <p className={`text-sm ${isPositiveChange ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  {isPositiveChange ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%) 24H
                </p>
              </div>
              <Badge variant="outline" className="text-xs">{asset.exchange}</Badge>
            </div>

            <div className="h-64 bg-muted rounded-md flex items-center justify-center my-4 relative overflow-hidden" data-ai-hint="crypto chart graph">
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
            
            <OrderPlacementForm asset={asset} productType={productTypeForOrder} onProductTypeChange={setProductTypeForOrder} assetType="crypto"/>

            <Tabs defaultValue="technicals" className="w-full">
              <TabsList className="w-full bg-muted/30 flex overflow-x-auto whitespace-nowrap no-scrollbar rounded-none p-0 h-auto border-b mb-1">
                <TabsTrigger value="technicals" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Technicals</TabsTrigger>
                <TabsTrigger value="news" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">News</TabsTrigger>
              </TabsList>
              
              <TabsContent value="technicals" className="mt-4 space-y-6">
                <div>
                  <h3 className="text-md font-semibold flex items-center mb-2">
                    Performance 
                    <Info className="h-3 w-3 ml-1.5 text-muted-foreground cursor-pointer" onClick={() => toast({title: "Performance Info Clicked"})} />
                  </h3>
                  {asset.todayLow && asset.todayHigh && (
                    <PerformanceBar low={asset.todayLow} high={asset.todayHigh} current={asset.price} labelLow="Today's Low" labelHigh="Today's High" />
                  )}
                  {asset.fiftyTwoWeekLow && asset.fiftyTwoWeekHigh && (
                    <div className="mt-3">
                      <PerformanceBar low={asset.fiftyTwoWeekLow} high={asset.fiftyTwoWeekHigh} current={asset.price} labelLow="52 Week Low" labelHigh="52 Week High" />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm pt-2 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Open</p>
                    <p className="font-semibold text-foreground">{asset.openPrice?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Prev. Close</p>
                    <p className="font-semibold text-foreground">{asset.prevClosePrice?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Volume (24H)</p>
                    <p className="font-semibold text-foreground">{asset.volume?.toLocaleString() || 'N/A'}</p>
                  </div>
                   <div>
                    <p className="text-xs text-muted-foreground">Market Cap</p>
                    <p className="font-semibold text-foreground">{asset.marketCap || 'N/A'}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="news" className="mt-4">
                 <NewsSection
                    articles={assetSpecificNews}
                    title={`All News related to ${asset.name}`}
                    customDescription={`Browse all recent news articles for ${asset.symbol}.`}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border p-3 shadow-md_ z-20">
          <div className="container mx-auto flex space-x-3">
            <Button 
              onClick={handleSellAction} 
              variant="destructive" 
              className="flex-1 text-base py-3 bg-red-600 hover:bg-red-700"
            >
              Sell
            </Button>
            <Button 
              onClick={handleBuyAction} 
              className="flex-1 text-base py-3 bg-green-600 hover:bg-green-700 text-white"
            >
              Buy
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
