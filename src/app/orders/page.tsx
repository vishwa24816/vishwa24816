
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal } from 'lucide-react';
import { OpenPositionsDisplay } from '@/components/orders/OpenPositionsDisplay';
import { GttOrdersDisplay } from '@/components/orders/GttOrdersDisplay';
import { BondBidsDisplay } from '@/components/orders/BondBidsDisplay';
import { BasketsDisplay } from '@/components/orders/BasketsDisplay'; // Re-added import
import { SipsDisplay } from '@/components/orders/SipsDisplay';
import { AlertsDisplay } from '@/components/orders/AlertsDisplay';
import { mockGttOrders, mockBondBids, mockSips, mockPriceAlerts, mockFoBaskets } from '@/lib/mockData'; 
import { mockPortfolioHoldings, mockIntradayPositions, mockFoPositions, mockCryptoFutures } from '@/lib/mockData'; // For Open tab

const orderTabs = [
  { value: "executed", label: "Open" }, 
  { value: "gtt", label: "GTT" },
  { value: "bids", label: "Bids" },
  { value: "baskets", label: "Baskets" }, // Re-added Baskets tab
  { value: "sips", label: "SIPs" },
  { value: "alerts", label: "Alerts" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("executed");

  const hasOpenPositions =
    mockPortfolioHoldings.some(h => h.type === 'Stock' || h.type === 'ETF' || h.type === 'Crypto') ||
    mockIntradayPositions.length > 0 ||
    mockFoPositions.length > 0 ||
    mockCryptoFutures.length > 0;

  const NoDataContent = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center text-center py-16 flex-grow">
      <Image
        src="https://placehold.co/200x150.png"
        alt="No data illustration"
        width={200}
        height={150}
        data-ai-hint="documents order papers"
        className="mb-8 opacity-75"
      />
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Nothing Here Yet
      </h2>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow flex flex-col">
          <Tabs defaultValue="executed" value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow">
            <div className="bg-background border-b">
              <TabsList className="container mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto whitespace-nowrap no-scrollbar rounded-none h-auto p-0 border-none bg-transparent">
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
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
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

            <div className="container mx-auto px-0 sm:px-2 md:px-4 py-4 flex-grow flex flex-col">
              <TabsContent value="executed" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                {hasOpenPositions ? <OpenPositionsDisplay /> : <NoDataContent message="No open positions or holdings found." />}
              </TabsContent>
              <TabsContent value="gtt" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                {mockGttOrders.length > 0 ? <GttOrdersDisplay /> : <NoDataContent message="No GTT orders found. You can place GTT orders from stock/future detail pages." />}
              </TabsContent>
              <TabsContent value="bids" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                {mockBondBids.length > 0 ? <BondBidsDisplay /> : <NoDataContent message="No bond bids found. Explore bonds and place bids." />}
              </TabsContent>
              <TabsContent value="baskets" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                {mockFoBaskets.length > 0 ? <BasketsDisplay /> : <NoDataContent message="No basket orders found. Create baskets for F&O or other asset types." />}
              </TabsContent>
              <TabsContent value="sips" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                {mockSips.length > 0 ? <SipsDisplay /> : <NoDataContent message="No active or paused SIPs found. Start an SIP in stocks or mutual funds." />}
              </TabsContent>
              <TabsContent value="alerts" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                {mockPriceAlerts.length > 0 ? <AlertsDisplay /> : <NoDataContent message="No price alerts set. Create alerts for your favorite instruments." />}
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}
