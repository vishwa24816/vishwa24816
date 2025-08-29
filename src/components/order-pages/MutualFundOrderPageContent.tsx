
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Stock, NewsArticle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TrendingUp, ShoppingCart, Bookmark, Search, Info, CheckCircle2, XCircle, TrendingDown, Star, WalletCards, Briefcase, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MutualFundOrderForm } from '@/components/order/MutualFundOrderForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReturnCalculator } from '@/components/order/ReturnCalculator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { InitialOrderDetails } from '@/app/page';
import { SimbotInputBar } from '../simbot/SimbotInputBar';
import { CollapsibleSection } from './shared/OrderPageComponents';


interface MutualFundOrderPageContentProps {
  asset: Stock;
  assetSpecificNews: NewsArticle[];
  onBack: () => void;
  initialDetails: InitialOrderDetails | null;
}

export function MutualFundOrderPageContent({ asset, assetSpecificNews, onBack, initialDetails }: MutualFundOrderPageContentProps) {
  const { toast } = useToast();
  
  const [activeTimescale, setActiveTimescale] = useState('3Y');

  const isPositiveChange = asset.change >= 0;
  const timescaleButtons = ['1M', '6M', '1Y', '3Y', '5Y', 'ALL'];
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 py-3 sticky top-0 z-10 bg-background border-b border-border flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-foreground hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                <Search className="h-5 w-5" />
            </Button>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto pb-16">
        <div className="w-full px-4 py-4 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M10.63 3.09a2 2 0 0 1 3.74 0L17.5 7h-11Z"/><path d="M19.37 7a2 2 0 0 1 1.5 2.78l-4.13 10.11a2 2 0 0 1-3.48 0L9.13 9.78a2 2 0 0 1 1.5-2.78Z"/><path d="m5 8 2.5-2.5"/><path d="m19 8-2.5-2.5"/><path d="M12 12.5a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2Z"/></svg>
              </div>
              <div>
                 <h1 className="text-xl font-semibold">{asset.name}</h1>
                 {asset.riskLevel && asset.category && (
                    <p className="text-sm text-muted-foreground">{asset.riskLevel} Risk • {asset.category} • {asset.sector}</p>
                 )}
              </div>
          </div>
          
          <div className="flex items-baseline space-x-2">
            {asset.annualisedReturn && <p className="text-3xl font-bold text-green-500">{asset.annualisedReturn.toFixed(2)}%</p>}
            <p className="text-sm text-muted-foreground">3Y annualised</p>
          </div>
          <p className={`text-sm ${isPositiveChange ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            {isPositiveChange ? <TrendingUp className="h-4 w-4 mr-1" /> : null}
            {asset.changePercent.toFixed(2)}% 1D
          </p>


          <div className="h-48 bg-muted rounded-md flex items-center justify-center my-4 relative overflow-hidden" data-ai-hint="mutual fund chart graph">
            <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
              <path d="M0 130 C 50 100, 70 80, 100 90 S 150 120, 180 100, 250 40, 300 65" 
                    fill="none" 
                    stroke="hsl(var(--positive))"
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
                className={cn(
                  "rounded-full px-3 text-xs shrink-0",
                   activeTimescale === ts ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                {ts}
              </Button>
            ))}
          </div>

          <div className="py-4">
             <MutualFundOrderForm asset={asset} assetType="mutual-fund" initialDetails={initialDetails} />
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm py-4">
              <div>
                  <p className="text-muted-foreground">NAV: {asset.navDate || "N/A"}</p>
                  <p className="font-semibold text-foreground">₹{asset.price.toFixed(2)}</p>
              </div>
              <div>
                  <p className="text-muted-foreground">Rating</p>
                  <p className="font-semibold text-foreground">{asset.rating || "N/A"}</p>
              </div>
              <div>
                  <p className="text-muted-foreground">Min. SIP amount</p>
                  <p className="font-semibold text-foreground">₹{asset.minSipAmount?.toLocaleString() || "N/A"}</p>
              </div>
              <div>
                  <p className="text-muted-foreground">Fund Size</p>
                  <p className="font-semibold text-foreground">{asset.fundSize || "N/A"}</p>
              </div>
          </div>
          
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full bg-muted/30 flex overflow-x-auto whitespace-nowrap no-scrollbar rounded-none p-0 h-auto border-b mb-1">
                <TabsTrigger value="about" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">About Fund</TabsTrigger>
                <TabsTrigger value="calculator" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Calculator</TabsTrigger>
                <TabsTrigger value="rankings" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Rankings</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-4 space-y-6">
                 {asset.aboutCompany && (
                    <Card>
                         <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <Info className="h-5 w-5 mr-2 text-primary" />
                                About the Fund
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-foreground leading-relaxed">{asset.aboutCompany}</p>
                        </CardContent>
                    </Card>
                )}
                <CollapsibleSection title="Simbot Analysis" icon={Bot} defaultOpen>
                    <div className="flex items-start space-x-2 mr-auto justify-start max-w-[85%] sm:max-w-[75%]">
                         <Avatar className="h-8 w-8 self-start">
                            <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <div className="p-3 rounded-xl shadow bg-muted text-foreground rounded-bl-none">
                            <p className="text-sm whitespace-pre-wrap">
                                {asset.name} has consistently outperformed its benchmark over the last 3 years. It's a solid choice for long-term growth, but be mindful of its expense ratio.
                            </p>
                        </div>
                    </div>
                </CollapsibleSection>
                {asset.fundManagement && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                                Fund Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <Avatar className="h-16 w-16 border">
                                    <AvatarImage src={asset.fundManagement.managerAvatarUrl} alt={asset.fundManagement.managerName} data-ai-hint="manager profile" />
                                    <AvatarFallback>{asset.fundManagement.managerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-md">{asset.fundManagement.managerName}</h4>
                                    <p className="text-sm text-muted-foreground">Fund Manager, {asset.fundManagement.fundHouse}</p>
                                </div>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">
                                {asset.fundManagement.managerBio}
                            </p>
                        </CardContent>
                    </Card>
                )}
                {asset.topHoldings && asset.topHoldings.length > 0 && (
                    <Card>
                         <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <WalletCards className="h-5 w-5 mr-2 text-primary"/>
                                Top Holdings ({asset.holdingsCount || asset.topHoldings.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                        <ul className="divide-y">
                            {asset.topHoldings.map((holding, index) => (
                            <li key={index} className="flex justify-between items-center text-sm p-3">
                                <span className="font-medium text-foreground">{holding.name}</span>
                                <span className="text-muted-foreground">{holding.percentage.toFixed(2)}%</span>
                            </li>
                            ))}
                        </ul>
                        </CardContent>
                    </Card>
                )}
                 {(!asset.aboutCompany && !asset.fundManagement && !asset.topHoldings) && (
                    <div className="text-center text-muted-foreground py-4">Fund information is not available.</div>
                )}
            </TabsContent>
            <TabsContent value="calculator" className="mt-4">
              {asset.annualisedReturn ? (
                  <ReturnCalculator defaultReturnRate={asset.annualisedReturn} />
              ) : (
                  <div className="text-center text-muted-foreground py-4">Return rate not available for this fund.</div>
              )}
            </TabsContent>
            <TabsContent value="rankings" className="mt-4 space-y-6">
               {asset.marketTrends && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center"><TrendingUp className="h-5 w-5 mr-2 text-primary"/>Market Trends & Rating</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Short-term Trend</span>
                      <span className={cn("font-semibold", asset.marketTrends.shortTerm === 'Positive' ? 'text-green-600' : asset.marketTrends.shortTerm === 'Negative' ? 'text-red-600' : 'text-yellow-600')}>{asset.marketTrends.shortTerm}</span>
                    </div>
                     <div className="flex justify-between">
                      <span className="text-muted-foreground">Long-term Trend</span>
                      <span className={cn("font-semibold", asset.marketTrends.longTerm === 'Positive' ? 'text-green-600' : asset.marketTrends.longTerm === 'Negative' ? 'text-red-600' : 'text-yellow-600')}>{asset.marketTrends.longTerm}</span>
                    </div>
                    {asset.marketTrends.analystRating && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Analyst Rating</span>
                        <span className="font-semibold text-primary flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />{asset.marketTrends.analystRating}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
               )}
               {asset.pros && asset.pros.length > 0 && (
                <Card>
                   <CardHeader>
                    <CardTitle className="text-lg flex items-center text-green-600"><CheckCircle2 className="h-5 w-5 mr-2"/>Pros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-foreground">
                      {asset.pros.map((pro, index) => <li key={`pro-${index}`} className="flex items-start"><CheckCircle2 className="h-4 w-4 mr-2 mt-1 text-green-600 shrink-0"/><span>{pro}</span></li>)}
                    </ul>
                  </CardContent>
                </Card>
               )}
                {asset.cons && asset.cons.length > 0 && (
                <Card>
                   <CardHeader>
                    <CardTitle className="text-lg flex items-center text-red-600"><XCircle className="h-5 w-5 mr-2"/>Cons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-foreground">
                      {asset.cons.map((con, index) => <li key={`con-${index}`} className="flex items-start"><XCircle className="h-4 w-4 mr-2 mt-1 text-red-600 shrink-0"/><span>{con}</span></li>)}
                    </ul>
                  </CardContent>
                </Card>
               )}
              {(!asset.marketTrends && !asset.pros && !asset.cons) && (
                  <div className="text-center text-muted-foreground py-4">Ranking and analysis information is not available.</div>
              )}
            </TabsContent>
          </Tabs>

        </div>
      </main>
      <footer className="fixed bottom-16 left-0 right-0 bg-background border-t border-border p-2 shadow-md z-20">
         <SimbotInputBar onNavigateRequest={onBack as any} />
      </footer>
    </div>
  );
}
