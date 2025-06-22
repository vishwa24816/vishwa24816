
"use client";

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

import React, { useState } from 'react';
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
  mockCryptoMutualFunds,
  mockCryptoETFs,
} from '@/lib/mockData';

// Helper functions
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
    if (p.symbol.includes("USDT") || p.symbol.includes("INR")) { // Handle both USDT and INR pairs
        positionKeywords.add(p.symbol.replace(/USDT|INR/g, "").toLowerCase());
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

export function DemoDashboard() {
  const primaryNavItems = [
    "Portfolio", "Crypto Spot", "Crypto Futures", "Crypto Mutual Fund", "Stocks", "Index Futures", "Stock Futures", "Options", "Stocks Mutual fund", "Bonds", "IPO"
  ];

  const secondaryNavTriggerCategories: Record<string, string[]> = {
    Portfolio: ["Holdings", "Positions", "Portfolio Watchlist"],
    Stocks: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    "Index Futures": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    "Stock Futures": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    Options: ["Custom", "Strategy Builder", "Readymade"],
    "Crypto Spot": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    "Crypto Futures": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    "Crypto Mutual Fund": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    "Stocks Mutual fund": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    Bonds: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    IPO: [],
  };

  const [activePrimaryItem, setActivePrimaryItem] = useState("Portfolio");
  const [activeSecondaryItem, setActiveSecondaryItem] = useState(
    secondaryNavTriggerCategories["Portfolio"]?.[0] || ""
  );
  
  const [mainPortfolioCashBalance, setMainPortfolioCashBalance] = useState(50000.00);
  const [cryptoCashBalance, setCryptoCashBalance] = useState(15000.00);

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

  const topWatchlistItems = [
    "Stocks",
    "Index Futures",
    "Stock Futures",
    "Stocks Mutual fund",
    "Bonds",
    "Crypto Spot",
    "Crypto Futures",
    "Crypto Mutual Fund"
  ];

  const isTopWatchlistView = topWatchlistItems.includes(activePrimaryItem) && activeSecondaryItem.startsWith("Top watchlist");

  const isCategoryNumberedWatchlistView = 
    [...topWatchlistItems].includes(activePrimaryItem) && 
    !!activeSecondaryItem.match(/^Watchlist \d+$/);

  let newsForView: NewsArticle[] = mockNewsArticles; 
  let itemsForTopWatchlist: Stock[] | undefined = undefined;
  let categoryWatchlistTitle: string = "";

  if (isPortfolioHoldingsView) {
    newsForView = getRelevantNewsForHoldings(mockPortfolioHoldings, mockNewsArticles);
  } else if (isPortfolioPositionsView) {
    newsForView = getRelevantNewsForPositions(mockIntradayPositions, mockFoPositions, mockCryptoFutures, mockNewsArticles);
  } else if (activePrimaryItem === "Options") { 
    newsForView = mockNewsArticles; 
  } else if (isUserPortfolioWatchlistView) {
    newsForView = getRelevantNewsForHoldings(mockPortfolioHoldings, mockNewsArticles); 
  } else if (isTopWatchlistView) {
      categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
      if (activePrimaryItem === "Stocks") {
        itemsForTopWatchlist = mockStocks.map(s => ({...s, exchange: s.exchange || (Math.random() > 0.5 ? "NSE" : "BSE")}));
      } else if (activePrimaryItem === "Index Futures") {
        itemsForTopWatchlist = mockIndexFuturesForWatchlist;
      } else if (activePrimaryItem === "Stock Futures") {
        itemsForTopWatchlist = mockStockFuturesForWatchlist;
      } else if (activePrimaryItem === "Crypto Spot") {
        itemsForTopWatchlist = mockCryptoAssets;
      } else if (activePrimaryItem === "Crypto Futures") {
        itemsForTopWatchlist = mockCryptoFuturesForWatchlist;
      } else if (activePrimaryItem === "Crypto Mutual Fund") {
        itemsForTopWatchlist = [...mockCryptoMutualFunds, ...mockCryptoETFs];
      } else if (activePrimaryItem === "Stocks Mutual fund") {
        itemsForTopWatchlist = mockMutualFunds;
      } else if (activePrimaryItem === "Bonds") {
        itemsForTopWatchlist = mockBonds;
      } else {
        itemsForTopWatchlist = []; 
      }
      newsForView = getRelevantNewsForWatchlistItems(itemsForTopWatchlist, mockNewsArticles);
  } else if (isCategoryNumberedWatchlistView) {
    categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
    newsForView = mockNewsArticles; 
  }

  return (
    <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <MarketOverview 
        title="Market Overview" 
        items={mockMarketIndices}
      />

      <SubNav
        primaryNavItems={primaryNavItems}
        activePrimaryItem={activePrimaryItem}
        activeSecondaryItem={activeSecondaryItem}
        onPrimaryNavClick={handlePrimaryNavClick}
        onSecondaryNavClick={handleSecondaryNavClick}
        secondaryNavTriggerCategories={secondaryNavTriggerCategories}
      />
      
      {isPortfolioHoldingsView ? (
        <>
          <CryptoHoldingsSection
            title="Crypto Wallet & Holdings"
            holdings={mockPortfolioHoldings.filter(h => h.type === 'Crypto')}
            cashBalance={cryptoCashBalance}
            setCashBalance={setCryptoCashBalance}
            mainPortfolioCashBalance={mainPortfolioCashBalance}
            setMainPortfolioCashBalance={setMainPortfolioCashBalance}
            isRealMode={false}
          />
          <PortfolioHoldingsTable 
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
      ) : isTopWatchlistView ? ( 
        <div className="space-y-8">
          <WatchlistSection
            title={categoryWatchlistTitle}
            displayItems={itemsForTopWatchlist}
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
  );
}
