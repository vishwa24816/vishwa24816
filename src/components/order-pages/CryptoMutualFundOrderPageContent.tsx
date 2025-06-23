
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Stock, NewsArticle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TrendingUp, ShoppingCart, Bookmark, Search, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MutualFundOrderForm } from '@/components/order/MutualFundOrderForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReturnCalculator } from '@/components/order/ReturnCalculator';

interface CryptoMutualFundOrderPageContentProps {
  asset: Stock;
  assetSpecificNews: NewsArticle[];
}

export function CryptoMutualFundOrderPageContent({ asset, assetSpecificNews }: CryptoMutualFundOrderPageContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [activeTimescale, setActiveTimescale] = useState('3Y');

  const isPositiveChange = asset.change >= 0;
  const timescaleButtons = ['1M', '6M', '1Y', '3Y', '5Y', 'ALL'];
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 py-3 sticky top-0 z-10 bg-background border-b border-border flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-foreground hover:bg-muted">
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

      <main className="flex-grow overflow-y-auto pb-8">
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
             <MutualFundOrderForm asset={asset} assetType="mutual-fund" />
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
                <TabsTrigger value="holdings" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Holdings</TabsTrigger>
                <TabsTrigger value="rankings" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Rankings</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-4 space-y-4">
                {asset.aboutCompany ? (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <Info className="h-5 w-5 mr-2 text-primary" />
                            About the Fund
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">{asset.aboutCompany}</p>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-4">No fund description available.</div>
                )}
            </TabsContent>
            <TabsContent value="calculator" className="mt-4">
              <ReturnCalculator />
            </TabsContent>
            <TabsContent value="holdings" className="mt-4">
              <div className="text-center text-muted-foreground py-4">Holdings details for {asset.name} ({asset.holdingsCount || 0} holdings) will be displayed here.</div>
            </TabsContent>
            <TabsContent value="rankings" className="mt-4">
               <div className="text-center text-muted-foreground py-4">Returns & Rankings details component coming soon.</div>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
}
