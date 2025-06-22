"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Stock, NewsArticle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TrendingUp, TrendingDown, Info, Maximize2, BarChart2, ChevronLeftIcon, ChevronRightIcon, SearchIcon, LineChart, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { OrderPlacementForm } from '@/components/order/OrderPlacementForm';
import { PerformanceBar, FinancialBar, CollapsibleSection } from './shared/OrderPageComponents';

interface FutureOrderPageContentProps {
  asset: Stock;
  assetSpecificNews: NewsArticle[];
}

export function FutureOrderPageContent({ asset, assetSpecificNews }: FutureOrderPageContentProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTimescale, setActiveTimescale] = useState('1D');
  const [activeFinancialsCategory, setActiveFinancialsCategory] = useState<'revenue' | 'profit' | 'netWorth'>('revenue');
  const [productTypeForOrder, setProductTypeForOrder] = useState('Longterm'); // NRML for futures

  const handleBuyAction = () => {
    toast({ title: "Buy Action (Mock)", description: `Initiating BUY for ${asset?.symbol} (${productTypeForOrder})` });
  };

  const handleSellAction = () => {
    toast({ title: "Sell Action (Mock)", description: `Initiating SELL for ${asset?.symbol} (${productTypeForOrder})` });
  };

  const isPositiveChange = asset.change >= 0;
  const timescaleButtons = ['NFO', '1D', '1W', '1M', 'ALL']; // Adjusted for futures
  
  // Futures might not have financials or fundamentals like stocks, so handle gracefully
  const currentFinancialsData = asset.financials?.[activeFinancialsCategory] || [];
  const maxFinancialValue = Math.max(...currentFinancialsData.map(d => d.value), 0);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="px-4 py-3 sticky top-0 z-10 bg-background border-b border-border">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-foreground hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-grow overflow-y-auto pb-20">
          <div className="w-full px-4 py-4 space-y-4">
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

            <Tabs defaultValue="underlying" className="w-full">
              <TabsList className="w-full bg-muted/30 flex overflow-x-auto whitespace-nowrap no-scrollbar rounded-none p-0 h-auto border-b mb-1">
                <TabsTrigger value="underlying" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Underlying</TabsTrigger>
                <TabsTrigger value="technicals" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Technicals</TabsTrigger>
                <TabsTrigger value="fundamentals" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Fundamentals</TabsTrigger>
                <TabsTrigger value="news" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">News</TabsTrigger>
              </TabsList>
              
              <TabsContent value="underlying" className="mt-4 space-y-6">
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
              
              <TabsContent value="technicals" className="mt-4 space-y-6">
                <div className="mb-6">
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
              
              <TabsContent value="fundamentals" className="mt-4 space-y-6">
                <CollapsibleSection title="Underlying Asset Fundamentals" icon={SearchIcon} defaultOpen>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div><span className="text-muted-foreground">Mkt Cap</span><p className="font-semibold text-foreground">{asset.fundamentals?.marketCap || 'N/A'}</p></div>
                    <div><span className="text-muted-foreground">ROE</span><p className="font-semibold text-foreground">{asset.fundamentals?.roe?.toFixed(2) || 'N/A'}%</p></div>
                    <div><span className="text-muted-foreground">P/E Ratio (TTM)</span><p className="font-semibold text-foreground">{asset.fundamentals?.peRatioTTM?.toFixed(2) || 'N/A'}</p></div>
                    <div><span className="text-muted-foreground">EPS (TTM)</span><p className="font-semibold text-foreground">{asset.fundamentals?.epsTTM?.toFixed(2) || 'N/A'}</p></div>
                    <div><span className="text-muted-foreground">P/B Ratio</span><p className="font-semibold text-foreground">{asset.fundamentals?.pbRatio?.toFixed(2) || 'N/A'}</p></div>
                    <div><span className="text-muted-foreground">Div Yield</span><p className="font-semibold text-foreground">{asset.fundamentals?.divYield?.toFixed(2) || 'N/A'}%</p></div>
                    <div><span className="text-muted-foreground">Industry P/E</span><p className="font-semibold text-foreground">{asset.fundamentals?.industryPe?.toFixed(2) || 'N/A'}</p></div>
                    <div><span className="text-muted-foreground">Book Value</span><p className="font-semibold text-foreground">{asset.fundamentals?.bookValue?.toFixed(2) || 'N/A'}</p></div>
                    <div><span className="text-muted-foreground">Debt to Equity</span><p className="font-semibold text-foreground">{asset.fundamentals?.debtToEquity?.toFixed(2) || 'N/A'}</p></div>
                    <div><span className="text-muted-foreground">Face Value</span><p className="font-semibold text-foreground">{asset.fundamentals?.faceValue?.toFixed(2) || 'N/A'}</p></div>
                    </div>
                </CollapsibleSection>

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
          <div className="w-full px-4 flex space-x-3">
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
  );
}
