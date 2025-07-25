
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal } from 'lucide-react';
import { LimitOrdersDisplay } from '@/components/orders/LimitOrdersDisplay';
import { BondBidsDisplay } from '@/components/orders/BondBidsDisplay';
import { BasketsDisplay } from '@/components/orders/BasketsDisplay';
import { SipsDisplay } from '@/components/orders/SipsDisplay';
import { AlertsDisplay } from '@/components/orders/AlertsDisplay';
import { useAuth } from '@/contexts/AuthContext';
import type { Stock } from '@/types';
import { HodlOrdersDisplay } from './HodlOrdersDisplay';
import { OpenPositionsDisplay } from './OpenPositionsDisplay';
import {
    mockPortfolioHoldings,
    mockIntradayPositions,
    mockFoPositions,
    mockCryptoFutures,
    mockWeb3Holdings,
    mockCryptoAssets,
    mockStocks,
    mockMutualFunds,
    mockBonds
} from '@/lib/mockData';

const demoOrderTabs = [
  { value: "limit", label: "Limit" },
  { value: "bids", label: "Bids" },
  { value: "hodl", label: "HODL" },
  { value: "baskets", label: "Baskets" },
  { value: "sips", label: "SIPs" },
  { value: "alerts", label: "Alerts" },
];

const realOrderTabs = [
  { value: "hodl", label: "HODL" },
  { value: "baskets", label: "Baskets" },
  { value: "sips", label: "SIPs" },
  { value: "alerts", label: "Alerts" },
];


export function OrdersPageContent({ activeMode, onAssetClick }: { activeMode: 'Portfolio' | 'Fiat' | 'Wealth' | 'Crypto' | 'Web3', onAssetClick: (asset: Stock) => void; }) {
  const { user } = useAuth();
  const isRealMode = user?.id === 'REAL456';

  const orderTabs = isRealMode ? realOrderTabs : demoOrderTabs;
  const [activeTab, setActiveTab] = useState(orderTabs[0].value);
  
  const fiatHoldings = mockPortfolioHoldings.filter(h => h.type === 'Stock' || h.type === 'ETF');
  const wealthHoldings = mockPortfolioHoldings.filter(h => h.type === 'Mutual Fund' || h.type === 'Bond');
  const cryptoHoldings = mockPortfolioHoldings.filter(h => h.type === 'Crypto');

  return (
      <div className="flex flex-col h-full">
        <main className="flex-grow flex flex-col">
          <Tabs defaultValue={orderTabs[0].value} value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow">
            <div className="bg-background border-b">
              <TabsList className="w-full px-4 sm:px-6 lg:px-8 flex overflow-x-auto whitespace-nowrap no-scrollbar rounded-none h-auto p-0 border-none bg-transparent">
                {orderTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none text-muted-foreground hover:text-primary transition-colors text-sm flex-shrink-0"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="border-b bg-background">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
                    <div className="flex items-center space-x-4">
                        <Search className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
                        <SlidersHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
                    </div>
                    <Button variant="link" className="text-primary text-sm font-medium flex items-center p-0 h-auto hover:no-underline">
                        <svg viewBox="0 0 8 8" width="8" height="8" className="mr-1.5 fill-primary">
                        <circle cx="4" cy="4" r="4"/>
                        </svg>
                        Tradebook
                    </Button>
                </div>
            </div>

            <div className="w-full px-0 sm:px-2 md:px-4 py-4 flex-grow flex flex-col">
              <TabsContent value="limit" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <LimitOrdersDisplay />
              </TabsContent>
              <TabsContent value="bids" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <BondBidsDisplay />
              </TabsContent>
              <TabsContent value="hodl" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <HodlOrdersDisplay />
              </TabsContent>
              <TabsContent value="baskets" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <BasketsDisplay />
              </TabsContent>
              <TabsContent value="sips" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <SipsDisplay />
              </TabsContent>
              <TabsContent value="alerts" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <AlertsDisplay />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
  );
}
