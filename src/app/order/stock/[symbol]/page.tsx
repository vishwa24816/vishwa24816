
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStocks, mockCryptoAssets, mockMutualFunds, mockBonds, mockIndexFuturesForWatchlist, mockStockFuturesForWatchlist, mockOptionsForWatchlist, mockNewsArticles } from '@/lib/mockData';
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

function getRelevantNewsForStock(stock: Stock | null, allNews: NewsArticle[]): NewsArticle[] {
    if (!stock || !allNews.length) {
        return [];
    }
    const relevantNews: NewsArticle[] = [];
    const stockKeywords = [stock.name.toLowerCase(), stock.symbol.toLowerCase()];
    if(stock.sector) stockKeywords.push(stock.sector.toLowerCase());


    allNews.forEach(news => {
        const headlineLower = news.headline.toLowerCase();
        if (stockKeywords.some(keyword => keyword && headlineLower.includes(keyword))) {
        relevantNews.push(news);
        }
    });
    return relevantNews;
}


export default function StockOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const symbol = typeof params.symbol === 'string' ? decodeURIComponent(params.symbol) : undefined;

  const [asset, setAsset] = useState<Stock | null>(null);
  const [assetSpecificNews, setAssetSpecificNews] = useState<NewsArticle[]>([]);
  const [activeTimescale, setActiveTimescale] = useState('1D');
  const [activeFinancialsCategory, setActiveFinancialsCategory] = useState<'revenue' | 'profit' | 'netWorth'>('revenue');
  const [productTypeForOrder, setProductTypeForOrder] = useState('Longterm');


  useEffect(() => {
    if (symbol) {
      // For a stock page, we explicitly look for assets that are typically stocks (NSE/BSE) or ETFs
      const foundAsset = allMockAssets.find(s => 
        s.symbol.toUpperCase() === symbol.toUpperCase() &&
        (s.exchange === 'NSE' || s.exchange === 'BSE' || s.type === 'Stock' || s.type === 'ETF')
      );
      if (foundAsset) {
        setAsset(foundAsset);
        const relevantNews = getRelevantNewsForStock(foundAsset, mockNewsArticles);
        setAssetSpecificNews(relevantNews);

      } else {
        toast({
          title: "Error",
          description: `Stock with symbol ${symbol} not found.`,
          variant: "destructive",
        });
        router.push('/'); 
      }
    }
  }, [symbol, router, toast]);

  const handleBuyAction = () => {
    toast({ title: "Buy Action (Mock)", description: `Initiating BUY for ${asset?.symbol} with product type: ${productTypeForOrder}` });
  };

  const handleSellAction = () => {
     if (productTypeForOrder === 'Intraday') {
      toast({ title: "Action Denied", description: "Short selling for Intraday (MIS) might be handled via portfolio for existing positions or specific order options.", variant: "destructive" });
      return;
    }
    toast({ title: "Sell Action (Mock)", description: `Initiating SELL for ${asset?.symbol} with product type: ${productTypeForOrder}` });
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
  const timescaleButtons = ['NSE', '1D', '1W', '1M', '1Y', '5Y', 'ALL'];
  
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

        <main className="flex-grow overflow-y-auto pb-20"> {/* Adjusted padding for fixed footer */}
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
              {asset.sector && (
                <Badge variant="outline" className="text-xs">{asset.sector}</Badge>
              )}
            </div>

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
            
            <OrderPlacementForm asset={asset} productType={productTypeForOrder} onProductTypeChange={setProductTypeForOrder} assetType="stock"/>

            <Tabs defaultValue="technicals" className="w-full">
              <TabsList className="w-full bg-muted/30 flex overflow-x-auto whitespace-nowrap no-scrollbar rounded-none p-0 h-auto border-b mb-1">
                <TabsTrigger value="technicals" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Technicals</TabsTrigger>
                <TabsTrigger value="fundamentals" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Fundamentals</TabsTrigger>
                <TabsTrigger value="financials" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Financials</TabsTrigger>
                <TabsTrigger value="news" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">News</TabsTrigger>
              </TabsList>
              
              <TabsContent value="fundamentals" className="mt-4 space-y-6">
                 {asset.fundamentals && (
                  <CollapsibleSection title="Fundamentals" icon={SearchIcon} defaultOpen>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div><span className="text-muted-foreground">Mkt Cap</span><p className="font-semibold text-foreground">{asset.fundamentals.marketCap || 'N/A'}</p></div>
                      <div><span className="text-muted-foreground">ROE</span><p className="font-semibold text-foreground">{asset.fundamentals.roe?.toFixed(2) || 'N/A'}%</p></div>
                      <div><span className="text-muted-foreground">P/E Ratio (TTM)</span><p className="font-semibold text-foreground">{asset.fundamentals.peRatioTTM?.toFixed(2) || 'N/A'}</p></div>
                      <div><span className="text-muted-foreground">EPS (TTM)</span><p className="font-semibold text-foreground">{asset.fundamentals.epsTTM?.toFixed(2) || 'N/A'}</p></div>
                      <div><span className="text-muted-foreground">P/B Ratio</span><p className="font-semibold text-foreground">{asset.fundamentals.pbRatio?.toFixed(2) || 'N/A'}</p></div>
                      <div><span className="text-muted-foreground">Div Yield</span><p className="font-semibold text-foreground">{asset.fundamentals.divYield?.toFixed(2) || 'N/A'}%</p></div>
                      <div><span className="text-muted-foreground">Industry P/E</span><p className="font-semibold text-foreground">{asset.fundamentals.industryPe?.toFixed(2) || 'N/A'}</p></div>
                      <div><span className="text-muted-foreground">Book Value</span><p className="font-semibold text-foreground">{asset.fundamentals.bookValue?.toFixed(2) || 'N/A'}</p></div>
                      <div><span className="text-muted-foreground">Debt to Equity</span><p className="font-semibold text-foreground">{asset.fundamentals.debtToEquity?.toFixed(2) || 'N/A'}</p></div>
                      <div><span className="text-muted-foreground">Face Value</span><p className="font-semibold text-foreground">{asset.fundamentals.faceValue?.toFixed(2) || 'N/A'}</p></div>
                    </div>
                  </CollapsibleSection>
                )}
              </TabsContent>
              
              <TabsContent value="financials" className="mt-4 space-y-6">
                {asset.financials && (
                  <CollapsibleSection title="Financials" icon={BarChart2} defaultOpen>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar">
                        {(['revenue', 'profit', 'netWorth'] as const).map(cat => (
                          <Button 
                            key={cat}
                            variant={activeFinancialsCategory === cat ? 'secondary' : 'ghost'} 
                            size="sm" 
                            className="rounded-full text-xs px-3 shrink-0"
                            onClick={() => setActiveFinancialsCategory(cat)}
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </Button>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full text-xs px-3 shrink-0 flex items-center">
                        <ChevronLeftIcon className="h-3 w-3 mr-0.5" />
                        <ChevronRightIcon className="h-3 w-3 mr-1" />
                        Quarterly
                      </Button>
                    </div>
                    <div className="flex justify-between items-end h-40 bg-muted/20 p-4 rounded-md relative" data-ai-hint="financials bar chart">
                       {currentFinancialsData.length > 0 ? (
                        currentFinancialsData.map((data) => (
                          <FinancialBar key={data.period} value={data.value} maxValue={maxFinancialValue} label={data.period} />
                        ))
                      ) : (
                        <p className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">No financial data available for {activeFinancialsCategory}.</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-3 text-xs">
                      <Link href="#" className="text-primary hover:underline">View details</Link>
                      <p className="text-muted-foreground">*All values are in crore</p>
                    </div>
                  </CollapsibleSection>
                )}
              </TabsContent>

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
                  {(asset.lowerCircuit || asset.upperCircuit) && (
                    <div className="flex justify-between text-xs mt-4">
                      <div>
                        <p className="text-muted-foreground">Lower circuit</p>
                        <p className="font-semibold text-foreground">{asset.lowerCircuit?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Upper circuit</p>
                        <p className="font-semibold text-foreground">{asset.upperCircuit?.toFixed(2) || 'N/A'}</p>
                      </div>
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
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="font-semibold text-foreground">{asset.volume?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
                
                {asset.similarStocks && asset.similarStocks.length > 0 && (
                  <CollapsibleSection title="Similar Stocks" icon={Landmark} defaultOpen>
                     <div className="space-y-3">
                      {asset.similarStocks.map(simStock => {
                        const isSimPositive = simStock.changePercent >= 0;
                        return (
                          <Link href={`/order/stock/${simStock.symbol}`} key={simStock.id} className="block p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-foreground text-sm">{simStock.name} <span className="text-xs text-muted-foreground">({simStock.symbol})</span></p>
                                {simStock.marketCap && <p className="text-xs text-muted-foreground">Mkt Cap: {simStock.marketCap}</p>}
                              </div>
                              <div className="text-right">
                                <p className={`font-medium ${isSimPositive ? 'text-green-500' : 'text-red-500'}`}>₹{simStock.price.toFixed(2)}</p>
                                <p className={`text-xs ${isSimPositive ? 'text-green-500' : 'text-red-500'}`}>
                                  {isSimPositive ? '+' : ''}{simStock.changePercent.toFixed(2)}%
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </CollapsibleSection>
                )}

                <CollapsibleSection title="Technical Analysis" icon={LineChart} defaultOpen>
                    <p>Detailed technical indicators and charts will be displayed here.</p>
                    <div className="h-60 bg-muted rounded-md flex items-center justify-center my-4" data-ai-hint="technical chart indicators">
                      <p className="text-muted-foreground">Technical Chart Placeholder</p>
                    </div>
                </CollapsibleSection>
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
        
        <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border p-3 shadow-md_ z-20"> {/* Sits above AppFooter (h-16) */}
          <div className="container mx-auto flex space-x-3">
            <Button 
              onClick={handleSellAction} 
              variant="destructive" 
              className="flex-1 text-base py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:bg-red-800"
              disabled={productTypeForOrder === 'Intraday'}
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
    

    



