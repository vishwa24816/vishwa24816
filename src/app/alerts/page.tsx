
"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AlertItem = ({ text }: { text: string }) => (
     <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
        <p className="text-sm">{text}</p>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
);


export default function AlertsPage() {
    const { user } = useAuth();
    const isRealMode = user?.id === 'REAL456';
    const [activeMode, setActiveMode] = useState<'Fiat' | 'Crypto'>(isRealMode ? 'Crypto' : 'Fiat');

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <AppHeader 
            isRealMode={isRealMode} 
            activeMode={activeMode} 
            onModeChange={setActiveMode} 
        />
        <main className="flex-grow flex flex-col">
            <Tabs defaultValue="alpha" className="w-full flex flex-col">
                 <div className="border-b bg-background sticky top-0 z-10">
                    <TabsList className="w-full justify-start rounded-none bg-transparent p-0 px-4 overflow-x-auto no-scrollbar h-auto">
                        <TabsTrigger value="alpha" className="py-3 px-4 rounded-none flex-shrink-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">Alpha Alerts</TabsTrigger>
                        <TabsTrigger value="superstar" className="py-3 px-4 rounded-none flex-shrink-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">Superstar & Deals</TabsTrigger>
                        <TabsTrigger value="price" className="py-3 px-4 rounded-none flex-shrink-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">Price Target</TabsTrigger>
                        <TabsTrigger value="email" className="py-3 px-4 rounded-none flex-shrink-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">Email</TabsTrigger>
                    </TabsList>
                </div>
                <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <TabsContent value="alpha" className="mt-4">
                        <div className="space-y-3">
                            <AlertItem text="52 Week High/Low Breakouts" />
                            <AlertItem text="Unusual Volume Spikes" />
                            <AlertItem text="Block/Bulk Deal Notifications" />
                        </div>
                    </TabsContent>
                    <TabsContent value="superstar" className="mt-4">
                        <div className="space-y-3">
                            <AlertItem text="Superstar Investor Portfolio Changes" />
                            <AlertItem text="Insider Trading Activity" />
                        </div>
                    </TabsContent>
                    <TabsContent value="price" className="mt-4">
                        <div className="space-y-3">
                            <AlertItem text="RELIANCE hits ₹3000" />
                            <AlertItem text="BTC crosses ₹60,00,000" />
                        </div>
                    </TabsContent>
                    <TabsContent value="email" className="mt-4">
                        <div className="space-y-3">
                            <AlertItem text="Daily Market Summary" />
                            <AlertItem text="Weekly Portfolio Recap" />
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
            
        </main>
      </div>
    </ProtectedRoute>
  );
}
