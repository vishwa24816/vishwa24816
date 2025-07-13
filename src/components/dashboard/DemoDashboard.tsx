
"use client";

import { SubNav } from '@/components/dashboard/SubNav';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { WatchlistSection } from '@/components/dashboard/WatchlistSection';
import { CryptoHoldingsSection } from '@/components/dashboard/CryptoHoldingsSection';
import { FiatHoldingsSection } from '@/components/dashboard/FiatHoldingsSection';
import { CryptoIntradayPositionsSection } from '@/components/dashboard/CryptoIntradayPositionsSection';
import { CryptoFuturesSection } from '@/components/dashboard/CryptoFuturesSection';
import { PackageOpen, Briefcase } from 'lucide-react';
import { IntradayPositionsSection } from '@/components/dashboard/IntradayPositionsSection';
import { FoPositionsSection } from '@/components/dashboard/FoPositionsSection';
import { FoBasketSection } from '@/components/dashboard/FoBasketSection';
import { OptionChain } from '@/components/dashboard/OptionChain';
import { ReadymadeStrategiesSection } from '@/components/dashboard/ReadymadeStrategiesSection';
import { StrategyBuilder } from '@/components/dashboard/StrategyBuilder';


import React, { useState, useMemo } from 'react';
import type { PortfolioHolding, NewsArticle, IntradayPosition, FoPosition, CryptoFuturePosition, Stock, SelectedOptionLeg } from '@/types';
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
  activeMode: 'Portfolio' | 'Fiat' | 'Crypto';
}

