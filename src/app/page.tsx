
"use client";

import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { SubNav } from '@/components/dashboard/SubNav';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { WatchlistSection } from '@/components/dashboard/WatchlistSection';
import { PortfolioHoldingsTable } from '@/components/dashboard/PortfolioHoldingsTable';
import { CryptoHoldingsSection } from '@/components/dashboard/CryptoHoldingsSection';
import React, { useState } from 'react';
import type { PortfolioHolding, NewsArticle } from '@/types';
import { mockPortfolioHoldings, mockNewsArticles } from '@/lib/mockData';

function getRelevantNewsForHoldings(holdings: PortfolioHolding[], allNews: NewsArticle[]): NewsArticle[] {
  if (!holdings.length || !allNews.length) {
    return [];
  }
  const relevantNews: NewsArticle[] = [];
  const holdingKeywords = holdings.flatMap(h => {
    const keywords = [h.name.toLowerCase()];
    if (h.symbol) {
      keywords.push(h.symbol.toLowerCase());
    }
    return keywords;
  }).filter(Boolean);

  allNews.forEach(news => {
    const headlineLower = news.headline.toLowerCase();
    if (holdingKeywords.some(keyword => keyword && headlineLower.includes(keyword))) {
      relevantNews.push(news);
    }
  });
  return relevantNews;
}

export default function DashboardPage() {
  const secondaryNavTriggerCategories: Record<string, string[]> = {
    Portfolio: ["Holdings", "Positions", "Portfolio Watchlist"],
    Stocks: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    Futures: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    Crypto: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    "Mutual funds": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
  };
  
  const [activePrimaryItem, setActivePrimaryItem] = useState("Stocks");
  const [activeSecondaryItem, setActiveSecondaryItem] = useState(
    secondaryNavTriggerCategories["Stocks"]?.[0] || "" 
  );
  
  const handlePrimaryNavClick = (item: string) => {
    setActivePrimaryItem(item);
    const newSecondaryItems = secondaryNavTriggerCategories[item] || [];
    if (newSecondaryItems.length > 0) {
      setActiveSecondaryItem(newSecondaryItems[0]); 
    } else {
      setActiveSecondaryItem(""); 
    }
  };

  const handleSecondaryNavClick = (item: string) => {
    setActiveSecondaryItem(item);
  };

  let newsToDisplay: NewsArticle[] = mockNewsArticles; // Default for non-portfolio views
  if (activePrimaryItem === "Portfolio" && activeSecondaryItem === "Holdings") {
    newsToDisplay = getRelevantNewsForHoldings(mockPortfolioHoldings, mockNewsArticles);
  }


  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          <MarketOverview />
          <SubNav 
            activePrimaryItem={activePrimaryItem}
            activeSecondaryItem={activeSecondaryItem}
            onPrimaryNavClick={handlePrimaryNavClick}
            onSecondaryNavClick={handleSecondaryNavClick}
            secondaryNavTriggerCategories={secondaryNavTriggerCategories}
          />
          
          {activePrimaryItem === "Portfolio" && activeSecondaryItem === "Holdings" ? (
            <>
              <PortfolioHoldingsTable />
              <CryptoHoldingsSection />
              <div className="mt-8">
                <NewsSection articles={newsToDisplay} />
              </div>
            </>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <NewsSection /> {/* Uses default mockNewsArticles */}
              <WatchlistSection />
            </div>
          )}
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          © {new Date().getFullYear()} SIM - Stock Information & Management. All rights reserved.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
