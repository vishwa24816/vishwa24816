
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal } from 'lucide-react';
import { GttOrdersDisplay } from '@/components/orders/GttOrdersDisplay';
import { BondBidsDisplay } from '@/components/orders/BondBidsDisplay';
import { BasketsDisplay } from '@/components/orders/BasketsDisplay';
import { SipsDisplay } from '@/components/orders/SipsDisplay';
import { AlertsDisplay } from '@/components/orders/AlertsDisplay';
import { useAuth } from '@/contexts/AuthContext';
import type { Stock, PortfolioHolding, IntradayPosition, FoPosition, CryptoFuturePosition } from '@/types';
import { mockPortfolioHoldings, mockIntradayPositions, mockFoPositions, mockCryptoFutures, mockWeb3Holdings } from '@/lib/mockData';
import { FiatHoldingsSection, IntradayPositionsSection, FoPositionsSection, CryptoHoldingsSection, CryptoFuturesSection, WealthHoldingsSection } from '@/components/dashboard';
import { ScrollArea } from '../ui/scroll-area';

const demoOrderTabs = [
  { value: "executed", label: "Open" }, 
  { value: "gtt", label: "GTT" },
  { value: "bids", label: "Bids" },
  { value: "baskets", label: "Baskets" },
  { value: "sips", label: "SIPs" },
  { value: "alerts", label: "Alerts" },
];

const realOrderTabs = [
  { value: "executed", label: "Open" },
  { value: "baskets", label: "Baskets" },
  { value: "sips", label: "SIPs" },
  { value: "alerts", label: "Alerts" },
];


export function OrdersPageContent({ onAssetClick, activeMode }: { onAssetClick: (asset: Stock) => void, activeMode: 'Portfolio' | 'Fiat' | 'Wealth' | 'Crypto' | 'Web3' }) {
  const { user } = useAuth();
  const isRealMode = user?.id === 'REAL456';

  const orderTabs = isRealMode ? realOrderTabs : demoOrderTabs;
  const [activeTab, setActiveTab] = useState("executed");
  
  const fiatHoldings = mockPortfolioHoldings.filter(h => h.type === 'Stock' || h.type === 'ETF');
  const wealthHoldings = mockPortfolioHoldings.filter(h => h.type === 'Mutual Fund' || h.type === 'Bond');
  const cryptoHoldings = mockPortfolioHoldings.filter(h => h.type === 'Crypto');

    // Dummy state setters for components that require them but won't be used here.
    const dummySetState = () => {};

  const renderOpenPositions = () => {
    switch(activeMode) {
        case 'Fiat':
            return (
                <ScrollArea className="h-full">
                    <div className="space-y-4 p-1">
                        <FiatHoldingsSection holdings={fiatHoldings} intradayPositions={mockIntradayPositions} foPositions={mockFoPositions} mainPortfolioCashBalance={0} setMainPortfolioCashBalance={dummySetState} cryptoCashBalance={0} setCryptoCashBalance={dummySetState} onAssetClick={onAssetClick} onAddFunds={dummySetState} />
                        <IntradayPositionsSection onAssetClick={onAssetClick}/>
                        <FoPositionsSection onAssetClick={onAssetClick} />
                    </div>
                </ScrollArea>
            );
        case 'Wealth':
            return (
                 <ScrollArea className="h-full">
                    <div className="space-y-4 p-1">
                        <WealthHoldingsSection holdings={wealthHoldings} onAssetClick={onAssetClick} />
                    </div>
                </ScrollArea>
            );
        case 'Crypto':
            return (
                 <ScrollArea className="h-full">
                    <div className="space-y-4 p-1">
                       <CryptoHoldingsSection title="Crypto Wallet & Holdings" holdings={cryptoHoldings} cashBalance={0} setCashBalance={dummySetState} mainPortfolioCashBalance={0} setMainPortfolioCashBalance={dummySetState} isRealMode={false} walletMode={'hot'} setWalletMode={dummySetState} onAssetClick={onAssetClick} />
                       <CryptoFuturesSection positions={mockCryptoFutures} cashBalance={0} />
                    </div>
                </ScrollArea>
            );
        case 'Web3':
             return (
                 <ScrollArea className="h-full">
                    <div className="space-y-4 p-1">
                        <CryptoHoldingsSection title="Web3 Wallet & Holdings" holdings={mockWeb3Holdings} cashBalance={0} setCashBalance={dummySetState} mainPortfolioCashBalance={0} setMainPortfolioCashBalance={dummySetState} isRealMode={false} walletMode={'hot'} setWalletMode={dummySetState} onAssetClick={onAssetClick} />
                    </div>
                </ScrollArea>
            );
        default:
            return <p className="text-center text-muted-foreground p-4">Select a mode to see open positions.</p>
    }
  }


  return (
      <div className="flex flex-col h-full">
        <main className="flex-grow flex flex-col">
          <Tabs defaultValue="executed" value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow">
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
              <TabsContent value="executed" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                {renderOpenPositions()}
              </TabsContent>
              <TabsContent value="gtt" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <GttOrdersDisplay activeMode={activeMode} />
              </TabsContent>
              <TabsContent value="bids" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <BondBidsDisplay activeMode={activeMode} />
              </TabsContent>
              <TabsContent value="baskets" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <BasketsDisplay isRealMode={isRealMode} activeMode={activeMode} />
              </TabsContent>
              <TabsContent value="sips" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <SipsDisplay isRealMode={isRealMode} activeMode={activeMode} />
              </TabsContent>
              <TabsContent value="alerts" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <AlertsDisplay isRealMode={isRealMode} activeMode={activeMode} />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
  );
}