export function DemoDashboard({ activeMode }: DemoDashboardProps) {
    const { primaryNavItems, secondaryNavTriggerCategories } = useMemo(() => {
    if (activeMode === 'Portfolio') {
        return {
            primaryNavItems: ["Fiat", "Crypto"],
            secondaryNavTriggerCategories: {
                Fiat: ["Holdings", "Positions", "Portfolio Watchlist"],
                Crypto: ["Holdings", "Positions", "Portfolio Watchlist"],
            }
        }
    }
    if (activeMode === 'Fiat') {
        return {
            primaryNavItems: ["Stocks", "Futures", "Options", "Mutual Fund", "Bonds", "IPO"],
            secondaryNavTriggerCategories: {
                Stocks: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
                Futures: ["Index Futures", "Stock Futures"],
                Options: ["Custom", "Readymade"],
                "Mutual Fund": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
                Bonds: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
                IPO: [],
            }
        };
    }
    
    // Crypto mode
    const cryptoPrimaryNav = [
      "Spot", "Futures", "Options", "Mutual Fund"
    ];
    const cryptoSecondaryNav: Record<string, string[]> = {
      "Spot": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
      "Futures": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
      "Options": ["Custom", "Readymade"],
      "Mutual Fund": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
    };
    return { primaryNavItems: cryptoPrimaryNav, secondaryNavTriggerCategories: cryptoSecondaryNav };
  }, [activeMode]);


  const [activePrimaryItem, setActivePrimaryItem] = useState(primaryNavItems[0]);
  const [activeSecondaryItem, setActiveSecondaryItem] = useState(
    secondaryNavTriggerCategories[primaryNavItems[0]]?.[0] || ""
  );
  
  const [mainPortfolioCashBalance, setMainPortfolioCashBalance] = useState(50000.00);
  const [cryptoCashBalance, setCryptoCashBalance] = useState(15000.00);
  const [strategyLegs, setStrategyLegs] = useState<SelectedOptionLeg[]>([]);


  React.useEffect(() => {
    const firstPrimary = primaryNavItems[0] || "";
    setActivePrimaryItem(firstPrimary);
    const newSecondaryItems = secondaryNavTriggerCategories[firstPrimary] || [];
    setActiveSecondaryItem(newSecondaryItems[0] || '');
  }, [activeMode, primaryNavItems, secondaryNavTriggerCategories]);

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
  
  const fiatHoldings = useMemo(() => mockPortfolioHoldings.filter(h => h.type !== 'Crypto'), []);
  const cryptoHoldings = useMemo(() => mockPortfolioHoldings.filter(h => h.type === 'Crypto'), []);

  let newsForView: NewsArticle[] = mockNewsArticles; 
  let itemsForWatchlist: Stock[] | undefined = undefined;
  let categoryWatchlistTitle: string = "";

  if (activeMode === 'Portfolio') {
      const isHoldingsView = activeSecondaryItem === "Holdings";
      const isPositionsView = activeSecondaryItem === "Positions";
      const isWatchlistView = activeSecondaryItem === "Portfolio Watchlist";

      if (activePrimaryItem === 'Fiat') {
          if (isHoldingsView) newsForView = getRelevantNewsForHoldings(fiatHoldings, mockNewsArticles);
          if (isPositionsView) newsForView = getRelevantNewsForPositions(mockIntradayPositions, [], mockFoPositions, mockNewsArticles);
          if (isWatchlistView) {
            itemsForWatchlist = mockStocks.slice(0, 5);
            newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
          }
      } else if (activePrimaryItem === 'Crypto') {
          if (isHoldingsView) newsForView = getRelevantNewsForHoldings(cryptoHoldings, mockNewsArticles);
          if (isPositionsView) newsForView = getRelevantNewsForPositions(mockCryptoIntradayPositions, mockCryptoFutures, [], mockNewsArticles);
          if (isWatchlistView) {
              itemsForWatchlist = mockCryptoAssets.slice(0, 5);
              newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
          }
      }
  } else if (activeMode === 'Fiat') {
    const isTopWatchlistView = (["Stocks", "Mutual Fund", "Bonds"].includes(activePrimaryItem)) && activeSecondaryItem.startsWith("Top watchlist");
    const isCategoryNumberedWatchlistView = (["Stocks", "Mutual Fund", "Bonds"].includes(activePrimaryItem)) && !!activeSecondaryItem.match(/^Watchlist \d+$/);

    if (activePrimaryItem === 'Futures') {
        categoryWatchlistTitle = `${activeSecondaryItem} Watchlist`;
        if (activeSecondaryItem === 'Index Futures') {
            itemsForWatchlist = mockIndexFuturesForWatchlist;
        } else if (activeSecondaryItem === 'Stock Futures') {
            itemsForWatchlist = mockStockFuturesForWatchlist;
        }
        newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
    } else if (isTopWatchlistView || isCategoryNumberedWatchlistView) {
        categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
        if (isTopWatchlistView) {
            if (activePrimaryItem === "Stocks") itemsForWatchlist = mockStocks.map(s => ({...s, exchange: s.exchange || (Math.random() > 0.5 ? "NSE" : "BSE")}));
            else if (activePrimaryItem === "Mutual Fund") itemsForWatchlist = mockMutualFunds;
            else if (activePrimaryItem === "Bonds") itemsForWatchlist = mockBonds;
            newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
        } else {
            itemsForWatchlist = [];
            newsForView = mockNewsArticles;
        }
    } else {
      newsForView = mockNewsArticles;
    }
  } else if (activeMode === 'Crypto') {
    if (activePrimaryItem !== "Options") {
      categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
      if (activePrimaryItem === "Spot") itemsForWatchlist = mockCryptoAssets;
      else if (activePrimaryItem === "Futures") itemsForWatchlist = mockCryptoFuturesForWatchlist;
      else if (activePrimaryItem === "Mutual Fund") itemsForWatchlist = [...mockCryptoMutualFunds, ...mockCryptoETFs];
      else itemsForWatchlist = [];
      newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
    } else {
      newsForView = mockNewsArticles;
    }
  }
  
  const renderPortfolioContent = () => {
    const isHoldingsView = activeSecondaryItem === "Holdings";
    const isPositionsView = activeSecondaryItem === "Positions";
    const isWatchlistView = activeSecondaryItem === "Portfolio Watchlist";

    switch (activePrimaryItem) {
        case 'Fiat':
            if (isHoldingsView) return <><FiatHoldingsSection mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} /><NewsSection articles={newsForView} /></>;
            if (isPositionsView) return <div className="space-y-8"><IntradayPositionsSection /><FoPositionsSection /><FoBasketSection /><NewsSection articles={newsForView} /></div>;
            if (isWatchlistView) return <div className="space-y-8"><WatchlistSection title="My Fiat Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride="simFiatWatchlist"/><NewsSection articles={newsForView} /></div>;
            return null;
        case 'Crypto':
            if (isHoldingsView) return <><CryptoHoldingsSection title="Crypto Wallet & Holdings" holdings={cryptoHoldings} cashBalance={cryptoCashBalance} setCashBalance={setCryptoCashBalance} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} isRealMode={false} /><NewsSection articles={newsForView} /></>;
            if (isPositionsView) return <div className="space-y-8"><CryptoIntradayPositionsSection positions={mockCryptoIntradayPositions} /><CryptoFuturesSection positions={mockCryptoFutures} cashBalance={cryptoCashBalance} /><NewsSection articles={newsForView} /></div>;
            if (isWatchlistView) return <div className="space-y-8"><WatchlistSection title="My Crypto Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride={'simCryptoWatchlist'}/><NewsSection articles={newsForView} /></div>;
            return null;
        default: return null;
    }
  };

  const renderMarketContent = () => {
    if (activeMode === 'Fiat') {
        if (activePrimaryItem === "Options") { 
            return activeSecondaryItem === "Custom" ? ( <div className="space-y-8"><OptionChain onAddLeg={(leg) => setStrategyLegs(prev => [...prev, leg])} /><StrategyBuilder legs={strategyLegs} setLegs={setStrategyLegs} /><NewsSection articles={newsForView} /></div>) 
            : activeSecondaryItem === "Readymade" ? ( <div className="space-y-8"><ReadymadeStrategiesSection /><NewsSection articles={newsForView} /></div> ) 
            : null
        }
        if (activePrimaryItem === "IPO") {
            return <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground"><PackageOpen className="h-16 w-16 mb-4" /><h2 className="text-2xl font-semibold mb-2 text-foreground">IPO Section</h2><p className="max-w-md">Information about upcoming and recent Initial Public Offerings will be displayed here.</p></div>
        }
        if (activePrimaryItem === "Futures") {
            return <div className="space-y-8"><WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true} /><NewsSection articles={newsForView} /></div>
        }
        const isTopWatchlistView = (["Stocks", "Mutual Fund", "Bonds"].includes(activePrimaryItem)) && activeSecondaryItem.startsWith("Top watchlist");
        const isCategoryNumberedWatchlistView = (["Stocks", "Mutual Fund", "Bonds"].includes(activePrimaryItem)) && !!activeSecondaryItem.match(/^Watchlist \d+$/);
        
        if(isTopWatchlistView) return <div className="space-y-8"><WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true} /><NewsSection articles={newsForView} /></div>
        if(isCategoryNumberedWatchlistView) return <div className="space-y-8"><WatchlistSection title={categoryWatchlistTitle} isPredefinedList={false} localStorageKeyOverride={`simAppWatchlist_Fiat_${activePrimaryItem.replace(/\s+/g, '_')}_${activeSecondaryItem.replace(/\s+/g, '_')}`} defaultInitialItems={[]}/><NewsSection articles={newsForView} /></div>
    
    } else if (activeMode === 'Crypto') {
        if (activePrimaryItem === "Options") {
            return activeSecondaryItem === "Custom" ? ( <div className="space-y-8"><OptionChain onAddLeg={(leg) => setStrategyLegs(prev => [...prev, leg])} /><StrategyBuilder legs={strategyLegs} setLegs={setStrategyLegs} /><NewsSection articles={newsForView} /></div>) 
            : activeSecondaryItem === "Readymade" ? ( <div className="space-y-8"><ReadymadeStrategiesSection /><NewsSection articles={newsForView} /></div> ) 
            : null
        }
        return <div className="space-y-8"><WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true}/><NewsSection articles={newsForView} /></div>
    }
    
    return <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground"><PackageOpen className="h-16 w-16 mb-4" /><h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome!</h2><p className="max-w-md">Select a category above to view your assets and portfolio.</p></div>;
  }

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-8">
      <SubNav
        primaryNavItems={primaryNavItems}
        activePrimaryItem={activePrimaryItem}
        activeSecondaryItem={activeSecondaryItem}
        onPrimaryNavClick={handlePrimaryNavClick}
        onSecondaryNavClick={handleSecondaryNavClick}
        secondaryNavTriggerCategories={secondaryNavTriggerCategories}
      />
      
      {activeMode === 'Portfolio' ? renderPortfolioContent() : renderMarketContent()}

    </main>
  );
}
