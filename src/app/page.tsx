"use client";

import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { StockTicker } from '@/components/dashboard/StockTicker';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { WatchlistSection } from '@/components/dashboard/WatchlistSection';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <StockTicker />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          <MarketOverview />
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <NewsSection />
            <WatchlistSection />
          </div>
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          © {new Date().getFullYear()} SIM - Stock Information & Management. All rights reserved.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
