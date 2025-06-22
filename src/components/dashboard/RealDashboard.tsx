"use client";

import { SubNav } from '@/components/dashboard/SubNav';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { WatchlistSection } from '@/components/dashboard/WatchlistSection';
import { CryptoHoldingsSection } from '@/components/dashboard/CryptoHoldingsSection';
import { CryptoIntradayPositionsSection } from '@/components/dashboard/CryptoIntradayPositionsSection';
import { CryptoFuturesSection } from '@/components/dashboard/CryptoFuturesSection';

import React, { useState, useMemo } from 'react';
import type { PortfolioHolding, NewsArticle, IntradayPosition, FoPosition, CryptoFuturePosition, Stock, MarketIndex } from '@/types';
import { 
  mockPortfolioHoldings, 
  mockNewsArticles, 
  mockCryptoIntradayPositions,
  mockCryptoFutures, 
  mockCryptoAssets,
  mockCryptoFuturesForWatchlist,
  mockCryptoMutualFunds,
  mockCryptoETFs,
} from '@/lib/mockData';

// Helper functions (could be moved to a utils file)
function getRelevantNewsForHoldings(holdings: PortfolioHolding[], allNews: NewsArticle[]): NewsArticle[] {
  if (!holdings.length || !allNews.length) return [];
  const keywords = new Set(holdings.flatMap(h => [h.name.toLowerCase(), h.symbol?.toLowerCase()]).filter(Boolean));
  return allNews.filter(news => Array.from(keywords).some(keyword => news.headline.toLowerCase().includes(keyword as string)));
}

function getRelevantNewsForPositions(
  intraday: IntradayPosition[],
  cryptoFutures: CryptoFuturePosition[],
  allNews: NewsArticle[]
): NewsArticle[] {
  if ((!intraday.length && !cryptoFutures.length) || !allNews.length) return [];
  const keywords = new Set<string>();
  intraday.forEach(p => {
    keywords.add(p.name.toLowerCase());
    if (p.symbol) keywords.add(p.symbol.toLowerCase());
  });
  cryptoFutures.forEach(p => {
    keywords.add(p.symbol.replace(/USDT|INR/g, "").toLowerCase());
  });
  return allNews.filter(news => Array.from(keywords).some(keyword => news.headline.toLowerCase().includes(keyword)));
}

function getRelevantNewsForWatchlistItems(items: Stock[] | undefined, allNews: NewsArticle[]): NewsArticle[] {
  if (!items || !items.length || !allNews.length) return [];
  const keywords = new Set(items.flatMap(i => [i.name.toLowerCase(), i.symbol?.toLowerCase()]).filter(Boolean));
  return allNews.filter(news => Array.from(keywords).some(keyword => news.headline.toLowerCase().includes(keyword as string)));
}


export function RealDashboard() {
  const primaryNavItems = useMemo(() => ["Portfolio", "Crypto Spot", "Crypto Futures", "Crypto Mutual Fund"], []);
  const secondaryNavTriggerCategories: Record<string, string[]> = useMemo(() => ({
      Portfolio: ["Holdings", "Positions", "Portfolio Watchlist"],
      "Crypto Spot": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
      "Crypto Futures": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
      "Crypto Mutual Fund": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
  }), []);

  const [activePrimaryItem, setActivePrimaryItem] = useState("Portfolio");
  const [activeSecondaryItem, setActiveSecondaryItem] = useState("Holdings");
  
  const [mainPortfolioCashBalance, setMainPortfolioCashBalance] = useState(50000.00); // This is just for demo purposes if needed
  const [exchangeCashBalance, setExchangeCashBalance] = useState(15000.00);

  const handlePrimaryNavClick = (item: string) => {
    setActivePrimaryItem(item);
    const newSecondaryItems = secondaryNavTriggerCategories[item] || [];
    setActiveSecondaryItem(newSecondaryItems[0] || "");
  };
  
  const exchangeHoldings = useMemo(() => mockPortfolioHoldings.filter(h => h.type === 'Crypto'), []);

  // Determine what news and watchlist items to show
  let newsForView: NewsArticle[] = mockNewsArticles; 
  let itemsForWatchlist: Stock[] | undefined = undefined;
  let categoryWatchlistTitle: string = "";

  if (activePrimaryItem === "Portfolio" && activeSecondaryItem === "Holdings") {
    newsForView = getRelevantNewsForHoldings(exchangeHoldings, mockNewsArticles);
  } else if (activePrimaryItem === "Portfolio" && activeSecondaryItem === "Positions") {
    newsForView = getRelevantNewsForPositions(mockCryptoIntradayPositions, mockCryptoFutures, mockNewsArticles);
  } else if (activePrimaryItem === "Portfolio" && activeSecondaryItem === "Portfolio Watchlist") {
    itemsForWatchlist = mockCryptoAssets.slice(0, 5);
    newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
  } else if (activePrimaryItem === "Crypto Spot") {
    categoryWatchlistTitle = `Crypto Spot - ${activeSecondaryItem}`;
    itemsForWatchlist = mockCryptoAssets;
    newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
  } else if (activePrimaryItem === "Crypto Futures") {
    categoryWatchlistTitle = `Crypto Futures - ${activeSecondaryItem}`;
    itemsForWatchlist = mockCryptoFuturesForWatchlist;
    newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
  } else if (activePrimaryItem === "Crypto Mutual Fund") {
    categoryWatchlistTitle = `Crypto Mutual Fund - ${activeSecondaryItem}`;
    itemsForWatchlist = [...mockCryptoMutualFunds, ...mockCryptoETFs];
    newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
  }
  
  return (
    <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <MarketOverview 
        title="Top Cryptocurrencies"
        items={mockCryptoAssets.slice(0, 5)} 
      />

      <SubNav
        primaryNavItems={primaryNavItems}
        activePrimaryItem={activePrimaryItem}
        activeSecondaryItem={activeSecondaryItem}
        onPrimaryNavClick={handlePrimaryNavClick}
        onSecondaryNavClick={setActiveSecondaryItem}
        secondaryNavTriggerCategories={secondaryNavTriggerCategories}
      />
      
      {activePrimaryItem === 'Portfolio' && activeSecondaryItem === 'Holdings' && (
        <>
          <CryptoHoldingsSection title="Crypto Wallet & Holdings" holdings={exchangeHoldings} cashBalance={exchangeCashBalance} setCashBalance={setExchangeCashBalance} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} isRealMode={true} />
          <NewsSection articles={newsForView} />
        </>
      )}
      
      {activePrimaryItem === 'Portfolio' && activeSecondaryItem === 'Positions' && (
        <div className="space-y-8">
          <CryptoIntradayPositionsSection />
          <CryptoFuturesSection />
          <NewsSection articles={newsForView} />
        </div>
      )}

      {activePrimaryItem === 'Portfolio' && activeSecondaryItem === 'Portfolio Watchlist' && (
        <div className="space-y-8">
          <WatchlistSection title="My Crypto Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride={'simCryptoWatchlist'}/>
          <NewsSection articles={newsForView} />
        </div>
      )}

      {(activePrimaryItem === 'Crypto Spot' || activePrimaryItem === 'Crypto Futures' || activePrimaryItem === 'Crypto Mutual Fund') && (
        <div className="space-y-8">
          <WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true}/>
          <NewsSection articles={newsForView} />
        </div>
      )}
    </main>
  );
}
