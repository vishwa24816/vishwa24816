
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
import { PackageOpen } from 'lucide-react';


import React, { useState } from 'react';
import type { PortfolioHolding, NewsArticle, IntradayPosition, FoPosition, CryptoFuturePosition, Stock } from '@/types';
import { mockPortfolioHoldings, mockNewsArticles, mockIntradayPositions, mockFoPositions, mockCryptoFutures, mockStocks } from '@/lib/mockData';

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

function getRelevantNewsForWatchlistItems(items: Stock[], allNews: NewsArticle[]): NewsArticle[] {
  if (!items.length || !allNews.length) {
    return [];
  }
  const relevantNews: NewsArticle[] = [];
  const itemKeywords = items.flatMap(item => {
    const keywords = [item.name.toLowerCase()];
    if (item.symbol) {
      keywords.push(item.symbol.toLowerCase());
    }
    return keywords;
  }).filter(Boolean);

  allNews.forEach(news => {
    const headlineLower = news.headline.toLowerCase();
    if (itemKeywords.some(keyword => keyword && headlineLower.includes(keyword))) {
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
    Options: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    Crypto: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    "Mutual funds": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    Bonds: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
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
  
  const isPortfolioHoldingsView = activePrimaryItem === "Portfolio" && activeSecondaryItem === "Holdings";
  const isPortfolioPositionsView = activePrimaryItem === "Portfolio" && activeSecondaryItem === "Positions";
  const isUserPortfolioWatchlistView = activePrimaryItem === "Portfolio" && activeSecondaryItem === "Portfolio Watchlist";
  const isCategoryPredefinedWatchlistView =
    ["Stocks", "Futures", "Options", "Crypto", "Mutual funds", "Bonds"].includes(activePrimaryItem) &&
    (activeSecondaryItem.startsWith("Top watchlist") || !!activeSecondaryItem.match(/^Watchlist \d+$/));

  let newsForView: NewsArticle[] = mockNewsArticles;
  let itemsForCategoryWatchlist: Stock[] | undefined = undefined;
  let categoryWatchlistTitle: string = "";

  if (isPortfolioHoldingsView) {
    newsForView = getRelevantNewsForHoldings(mockPortfolioHoldings, mockNewsArticles);
  } else if (isPortfolioPositionsView) {
    newsForView = getRelevantNewsForPositions(mockIntradayPositions, mockFoPositions, mockCryptoFutures, mockNewsArticles);
  } else if (isCategoryPredefinedWatchlistView) {
    categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
    if (activePrimaryItem === "Stocks") {
      itemsForCategoryWatchlist = mockStocks.map(s => ({...s, exchange: s.exchange || (Math.random() > 0.5 ? "NSE" : "BSE")}));
    } else {
      // Placeholder for other categories like Futures, Crypto, MF, Bonds
      // For now, they will show an empty list. Mock data can be added later.
      itemsForCategoryWatchlist = [];
    }
    newsForView = getRelevantNewsForWatchlistItems(itemsForCategoryWatchlist || [], mockNewsArticles);
  } else if (isUserPortfolioWatchlistView) {
    // For user's own editable watchlist, news is general for now
    // newsForView = getRelevantNewsForWatchlistItems(localStorageWatchlistItems, mockNewsArticles); // More complex
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
          
          {isPortfolioHoldingsView ? (
            <>
              <PortfolioHoldingsTable />
              <CryptoHoldingsSection />
              <div className="mt-8">
                <NewsSection articles={newsForView} />
              </div>
            </>
          ) : isPortfolioPositionsView ? (
            <div className="space-y-8">
              <IntradayPositionsSection />
              <FoPositionsSection />
              <CryptoFuturesSection />
              <NewsSection articles={newsForView} />
            </div>
          ) : isUserPortfolioWatchlistView ? (
            <div className="space-y-8">
              <WatchlistSection title="My Portfolio Watchlist" /> {/* Uses localStorage */}
              <NewsSection articles={newsForView} /> {/* General news */}
            </div>
          ) : isCategoryPredefinedWatchlistView ? (
            <div className="space-y-8">
              <WatchlistSection 
                title={categoryWatchlistTitle}
                displayItems={itemsForCategoryWatchlist} 
                isPredefinedList={true} 
              />
              <NewsSection articles={newsForView} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
              <PackageOpen className="h-16 w-16 mb-4" />
              <h2 className="text-2xl font-semibold mb-2 text-foreground">No specific view selected</h2>
              <p className="max-w-md">
                Select an item from the navigation above to see details. 
                For categories like "Options", "IPO", or unconfigured watchlists, content might not be available yet.
              </p>
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
