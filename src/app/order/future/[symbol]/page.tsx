
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    mockStocks, 
    mockCryptoAssets, 
    mockMutualFunds, 
    mockBonds, 
    mockIndexFuturesForWatchlist, 
    mockStockFuturesForWatchlist, 
    mockOptionsForWatchlist, 
    mockNewsArticles 
} from '@/lib/mockData';
import type { Stock, NewsArticle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TrendingUp, TrendingDown, Info, Maximize2, BarChart2, ChevronUp, ChevronDown, ChevronLeftIcon, ChevronRightIcon, Landmark, SearchIcon, LineChart, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { OrderPlacementForm } from '@/components/order/OrderPlacementForm';

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

const FinancialBar: React.FC<{ value: number; maxValue: number; label: string }> = ({ value, maxValue, label }) => {
  const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="flex flex-col items-center w-1/5">
      <div className="text-xs mb-1 text-foreground">{value.toLocaleString()}</div>
      <div className="w-6 sm:w-8 bg-green-500 rounded-t-sm" style={{ height: `${Math.max(10, heightPercent * 0.8)}%` }}></div>
      <p className="text-xs mt-1 text-muted-foreground whitespace-nowrap">{label}</p>
    </div>
  );
};

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

function getRelevantNewsForAsset(asset: Stock | null, allNews: NewsArticle[]): NewsArticle[] {
    if (!asset || !allNews.length) {
        return [];
    }
    const relevantNews: NewsArticle[] = [];
    const assetKeywords = [asset.name.toLowerCase(), asset.symbol.toLowerCase()];
    if(asset.sector) assetKeywords.push(asset.sector.toLowerCase());
    if(asset.symbol.includes("FUT")) { // Add underlying for futures
        const underlying = asset.symbol.replace("JANFUT", "").replace("FEBFUT", "").replace("MARFUT", ""); // Basic matcher
        assetKeywords.push(underlying.toLowerCase());
    }


    allNews.forEach(news => {
        const headlineLower = news.headline.toLowerCase();
        if (assetKeywords.some(keyword => keyword && headlineLower.includes(keyword))) {
        relevantNews.push(news);
        }
    });
    return relevantNews;
}


