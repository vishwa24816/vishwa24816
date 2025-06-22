
"use client";

import { SubNav } from '@/components/dashboard/SubNav';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { WatchlistSection } from '@/components/dashboard/WatchlistSection';
import { CryptoHoldingsSection } from '@/components/dashboard/CryptoHoldingsSection';
import { CryptoIntradayPositionsSection } from '@/components/dashboard/CryptoIntradayPositionsSection';
import { CryptoFuturesSection } from '@/components/dashboard/CryptoFuturesSection';
import { PackageOpen } from 'lucide-react';
import { PortfolioHoldingsTable } from '@/components/dashboard/PortfolioHoldingsTable';
import { IntradayPositionsSection } from '@/components/dashboard/IntradayPositionsSection';
import { FoPositionsSection } from '@/components/dashboard/FoPositionsSection';
import { FoBasketSection } from '@/components/dashboard/FoBasketSection';
import { OptionChain } from '@/components/dashboard/OptionChain';
import { ReadymadeStrategiesSection } from '@/components/dashboard/ReadymadeStrategiesSection';
import { StrategyBuilder } from '@/components/dashboard/StrategyBuilder';

import React, { useState, useMemo } from 'react';
import type { PortfolioHolding, NewsArticle, IntradayPosition, FoPosition, CryptoFuturePosition, Stock } from '@/types';
import { 
  mockPortfolioHoldings, 
  mockNewsArticles, 
  mockIntradayPositions,
  mockFoPositions,
  mockCryptoIntradayPositions,
  mockCryptoFutures, 
  mockCryptoAssets,
  mockStocks,
  mockIndexFuturesForWatchlist,
  mockStockFuturesForWatchlist,
  mockMutualFunds,
  mockBonds,
  mockCryptoFuturesForWatchlist,
  mockCryptoMutualFunds,
  mockCryptoETFs,
  mockWeb3Gainers,
  mockWeb3Trending,
  mockWeb3Memes,
  mockWeb3DeFi,
  mockWeb3AI,
  mockWeb3Holdings,
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
  cryptoFutures: CryptoFuturePosition[],
  fo: FoPosition[] = [],
  allNews: NewsArticle[]
): NewsArticle[] {
  if ((!intraday.length && !cryptoFutures.length && !fo.length) || !allNews.length) {
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

function getRelevantNewsForWatchlistItems(items: Stock[] | undefined, allNews: NewsArticle[]): NewsArticle[] {
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

interface DemoDashboardProps {
  searchMode: 'Fiat' | 'Exchange' | 'Web3';
}

export function DemoDashboard({ searchMode }: DemoDashboardProps) {
    const { primaryNavItems, secondaryNavTriggerCategories } = useMemo(() => {
    if (searchMode === 'Fiat') {
        return {
            primaryNavItems: ["Portfolio", "Stocks", "Index Futures", "Stock Futures", "Options", "Stocks Mutual fund", "Bonds", "IPO"],
            secondaryNavTriggerCategories: {
                Portfolio: ["Holdings", "Positions", "Portfolio Watchlist"],
                Stocks: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
                "Index Futures": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
                "Stock Futures": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
                Options: ["Custom", "Strategy Builder", "Readymade"],
                "Stocks Mutual fund": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
                Bonds: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
                IPO: [],
            }
        };
    }
    if (searchMode === 'Web3') {
      const web3PrimaryNav = ['Portfolio', 'Gainers', 'Trending', 'Memes', 'DeFi', 'AI'];
      const web3SecondaryNav = web3PrimaryNav.reduce((acc, item) => {
        if (item === 'Portfolio') {
          acc[item] = ["Holdings", "Portfolio Watchlist"];
        } else {
          acc[item] = ['Top'];
        }
        return acc;
      }, {} as Record<string, string[]>);
      return { primaryNavItems: web3PrimaryNav, secondaryNavTriggerCategories: web3SecondaryNav };
    }
    
    // Default to Exchange mode
    const exchangePrimaryNav = [
      "Portfolio", "Crypto Spot", "Crypto Futures", "Crypto Mutual Fund"
    ];
    const exchangeSecondaryNav: Record<string, string[]> = {
      Portfolio: ["Holdings", "Positions", "Portfolio Watchlist"],
      "Crypto Spot": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
      "Crypto Futures": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
      "Crypto Mutual Fund": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    };
    return { primaryNavItems: exchangePrimaryNav, secondaryNavTriggerCategories: exchangeSecondaryNav };
  }, [searchMode]);


  const [activePrimaryItem, setActivePrimaryItem] = useState("Portfolio");
  const [activeSecondaryItem, setActiveSecondaryItem] = useState(
    secondaryNavTriggerCategories["Portfolio"]?.[0] || ""
  );
  
  const [mainPortfolioCashBalance, setMainPortfolioCashBalance] = useState(50000.00);
  const [exchangeCashBalance, setExchangeCashBalance] = useState(15000.00);
  const [web3CashBalance, setWeb3CashBalance] = useState(20000.00);

  React.useEffect(() => {
    setActivePrimaryItem('Portfolio');
    const newSecondaryItems = secondaryNavTriggerCategories['Portfolio'] || [];
    setActiveSecondaryItem(newSecondaryItems[0] || '');
  }, [searchMode, secondaryNavTriggerCategories]);

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

  const topWatchlistItems = useMemo(() => {
    if (searchMode === 'Fiat') return ["Stocks", "Index Futures", "Stock Futures", "Stocks Mutual fund", "Bonds"];
    return ["Crypto Spot", "Crypto Futures", "Crypto Mutual Fund"];
  }, [searchMode]);

  const isTopWatchlistView = topWatchlistItems.includes(activePrimaryItem) && activeSecondaryItem.startsWith("Top watchlist");
  const isCategoryNumberedWatchlistView = 
    [...topWatchlistItems].includes(activePrimaryItem) && 
    !!activeSecondaryItem.match(/^Watchlist \d+$/);
    
  const WEB3_CATEGORIES = ['Gainers', 'Trending', 'Memes', 'DeFi', 'AI'];
  const isWeb3CategoryView = searchMode === 'Web3' && WEB3_CATEGORIES.includes(activePrimaryItem);

  const exchangeHoldings = useMemo(() => mockPortfolioHoldings.filter(h => h.type === 'Crypto'), []);
  const web3PortfolioWatchlistItems = useMemo(() => [...mockWeb3Trending.slice(0, 3), ...mockWeb3DeFi.slice(0, 2)], []);
  const fiatHoldings = useMemo(() => mockPortfolioHoldings.filter(h => h.type !== 'Crypto'), []);

  let newsForView: NewsArticle[] = mockNewsArticles; 
  let itemsForWatchlist: Stock[] | undefined = undefined;
  let categoryWatchlistTitle: string = "";

  if (isPortfolioHoldingsView) {
    if (searchMode === 'Web3') {
        newsForView = getRelevantNewsForHoldings(mockWeb3Holdings, mockNewsArticles);
    } else if (searchMode === 'Exchange') {
        newsForView = getRelevantNewsForHoldings(exchangeHoldings, mockNewsArticles);
    } else { // Fiat
        newsForView = getRelevantNewsForHoldings(fiatHoldings, mockNewsArticles);
    }
  } else if (isPortfolioPositionsView) {
    if (searchMode === 'Exchange') {
        newsForView = getRelevantNewsForPositions(mockCryptoIntradayPositions, mockCryptoFutures, [], mockNewsArticles);
    } else { // Fiat
        newsForView = getRelevantNewsForPositions(mockIntradayPositions, [], mockFoPositions, mockNewsArticles);
    }
  } else if (isUserPortfolioWatchlistView) {
    if (searchMode === 'Web3') {
        itemsForWatchlist = web3PortfolioWatchlistItems;
    } else if (searchMode === 'Exchange') {
        itemsForWatchlist = mockCryptoAssets.slice(0, 5);
    } else { // Fiat
        itemsForWatchlist = mockStocks.slice(0, 5);
    }
    newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
  } else if (isTopWatchlistView) {
      categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
      if (activePrimaryItem === "Crypto Spot") itemsForWatchlist = mockCryptoAssets;
      else if (activePrimaryItem === "Crypto Futures") itemsForWatchlist = mockCryptoFuturesForWatchlist;
      else if (activePrimaryItem === "Crypto Mutual Fund") itemsForWatchlist = [...mockCryptoMutualFunds, ...mockCryptoETFs];
      else if (activePrimaryItem === "Stocks") itemsForWatchlist = mockStocks.map(s => ({...s, exchange: s.exchange || (Math.random() > 0.5 ? "NSE" : "BSE")}));
      else if (activePrimaryItem === "Index Futures") itemsForWatchlist = mockIndexFuturesForWatchlist;
      else if (activePrimaryItem === "Stock Futures") itemsForWatchlist = mockStockFuturesForWatchlist;
      else if (activePrimaryItem === "Stocks Mutual fund") itemsForWatchlist = mockMutualFunds;
      else if (activePrimaryItem === "Bonds") itemsForWatchlist = mockBonds;
      else itemsForWatchlist = [];
      newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
  } else if (isCategoryNumberedWatchlistView) {
    categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
    newsForView = mockNewsArticles; 
  } else if (isWeb3CategoryView) {
    categoryWatchlistTitle = `Top ${activePrimaryItem}`;
    switch (activePrimaryItem) {
        case 'Gainers': itemsForWatchlist = mockWeb3Gainers; break;
        case 'Trending': itemsForWatchlist = mockWeb3Trending; break;
        case 'Memes': itemsForWatchlist = mockWeb3Memes; break;
        case 'DeFi': itemsForWatchlist = mockWeb3DeFi; break;
        case 'AI': itemsForWatchlist = mockWeb3AI; break;
        default: itemsForWatchlist = [];
    }
    newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
  } else if (searchMode === 'Fiat' && activePrimaryItem === "Options") { 
    newsForView = mockNewsArticles; 
  }

  return (
    <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <SubNav
        primaryNavItems={primaryNavItems}
        activePrimaryItem={activePrimaryItem}
        activeSecondaryItem={activeSecondaryItem}
        onPrimaryNavClick={handlePrimaryNavClick}
        onSecondaryNavClick={handleSecondaryNavClick}
        secondaryNavTriggerCategories={secondaryNavTriggerCategories}
      />
      
      {/* Fiat Mode Rendering */}
      {searchMode === 'Fiat' && (
        isPortfolioHoldingsView ? (
          <>
            <PortfolioHoldingsTable mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} />
            <NewsSection articles={newsForView} />
          </>
        ) : isPortfolioPositionsView ? (
          <div className="space-y-8">
            <IntradayPositionsSection />
            <FoPositionsSection />
            <FoBasketSection />
            <NewsSection articles={newsForView} />
          </div>
        ) : isUserPortfolioWatchlistView ? (
          <div className="space-y-8">
            <WatchlistSection title="My Fiat Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride="simFiatWatchlist"/>
            <NewsSection articles={newsForView} />
          </div>
        ) : activePrimaryItem === "Options" ? (
            activeSecondaryItem === "Custom" ? ( <div className="space-y-8"><OptionChain /><NewsSection articles={newsForView} /></div>) 
            : activeSecondaryItem === "Strategy Builder" ? ( <div className="space-y-8"><StrategyBuilder /><NewsSection articles={newsForView} /></div> ) 
            : activeSecondaryItem === "Readymade" ? ( <div className="space-y-8"><ReadymadeStrategiesSection /><NewsSection articles={newsForView} /></div> ) 
            : null
        ) : isTopWatchlistView ? (
          <div className="space-y-8">
            <WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true} />
            <NewsSection articles={newsForView} />
          </div>
        ) : isCategoryNumberedWatchlistView ? (
          <div className="space-y-8">
            <WatchlistSection title={categoryWatchlistTitle} isPredefinedList={false} localStorageKeyOverride={`simAppWatchlist_Fiat_${activePrimaryItem.replace(/\s+/g, '_')}_${activeSecondaryItem.replace(/\s+/g, '_')}`} defaultInitialItems={[]}/>
            <NewsSection articles={newsForView} />
          </div>
        ) : activePrimaryItem === "IPO" ? (
          <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
              <PackageOpen className="h-16 w-16 mb-4" />
              <h2 className="text-2xl font-semibold mb-2 text-foreground">IPO Section</h2>
              <p className="max-w-md">Information about upcoming and recent Initial Public Offerings will be displayed here.</p>
          </div>
        ) : null
      )}

      {/* Exchange Mode Rendering */}
      {searchMode === 'Exchange' && (
        isPortfolioHoldingsView ? (
          <>
            <CryptoHoldingsSection title="Crypto Wallet & Holdings" holdings={exchangeHoldings} cashBalance={exchangeCashBalance} setCashBalance={setExchangeCashBalance} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} isRealMode={false} />
            <NewsSection articles={newsForView} />
          </>
        ) : isPortfolioPositionsView ? (
          <div className="space-y-8">
            <CryptoIntradayPositionsSection />
            <CryptoFuturesSection />
            <NewsSection articles={newsForView} />
          </div>
        ) : isUserPortfolioWatchlistView ? (
          <div className="space-y-8">
            <WatchlistSection title="My Crypto Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride={'simCryptoWatchlist'}/>
            <NewsSection articles={newsForView} />
          </div>
        ) : isTopWatchlistView ? ( 
          <div className="space-y-8">
            <WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true}/>
            <NewsSection articles={newsForView} />
          </div>
        ) : isCategoryNumberedWatchlistView ? (
          <div className="space-y-8">
            <WatchlistSection title={categoryWatchlistTitle} isPredefinedList={false} localStorageKeyOverride={`simAppWatchlist_Exchange_${activePrimaryItem.replace(/\s+/g, '_')}_${activeSecondaryItem.replace(/\s+/g, '_')}`} defaultInitialItems={[]}/>
            <NewsSection articles={newsForView} />
          </div>
        ) : null
      )}

      {/* Web3 Mode Rendering */}
      {searchMode === 'Web3' && (
        isPortfolioHoldingsView ? (
            <>
              <CryptoHoldingsSection title="Web3 Wallet & Holdings" holdings={mockWeb3Holdings} cashBalance={web3CashBalance} setCashBalance={setWeb3CashBalance} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} isRealMode={false} />
              <NewsSection articles={newsForView} />
            </>
        ) : isUserPortfolioWatchlistView ? (
            <div className="space-y-8">
                <WatchlistSection title="My Web3 Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride={'simWeb3Watchlist'} />
                <NewsSection articles={newsForView} />
            </div>
        ) : isWeb3CategoryView ? (
            <div className="space-y-8">
                <WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true} />
                <NewsSection articles={newsForView} />
            </div>
        ) : null
      )}

      {/* Fallback for unhandled views */}
      {!((searchMode === 'Fiat' && (isPortfolioHoldingsView || isPortfolioPositionsView || isUserPortfolioWatchlistView || activePrimaryItem === 'Options' || isTopWatchlistView || isCategoryNumberedWatchlistView || activePrimaryItem === 'IPO')) || 
         (searchMode === 'Exchange' && (isPortfolioHoldingsView || isPortfolioPositionsView || isUserPortfolioWatchlistView || isTopWatchlistView || isCategoryNumberedWatchlistView)) || 
         (searchMode === 'Web3' && (isPortfolioHoldingsView || isUserPortfolioWatchlistView || isWeb3CategoryView))) && (
        <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
          <PackageOpen className="h-16 w-16 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome!</h2>
          <p className="max-w-md">Select a category above to view your assets and portfolio.</p>
        </div>
      )}
    </main>
  );
}
