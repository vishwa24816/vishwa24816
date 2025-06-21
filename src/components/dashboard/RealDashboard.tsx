
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


export function RealDashboard() {
  const primaryNavItems = [
    "Portfolio", "Crypto Spot", "Crypto Futures", "Crypto Mutual Fund"
  ];

  const secondaryNavTriggerCategories: Record<string, string[]> = {
    Portfolio: ["Holdings", "Positions", "Portfolio Watchlist"],
    "Crypto Spot": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    "Crypto Futures": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    "Crypto Mutual Fund": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
  };

  const [activePrimaryItem, setActivePrimaryItem] = useState("Portfolio");
  const [activeSecondaryItem, setActiveSecondaryItem] = useState(
    secondaryNavTriggerCategories["Portfolio"]?.[0] || ""
  );
  
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

  const topWatchlistItems = [
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
  } else if (isUserPortfolioWatchlistView) {
    newsForView = getRelevantNewsForHoldings(mockPortfolioHoldings, mockNewsArticles); 
  } else if (isTopWatchlistView) {
      categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
      if (activePrimaryItem === "Crypto Spot") {
        itemsForTopWatchlist = mockCryptoAssets;
      } else if (activePrimaryItem === "Crypto Futures") {
        itemsForTopWatchlist = mockCryptoFuturesForWatchlist;
      } else if (activePrimaryItem === "Crypto Mutual Fund") {
        itemsForTopWatchlist = [...mockCryptoMutualFunds, ...mockCryptoETFs];
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
        title="Top Cryptocurrencies" 
        items={mockCryptoAssets.slice(0, 3)} 
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
            mainPortfolioCashBalance={mainPortfolioCashBalance}
            setMainPortfolioCashBalance={setMainPortfolioCashBalance}
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
      ) : (
         <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
            <PackageOpen className="h-16 w-16 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome to Real Mode</h2>
            <p className="max-w-md">
                Select a category above to view your crypto assets and portfolio.
            </p>
        </div>
      )}
    </main>
  );
}
