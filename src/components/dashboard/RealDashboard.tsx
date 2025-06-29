"use client";

import { SubNav } from '@/components/dashboard/SubNav';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { WatchlistSection } from '@/components/dashboard/WatchlistSection';
import { CryptoHoldingsSection } from '@/components/dashboard/CryptoHoldingsSection';
import { CryptoFuturesSection } from '@/components/dashboard/CryptoFuturesSection';
import { CryptoBasketSection } from '@/components/dashboard/CryptoBasketSection';

import React, { useState, useMemo } from 'react';
import type { PortfolioHolding, NewsArticle, IntradayPosition, FoPosition, CryptoFuturePosition, Stock } from '@/types';
import { 
  mockNewsArticles, 
  mockCryptoAssets,
  mockCryptoFuturesForWatchlist,
  mockCryptoMutualFunds,
  mockCryptoETFs,
  mockWeb3Gainers,
  mockWeb3Trending,
  mockWeb3Memes,
  mockWeb3DeFi,
  mockWeb3AI,
  mockWeb3Holdings,
  mockRealPortfolioHoldings,
  mockRealCryptoIntradayPositions,
  mockRealCryptoFutures,
} from '@/lib/mockData';

// Helper functions (could be moved to a utils file)
function getRelevantNewsForHoldings(holdings: PortfolioHolding[], allNews: NewsArticle[]): NewsArticle[] {
  if (!holdings.length || !allNews.length) return [];
  const keywords = new Set(holdings.flatMap(h => [h.name.toLowerCase(), h.symbol?.toLowerCase()]).filter(Boolean));
  return allNews.filter(news => Array.from(keywords).some(keyword => news.headline.toLowerCase().includes(keyword as string)));
}

function getRelevantNewsForPositions(
  cryptoFutures: CryptoFuturePosition[],
  allNews: NewsArticle[]
): NewsArticle[] {
  if (!cryptoFutures.length || !allNews.length) return [];
  const keywords = new Set<string>();
  cryptoFutures.forEach(p => {
    keywords.add(p.symbol.replace(/USDT|INR/g, "").toLowerCase());
  });
  return allNews.filter(news => Array.from(keywords).some(keyword => news.headline.toLowerCase().includes(keyword as string)));
}

function getRelevantNewsForWatchlistItems(items: Stock[] | undefined, allNews: NewsArticle[]): NewsArticle[] {
  if (!items || !items.length || !allNews.length) return [];
  const keywords = new Set(items.flatMap(i => [i.name.toLowerCase(), i.symbol?.toLowerCase()]).filter(Boolean));
  return allNews.filter(news => Array.from(keywords).some(keyword => news.headline.toLowerCase().includes(keyword as string)));
}

interface RealDashboardProps {
  activeMode: 'Portfolio' | 'Fiat' | 'Crypto' | 'Web3';
}

