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
import { BasketsDisplay } from '@/components/orders/BasketsDisplay';
import { SipsDisplay } from '@/components/orders/SipsDisplay';
import { AlertsDisplay } from '@/components/orders/AlertsDisplay';
import { useAuth } from '@/contexts/AuthContext';

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


export default function OrdersPage() {
  const { user } = useAuth();
  const isRealMode = user?.id === 'REAL456';
  const [searchMode, setSearchMode] = useState<'Fiat' | 'Exchange' | 'Web3'>(isRealMode ? 'Exchange' : 'Fiat');


  const orderTabs = isRealMode ? realOrderTabs : demoOrderTabs;
  const [activeTab, setActiveTab] = useState("executed");


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
        <AppHeader
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
          isRealMode={isRealMode}
        />
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
                <OpenPositionsDisplay isRealMode={isRealMode} />
              </TabsContent>
              <TabsContent value="gtt" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <GttOrdersDisplay />
              </TabsContent>
              <TabsContent value="bids" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <BondBidsDisplay />
              </TabsContent>
              <TabsContent value="baskets" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <BasketsDisplay isRealMode={isRealMode} />
              </TabsContent>
              <TabsContent value="sips" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <SipsDisplay isRealMode={isRealMode} />
              </TabsContent>
              <TabsContent value="alerts" className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                <AlertsDisplay />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}
