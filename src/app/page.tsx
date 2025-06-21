
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
import { FoBasketSection } from '@/components/dashboard/FoBasketSection';
import { CryptoFuturesSection } from '@/components/dashboard/CryptoFuturesSection';
import { OptionChain } from '@/components/dashboard/OptionChain';
import { ReadymadeStrategiesSection } from '@/components/dashboard/ReadymadeStrategiesSection';
import { StrategyBuilder } from '@/components/dashboard/StrategyBuilder';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import React, { useState, useEffect } from 'react';
import type { PortfolioHolding, NewsArticle, IntradayPosition, FoPosition, CryptoFuturePosition, Stock, MarketIndex } from '@/types';
import { 
  mockPortfolioHoldings, 
  mockNewsArticles, 
  mockIntradayPositions, 
  mockFoPositions, 
  mockCryptoFutures, 
  mockStocks, 
  mockCryptoAssets,
  mockMutualFunds,
  mockBonds,
  mockIndexFuturesForWatchlist,
  mockStockFuturesForWatchlist,
  mockMarketIndices, 
  mockCryptoFuturesForWatchlist,
  // mockFoBaskets, // Kept for data integrity, but component removed
} from '@/lib/mockData';

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
    if (h.type === 'Mutual Fund' || h.type === 'Bond') {
        const nameParts = h.name.split(' ');
        keywords.push(...nameParts.map(part => part.toLowerCase()));
    }
    return keywords;
  }).filter(Boolean).reduce((acc, keyword) => { 
    acc.add(keyword);
    return acc;
  }, new Set<string>());


  allNews.forEach(news => {
    const headlineLower = news.headline.toLowerCase();
    if (Array.from(holdingKeywords).some(keyword => keyword && headlineLower.includes(keyword))) {
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
    if (nameLower.includes("finnifty")) positionKeywords.add("finnifty");
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

function getRelevantNewsForWatchlistItems(items: Stock[] | MarketIndex[] | undefined, allNews: NewsArticle[]): NewsArticle[] {
  if (!items || !items.length || !allNews.length) {
    return [];
  }
  const relevantNews: NewsArticle[] = [];
  const itemKeywords = items.flatMap(item => {
    const keywords = [item.name.toLowerCase()];
    if ('symbol' in item && item.symbol) { 
      keywords.push(item.symbol.toLowerCase());
    }
    
    if ('exchange' in item && (item.exchange === 'Crypto' || item.exchange === 'MF' || item.exchange === 'BOND' || item.exchange === 'NFO' || item.exchange === 'Crypto Futures')) {
        const nameParts = item.name.split(/[\s-]+/); 
        keywords.push(...nameParts.map(part => part.toLowerCase()));
        if ('symbol' in item && item.symbol) { 
            const symbolParts = item.symbol.match(/[A-Z]+|[0-9.]+/g) || [];
            keywords.push(...symbolParts.map(part => part.toLowerCase()));
        }
    }
    return keywords;
  }).filter(Boolean).reduce((acc, keyword) => {
    acc.add(keyword);
    return acc;
  }, new Set<string>());


  allNews.forEach(news => {
    const headlineLower = news.headline.toLowerCase();
    if (Array.from(itemKeywords).some(keyword => keyword && headlineLower.includes(keyword))) {
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
    Options: ["Custom", "Strategy Builder", "Readymade"], 
    Crypto: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)], 
    "Mutual funds": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    Bonds: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    IPO: [], 
  };

  const [activePrimaryItem, setActivePrimaryItem] = useState("Portfolio");
  const [activeSecondaryItem, setActiveSecondaryItem] = useState(
    secondaryNavTriggerCategories["Portfolio"]?.[0] || ""
  );
  const [cryptoMarketView, setCryptoMarketView] = useState<'spot' | 'futures'>('spot');
  
  const [mainPortfolioCashBalance, setMainPortfolioCashBalance] = useState(50000.00);


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

  const isFuturesTopWatchlistView = activePrimaryItem === "Futures" && activeSecondaryItem.startsWith("Top watchlist");

  const isCategoryTopWatchlistView = 
    ["Stocks", "Mutual funds", "Bonds"].includes(activePrimaryItem) && 
    activeSecondaryItem.startsWith("Top watchlist");
  
  const isCryptoTopWatchlistView = activePrimaryItem === "Crypto" && activeSecondaryItem.startsWith("Top watchlist");


  const isCategoryNumberedWatchlistView = 
    ["Stocks", "Futures", "Crypto", "Mutual funds", "Bonds"].includes(activePrimaryItem) && 
    !!activeSecondaryItem.match(/^Watchlist \d+$/);


  let newsForView: NewsArticle[] = mockNewsArticles; 
  let itemsForCategoryWatchlist: Stock[] | undefined = undefined;
  let categoryWatchlistTitle: string = "";

  if (isPortfolioHoldingsView) {
    newsForView = getRelevantNewsForHoldings(mockPortfolioHoldings, mockNewsArticles);
  } else if (isPortfolioPositionsView) {
    newsForView = getRelevantNewsForPositions(mockIntradayPositions, mockFoPositions, mockCryptoFutures, mockNewsArticles);
  } else if (activePrimaryItem === "Options") { 
    newsForView = mockNewsArticles; 
  } else if (isUserPortfolioWatchlistView) {
    newsForView = getRelevantNewsForHoldings(mockPortfolioHoldings, mockNewsArticles); 
  } else if (isFuturesTopWatchlistView) {
    const combinedFutures = [...mockIndexFuturesForWatchlist, ...mockStockFuturesForWatchlist];
    newsForView = getRelevantNewsForWatchlistItems(combinedFutures, mockNewsArticles);
  } else if (isCategoryTopWatchlistView) { 
    categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
    if (activePrimaryItem === "Stocks") {
      itemsForCategoryWatchlist = mockStocks.map(s => ({...s, exchange: s.exchange || (Math.random() > 0.5 ? "NSE" : "BSE")}));
    } else if (activePrimaryItem === "Mutual funds") {
      itemsForCategoryWatchlist = mockMutualFunds;
    } else if (activePrimaryItem === "Bonds") {
      itemsForCategoryWatchlist = mockBonds;
    } else {
      itemsForCategoryWatchlist = []; 
    }
    newsForView = getRelevantNewsForWatchlistItems(itemsForCategoryWatchlist, mockNewsArticles);
  } else if (isCryptoTopWatchlistView) { 
    categoryWatchlistTitle = `${activePrimaryItem} ${cryptoMarketView === 'futures' ? 'Futures' : 'Spot'} - ${activeSecondaryItem}`;
    itemsForCategoryWatchlist = cryptoMarketView === 'spot' ? mockCryptoAssets : mockCryptoFuturesForWatchlist;
    newsForView = getRelevantNewsForWatchlistItems(itemsForCategoryWatchlist, mockNewsArticles);
  } else if (isCategoryNumberedWatchlistView) {
    categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
    newsForView = mockNewsArticles; 
  }


  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {activePrimaryItem === "Crypto" ? (
            <MarketOverview 
              title="Top Cryptocurrencies" 
              items={mockCryptoAssets.slice(0, 3)} 
            />
          ) : (
            <MarketOverview 
              title="Market Overview" 
              items={mockMarketIndices}
            />
          )}

          <SubNav
            activePrimaryItem={activePrimaryItem}
            activeSecondaryItem={activeSecondaryItem}
            onPrimaryNavClick={handlePrimaryNavClick}
            onSecondaryNavClick={handleSecondaryNavClick}
            secondaryNavTriggerCategories={secondaryNavTriggerCategories}
          />
          

          {isPortfolioHoldingsView ? (
            <>
              <PortfolioHoldingsTable 
                mainPortfolioCashBalance={mainPortfolioCashBalance} 
                setMainPortfolioCashBalance={setMainPortfolioCashBalance} 
              />
              <CryptoHoldingsSection 
                mainPortfolioCashBalance={mainPortfolioCashBalance}
                setMainPortfolioCashBalance={setMainPortfolioCashBalance}
              />
              <div className="mt-8">
                <NewsSection articles={newsForView} />
              </div>
            </>
          ) : isPortfolioPositionsView ? (
            <div className="space-y-8">
              <IntradayPositionsSection />
              <FoPositionsSection />
              <FoBasketSection />
              <CryptoFuturesSection />
              <NewsSection articles={newsForView} />
            </div>
          ) : isUserPortfolioWatchlistView ? (
            <div className="space-y-8">
              <WatchlistSection 
                title="My Portfolio Watchlist" 
                defaultInitialItems={mockStocks.slice(0, 5)}
              />
              <NewsSection articles={newsForView} />
            </div>
          ) : activePrimaryItem === "Options" ? (
              activeSecondaryItem === "Custom" ? (
                <div className="space-y-8">
                  <OptionChain />
                  <NewsSection articles={newsForView} />
                </div>
              ) : activeSecondaryItem === "Strategy Builder" ? (
                <div className="space-y-8">
                  <StrategyBuilder />
                  <NewsSection articles={newsForView} />
                </div>
              ) : activeSecondaryItem === "Readymade" ? (
                <div className="space-y-8">
                  <ReadymadeStrategiesSection />
                  <NewsSection articles={newsForView} />
                </div>
              ) : null
          ) : isFuturesTopWatchlistView ? (
            <div className="space-y-8">
              <WatchlistSection
                title="Index Futures - Top Watchlist"
                displayItems={mockIndexFuturesForWatchlist}
                isPredefinedList={true}
              />
              <WatchlistSection
                title="Stock Futures - Top Watchlist"
                displayItems={mockStockFuturesForWatchlist}
                isPredefinedList={true}
              />
              <NewsSection articles={newsForView} />
            </div>
          ): isCategoryTopWatchlistView ? ( 
            <div className="space-y-8">
              <WatchlistSection
                title={categoryWatchlistTitle}
                displayItems={itemsForCategoryWatchlist}
                isPredefinedList={true}
              />
              <NewsSection articles={newsForView} />
            </div>
          ) : isCryptoTopWatchlistView ? ( 
             <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-0 -mt-4">
                    <div className="flex space-x-2">
                        <Button
                        variant={cryptoMarketView === 'spot' ? 'secondary' : 'outline'}
                        onClick={() => setCryptoMarketView('spot')}
                        size="sm"
                        >
                        Spot
                        </Button>
                        <Button
                        variant={cryptoMarketView === 'futures' ? 'secondary' : 'outline'}
                        onClick={() => setCryptoMarketView('futures')}
                        size="sm"
                        >
                        Futures
                        </Button>
                    </div>
                </div>
              <WatchlistSection
                title={categoryWatchlistTitle}
                displayItems={itemsForCategoryWatchlist} 
                isPredefinedList={true}
              />
              <NewsSection articles={newsForView} />
            </div>
          ) : isCategoryNumberedWatchlistView ? (
            <div className="space-y-8">
              <WatchlistSection
                title={categoryWatchlistTitle}
                isPredefinedList={false} 
                localStorageKeyOverride={`simAppWatchlist_${activePrimaryItem.replace(/\s+/g, '_')}_${activeSecondaryItem.replace(/\s+/g, '_')}`}
                defaultInitialItems={[]} 
              />
              <NewsSection articles={newsForView} />
            </div>
          ) : activePrimaryItem === "IPO" ? (
             <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
                <PackageOpen className="h-16 w-16 mb-4" />
                <h2 className="text-2xl font-semibold mb-2 text-foreground">IPO Section</h2>
                <p className="max-w-md">
                    Information about upcoming and recent Initial Public Offerings will be displayed here.
                </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
              <PackageOpen className="h-16 w-16 mb-4" />
              <h2 className="text-2xl font-semibold mb-2 text-foreground">No specific view selected</h2>
              <p className="max-w-md">
                Select an item from the navigation above to see details.
                Content for the selected view might not be available yet.
              </p>
            </div>
          )}
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          © {new Date().getFullYear()} SIM - Stock Information &amp; Management. All rights reserved.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
