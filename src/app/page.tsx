
"use client";

import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { SubNav } from '@/components/dashboard/SubNav';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { WatchlistSection } from '@/components/dashboard/WatchlistSection';
import { PortfolioHoldingsTable } from '@/components/dashboard/PortfolioHoldingsTable';
import { CryptoHoldingsSection } from '@/components/dashboard/CryptoHoldingsSection';
import { IntradayPositionsSection } from '@/components/dashboard/IntradayPositionsSection';
import { FoPositionsSection } from '@/components/dashboard/FoPositionsSection';
import { CryptoFuturesSection } from '@/components/dashboard/CryptoFuturesSection';

import React, { useState } from 'react';
import type { PortfolioHolding, NewsArticle, IntradayPosition, FoPosition, CryptoFuturePosition } from '@/types';
import { mockPortfolioHoldings, mockNewsArticles, mockIntradayPositions, mockFoPositions, mockCryptoFutures } from '@/lib/mockData';

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

function getRelevantNewsForPositions(
  intraday: IntradayPosition[],
  fo: FoPosition[],
  cryptoFutures: CryptoFuturePosition[],
  allNews: NewsArticle[]
): NewsArticle[] {
  if ((!intraday.length && !fo.length && !cryptoFutures.length) || !allNews.length) {
    return [];
  }

  const positionKeywords = new Set<string>();

  intraday.forEach(p => {
    positionKeywords.add(p.name.toLowerCase());
    if (p.symbol) positionKeywords.add(p.symbol.toLowerCase());
  });

  fo.forEach(p => {
    const nameLower = p.instrumentName.toLowerCase();
    if (nameLower.includes("nifty")) positionKeywords.add("nifty");
    if (nameLower.includes("banknifty")) positionKeywords.add("banknifty");
    if (nameLower.includes("reliance")) positionKeywords.add("reliance");
    const parts = p.instrumentName.split(" ");
    if (parts.length > 0) positionKeywords.add(parts[0].toLowerCase());

  });

  cryptoFutures.forEach(p => {
    if (p.symbol.includes("USDT")) {
      positionKeywords.add(p.symbol.replace("USDT", "").toLowerCase());
    } else {
      positionKeywords.add(p.symbol.toLowerCase());
    }
  });

  const relevantNews: NewsArticle[] = [];
  allNews.forEach(news => {
    const headlineLower = news.headline.toLowerCase();
    if (Array.from(positionKeywords).some(keyword => keyword && headlineLower.includes(keyword))) {
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
  
  const [activePrimaryItem, setActivePrimaryItem] = useState("Portfolio");
  const [activeSecondaryItem, setActiveSecondaryItem] = useState(
    secondaryNavTriggerCategories["Portfolio"]?.[0] || "" 
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

  let newsToDisplay: NewsArticle[] = mockNewsArticles; 
  if (activePrimaryItem === "Portfolio" && activeSecondaryItem === "Holdings") {
    newsToDisplay = getRelevantNewsForHoldings(mockPortfolioHoldings, mockNewsArticles);
  } else if (activePrimaryItem === "Portfolio" && activeSecondaryItem === "Positions") {
    newsToDisplay = getRelevantNewsForPositions(mockIntradayPositions, mockFoPositions, mockCryptoFutures, mockNewsArticles);
  }

  const showGenericView = !(activePrimaryItem === "Portfolio" && (activeSecondaryItem === "Holdings" || activeSecondaryItem === "Positions"));

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
          ) : activePrimaryItem === "Portfolio" && activeSecondaryItem === "Positions" ? (
            <div className="space-y-8">
              <IntradayPositionsSection />
              <FoPositionsSection />
              <CryptoFuturesSection />
              <NewsSection articles={newsToDisplay} />
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <WatchlistSection />
                <NewsSection /> {/* Uses default mockNewsArticles */}
              </div>
            </>
          )}
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          © {new Date().getFullYear()} SIM - Stock Information & Management. All rights reserved.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
