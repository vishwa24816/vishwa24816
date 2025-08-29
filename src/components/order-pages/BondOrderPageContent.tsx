
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Stock, NewsArticle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TrendingUp, TrendingDown, Info, ShieldCheck, Bot } from 'lucide-react';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { BondOrderForm } from '@/components/order/BondOrderForm';
import { CollapsibleSection } from './shared/OrderPageComponents';
import { SimbotInputBar } from '../simbot/SimbotInputBar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


interface BondOrderPageContentProps {
  asset: Stock;
  assetSpecificNews: NewsArticle[];
  onBack: () => void;
}

export function BondOrderPageContent({ asset, assetSpecificNews, onBack }: BondOrderPageContentProps) {
  const { toast } = useToast();
  
  const [activeTimescale, setActiveTimescale] = useState('1Y');

  const isPositiveChange = asset.change >= 0;
  const timescaleButtons = ['1M', '6M', '1Y', '3Y', '5Y', 'ALL'];
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 py-3 sticky top-0 z-10 bg-background border-b border-border flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-foreground hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-grow overflow-y-auto pb-16">
        <div className="w-full px-4 py-4 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <div>
                 <h1 className="text-xl font-semibold">{asset.name}</h1>
                 {asset.sector && (
                    <p className="text-sm text-muted-foreground">{asset.sector}</p>
                 )}
              </div>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold">₹{asset.price.toFixed(2)}</p>
          </div>
          <p className={`text-sm ${isPositiveChange ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            {isPositiveChange ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%) 1D
          </p>

          <div className="h-48 bg-muted rounded-md flex items-center justify-center my-4 relative overflow-hidden" data-ai-hint="bond price chart graph">
            <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
              <path d="M0 80 C 50 75, 70 85, 100 82 S 150 70, 180 75, 250 60, 300 65" 
                    fill="none" 
                    stroke="hsl(var(--primary))"
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
             <BondOrderForm asset={asset} />
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full bg-muted/30 flex overflow-x-auto whitespace-nowrap no-scrollbar rounded-none p-0 h-auto border-b mb-1">
              <TabsTrigger value="details" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">Details</TabsTrigger>
              <TabsTrigger value="news" className="flex-shrink-0 px-4 py-3 text-sm rounded-t-md rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=active]:shadow-none hover:text-primary">News</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 space-y-6">
                <CollapsibleSection title="Bond Details" icon={Info} defaultOpen>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm py-2">
                    <div><p className="text-muted-foreground">Coupon Rate</p><p className="font-semibold text-foreground">7.26% p.a.</p></div>
                    <div><p className="text-muted-foreground">Maturity Date</p><p className="font-semibold text-foreground">14 Aug 2033</p></div>
                    <div><p className="text-muted-foreground">Face Value</p><p className="font-semibold text-foreground">₹100</p></div>
                    <div><p className="text-muted-foreground">Yield to Maturity (YTM)</p><p className="font-semibold text-foreground">7.15%</p></div>
                  </div>
                </CollapsibleSection>
                 <CollapsibleSection title="Simbot Analysis" icon={Bot} defaultOpen>
                    <div className="flex items-start space-x-2 mr-auto justify-start max-w-[85%] sm:max-w-[75%]">
                         <Avatar className="h-8 w-8 self-start">
                            <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <div className="p-3 rounded-xl shadow bg-muted text-foreground rounded-bl-none">
                            <p className="text-sm whitespace-pre-wrap">
                                This government bond offers a stable yield. It's a low-risk option suitable for capital preservation. The current yield is slightly lower than comparable new issues.
                            </p>
                        </div>
                    </div>
                </CollapsibleSection>
            </TabsContent>
            <TabsContent value="news" className="mt-4">
              <NewsSection articles={assetSpecificNews} title={`News related to ${asset.name}`} />
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