export default function FutureOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const symbol = typeof params.symbol === 'string' ? decodeURIComponent(params.symbol) : undefined;

  const [asset, setAsset] = useState<Stock | null>(null);
  const [assetSpecificNews, setAssetSpecificNews] = useState<NewsArticle[]>([]);
  const [activeTimescale, setActiveTimescale] = useState('1D');
  const [activeFinancialsCategory, setActiveFinancialsCategory] = useState<'revenue' | 'profit' | 'netWorth'>('revenue');
  const [productTypeForOrder, setProductTypeForOrder] = useState('Longterm'); // NRML for futures

  useEffect(() => {
    if (symbol) {
      const foundAsset = allMockAssets.find(s => 
        s.symbol.toUpperCase() === symbol.toUpperCase() &&
        (s.exchange === 'NFO' && (s.symbol.includes('FUT') || s.name.toLowerCase().includes('future')))
      );
      if (foundAsset) {
        setAsset(foundAsset);
        const relevantNews = getRelevantNewsForAsset(foundAsset, mockNewsArticles);
        setAssetSpecificNews(relevantNews);
      } else {
        toast({
          title: "Error",
          description: `Future with symbol ${symbol} not found.`,
          variant: "destructive",
        });
        router.push('/'); 
      }
    }
  }, [symbol, router, toast]);

  const handleBuyAction = () => {
    toast({ title: "Buy Action (Mock)", description: `Initiating BUY for ${asset?.symbol} (${productTypeForOrder})` });
  };

  const handleSellAction = () => {
    toast({ title: "Sell Action (Mock)", description: `Initiating SELL for ${asset?.symbol} (${productTypeForOrder})` });
  };


  if (!asset) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
            <p>Loading future details...</p>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const isPositiveChange = asset.change >= 0;
  const timescaleButtons = ['NFO', '1D', '1W', '1M', 'ALL']; // Adjusted for futures
  
  // Futures might not have financials or fundamentals like stocks, so handle gracefully
  const currentFinancialsData = asset.financials?.[activeFinancialsCategory] || [];
  const maxFinancialValue = Math.max(...currentFinancialsData.map(d => d.value), 0);


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
                  {asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%) 1D
                </p>
              </div>
              {asset.exchange && (
                <Badge variant="outline" className="text-xs">{asset.exchange}</Badge>
              )}
            </div>

            <div className="h-64 bg-muted rounded-md flex items-center justify-center my-4 relative overflow-hidden" data-ai-hint="future chart graph">
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

            <OrderPlacementForm asset={asset} productType={productTypeForOrder} onProductTypeChange={setProductTypeForOrder} assetType="future"/>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-muted/30 flex overflow-x-auto whitespace-nowrap no-scrollbar rounded-none p-0 h-auto border-b">
                <TabsTrigger value="overview" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Overview</TabsTrigger>
                <TabsTrigger value="fundamentals" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Underlying</TabsTrigger>
                <TabsTrigger value="technicals" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Technicals</TabsTrigger>
                 <TabsTrigger value="optionchain" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Option Chain</TabsTrigger>
                <TabsTrigger value="news" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">News</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4 space-y-6">
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
                
                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Open</p>
                    <p className="font-semibold text-foreground">{asset.openPrice?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Prev. Close</p>
                    <p className="font-semibold text-foreground">{asset.prevClosePrice?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Volume (Contracts)</p>
                    <p className="font-semibold text-foreground">{asset.volume?.toLocaleString() || 'N/A'}</p>
                  </div>
                   {asset.lotSize && (
                    <div>
                        <p className="text-xs text-muted-foreground">Lot Size</p>
                        <p className="font-semibold text-foreground">{asset.lotSize}</p>
                    </div>
                   )}
                </div>
              </TabsContent>

              <TabsContent value="fundamentals" className="mt-4 space-y-6">
                 {asset.fundamentals ? ( // Check if underlying stock fundamentals exist
                  <CollapsibleSection title="Underlying Asset Fundamentals" icon={SearchIcon} defaultOpen>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div><span className="text-muted-foreground">Mkt Cap</span><p className="font-semibold text-foreground">{asset.fundamentals.marketCap || 'N/A'}</p></div>
                      <div><span className="text-muted-foreground">P/E Ratio (TTM)</span><p className="font-semibold text-foreground">{asset.fundamentals.peRatioTTM?.toFixed(2) || 'N/A'}</p></div>
                      <div><span className="text-muted-foreground">EPS (TTM)</span><p className="font-semibold text-foreground">{asset.fundamentals.epsTTM?.toFixed(2) || 'N/A'}</p></div>
                    </div>
                  </CollapsibleSection>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><SearchIcon className="h-5 w-5 mr-2 text-primary" /> Underlying Asset Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Detailed information about the underlying asset (e.g., NIFTY, RELIANCE) will be shown here if available.</p>
                            <div className="h-40 bg-muted rounded-md flex items-center justify-center my-4" data-ai-hint="document details">
                            <p className="text-muted-foreground">Underlying Details Placeholder</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
              </TabsContent>
              
              <TabsContent value="technicals" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><LineChart className="h-5 w-5 mr-2 text-primary" /> Technical Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Technical indicators for the future contract and/or its underlying.</p>
                    <div className="h-60 bg-muted rounded-md flex items-center justify-center my-4" data-ai-hint="technical chart indicators">
                      <p className="text-muted-foreground">Technical Chart Placeholder</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="optionchain" className="mt-4 space-y-6">
                 <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><FileText className="h-5 w-5 mr-2 text-primary" /> Option Chain for Underlying</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Option chain data for the underlying asset will be displayed here.</p>
                     <div className="h-60 bg-muted rounded-md flex items-center justify-center my-4" data-ai-hint="options table data">
                      <p className="text-muted-foreground">Option Chain Placeholder</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>


              <TabsContent value="news" className="mt-4">
                 <NewsSection
                    articles={assetSpecificNews}
                    title={`News related to ${asset.name}`}
                    customDescription={`Browse recent news articles for ${asset.symbol} and its underlying.`}
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
