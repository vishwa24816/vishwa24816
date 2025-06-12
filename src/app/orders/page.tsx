
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal } from 'lucide-react';

const orderTabs = [
  { value: "open", label: "Open" },
  { value: "executed", label: "Executed" },
  { value: "gtt", label: "GTT" },
  { value: "baskets", label: "Baskets" },
  { value: "sips", label: "SIPs" },
  { value: "alerts", label: "Alerts" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("open");

  const NoOrdersContent = () => (
    <div className="flex flex-col items-center justify-center text-center py-16 flex-grow">
      <Image
        src="https://placehold.co/200x150.png"
        alt="No orders"
        width={200}
        height={150}
        data-ai-hint="documents order papers"
        className="mb-8 opacity-75"
      />
      <h2 className="text-xl font-semibold text-foreground mb-2">
        No pending orders
      </h2>
      <p className="text-muted-foreground">
        Place an order from your watchlist
      </p>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto px-0 sm:px-4 md:px-6 lg:px-8 py-4 flex flex-col">
          <Tabs defaultValue="open" value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 rounded-none bg-background border-b h-auto p-0">
              {orderTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex items-center justify-between py-3 px-4 border-b">
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

            {orderTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="flex-grow flex flex-col mt-0 data-[state=inactive]:hidden">
                {/* For now, all tabs show the same content. Replace with specific content later. */}
                <NoOrdersContent />
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}