export function RealDashboard({ activeMode }: RealDashboardProps) {
  const { primaryNavItems, secondaryNavTriggerCategories } = useMemo(() => {
    if (activeMode === 'Portfolio') {
       return {
            primaryNavItems: ["Crypto", "Web3"],
            secondaryNavTriggerCategories: {
                Crypto: ["Holdings", "Positions", "Portfolio Watchlist"],
                Web3: ["Holdings", "Portfolio Watchlist"],
            }
        }
    }
    if (activeMode === 'Web3') {
      const web3PrimaryNav = ['Gainers', 'Trending', 'Memes', 'DeFi', 'AI'];
      const web3SecondaryNav = web3PrimaryNav.reduce((acc, item) => {
        acc[item] = ['Top'];
        return acc;
      }, {} as Record<string, string[]>);
      return { primaryNavItems: web3PrimaryNav, secondaryNavTriggerCategories: web3SecondaryNav };
    }
    
    // Default to Crypto mode
    const cryptoPrimaryNav = [
      "Spot", "Futures", "Mutual Fund"
    ];
    const cryptoSecondaryNav: Record<string, string[]> = {
      "Spot": ["Top watchlist"],
      "Futures": ["Top watchlist"],
      "Mutual Fund": ["Top watchlist"],
    };
    return { primaryNavItems: cryptoPrimaryNav, secondaryNavTriggerCategories: cryptoSecondaryNav };
  }, [activeMode]);


  const [activePrimaryItem, setActivePrimaryItem] = useState(primaryNavItems[0]);
  const [activeSecondaryItem, setActiveSecondaryItem] = useState(
      secondaryNavTriggerCategories[primaryNavItems[0]]?.[0] || ""
  );
  
  const [mainPortfolioCashBalance, setMainPortfolioCashBalance] = useState(50000.00); 
  const [cryptoCashBalance, setCryptoCashBalance] = useState(15000.00);
  const [web3CashBalance, setWeb3CashBalance] = useState(20000.00);

  React.useEffect(() => {
    const firstPrimary = primaryNavItems[0] || "";
    setActivePrimaryItem(firstPrimary);
    const newSecondaryItems = secondaryNavTriggerCategories[firstPrimary] || [];
    setActiveSecondaryItem(newSecondaryItems[0] || '');
  }, [activeMode, primaryNavItems, secondaryNavTriggerCategories]);

  const handlePrimaryNavClick = (item: string) => {
    setActivePrimaryItem(item);
    const newSecondaryItems = secondaryNavTriggerCategories[item] || [];
    setActiveSecondaryItem(newSecondaryItems[0] || "");
  };
  
  const cryptoHoldings = useMemo(() => mockRealPortfolioHoldings, []);
  const web3PortfolioWatchlistItems = useMemo(() => [...mockWeb3Trending.slice(0, 3), ...mockWeb3DeFi.slice(0, 2)], []);

  // Determine what news and watchlist items to show
  let newsForView: NewsArticle[] = mockNewsArticles; 
  let itemsForWatchlist: Stock[] | undefined = undefined;
  let categoryWatchlistTitle: string = "";
  
  if (activeMode === 'Portfolio') {
      const isHoldingsView = activeSecondaryItem === "Holdings";
      const isPositionsView = activeSecondaryItem === "Positions";
      const isWatchlistView = activeSecondaryItem === "Portfolio Watchlist";

      if (activePrimaryItem === 'Crypto') {
          if (isHoldingsView) newsForView = getRelevantNewsForHoldings(cryptoHoldings, mockNewsArticles);
          if (isPositionsView) newsForView = getRelevantNewsForPositions(mockRealCryptoFutures, mockNewsArticles);
          if (isWatchlistView) {
              itemsForWatchlist = mockCryptoAssets.slice(0, 5);
              newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
          }
      } else if (activePrimaryItem === 'Web3') {
          if (isHoldingsView) newsForView = getRelevantNewsForHoldings(mockWeb3Holdings, mockNewsArticles);
          if (isWatchlistView) {
              itemsForWatchlist = web3PortfolioWatchlistItems;
              newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
          }
      }
  } else if (activeMode === 'Crypto') { // Crypto Mode Watchlists
    categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
    if (activePrimaryItem === "Spot") itemsForWatchlist = mockCryptoAssets;
    else if (activePrimaryItem === "Futures") itemsForWatchlist = mockCryptoFuturesForWatchlist;
    else if (activePrimaryItem === "Mutual Fund") itemsForWatchlist = [...mockCryptoMutualFunds, ...mockCryptoETFs];
    newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
  } else if (activeMode === 'Web3') { // Web3 Mode Watchlists
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
  }

  const renderPortfolioContent = () => {
    const isHoldingsView = activeSecondaryItem === "Holdings";
    const isPositionsView = activeSecondaryItem === "Positions";
    const isWatchlistView = activeSecondaryItem === "Portfolio Watchlist";

    if (activePrimaryItem === 'Crypto') {
      if (isHoldingsView) return <><CryptoHoldingsSection title="Crypto Wallet & Holdings" holdings={cryptoHoldings} cashBalance={cryptoCashBalance} setCashBalance={setCryptoCashBalance} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} isRealMode={true} /><NewsSection articles={newsForView} /></>;
      if (isPositionsView) return <div className="space-y-8"><CryptoFuturesSection positions={mockRealCryptoFutures} cashBalance={cryptoCashBalance} /><CryptoBasketSection /><NewsSection articles={newsForView} /></div>;
      if (isWatchlistView) return <div className="space-y-8"><WatchlistSection title="My Crypto Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride={'simCryptoWatchlist_real'}/><NewsSection articles={newsForView} /></div>;
    } else if (activePrimaryItem === 'Web3') {
      if (isHoldingsView) return <><CryptoHoldingsSection title="Web3 Wallet & Holdings" holdings={mockWeb3Holdings} cashBalance={web3CashBalance} setCashBalance={setWeb3CashBalance} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} isRealMode={true} /><NewsSection articles={newsForView} /></>;
      if (isWatchlistView) return <div className="space-y-8"><WatchlistSection title="My Web3 Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride={'simWeb3Watchlist_real'} /><NewsSection articles={newsForView} /></div>;
    }
    return null;
  }
  
  const renderMarketContent = () => {
      if(activeMode === 'Crypto') {
          return <div className="space-y-8"><WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true}/><NewsSection articles={newsForView} /></div>
      } else if (activeMode === 'Web3') {
           return <div className="space-y-8"><WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true} /><NewsSection articles={newsForView} /></div>
      }
      return null;
  }

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-8">
      <SubNav
        primaryNavItems={primaryNavItems}
        activePrimaryItem={activePrimaryItem}
        activeSecondaryItem={activeSecondaryItem}
        onPrimaryNavClick={handlePrimaryNavClick}
        onSecondaryNavClick={setActiveSecondaryItem}
        secondaryNavTriggerCategories={secondaryNavTriggerCategories}
      />
      
       {activeMode === 'Portfolio' ? renderPortfolioContent() : renderMarketContent()}

    </main>
  );
}
