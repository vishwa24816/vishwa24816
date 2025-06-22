"use client";

import { SubNav } from '@/components/dashboard/SubNav';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { WatchlistSection } from '@/components/dashboard/WatchlistSection';
import { CryptoHoldingsSection } from '@/components/dashboard/CryptoHoldingsSection';
import { CryptoIntradayPositionsSection } from '@/components/dashboard/CryptoIntradayPositionsSection';
import { CryptoFuturesSection } from '@/components/dashboard/CryptoFuturesSection';

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

interface RealDashboardProps {
  searchMode: 'Fiat' | 'Exchange' | 'Web3';
}

export function RealDashboard({ searchMode }: RealDashboardProps) {
  const { primaryNavItems, secondaryNavTriggerCategories } = useMemo(() => {
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
      "Crypto Spot": ["Top watchlist"],
      "Crypto Futures": ["Top watchlist"],
      "Crypto Mutual Fund": ["Top watchlist"],
    };
    return { primaryNavItems: exchangePrimaryNav, secondaryNavTriggerCategories: exchangeSecondaryNav };
  }, [searchMode]);


  const [activePrimaryItem, setActivePrimaryItem] = useState("Portfolio");
  const [activeSecondaryItem, setActiveSecondaryItem] = useState("Holdings");
  
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
    setActiveSecondaryItem(newSecondaryItems[0] || "");
  };
  
  const exchangeHoldings = useMemo(() => mockRealPortfolioHoldings, []);
  const web3PortfolioWatchlistItems = useMemo(() => [...mockWeb3Trending.slice(0, 3), ...mockWeb3DeFi.slice(0, 2)], []);

  // Determine what news and watchlist items to show
  let newsForView: NewsArticle[] = mockNewsArticles; 
  let itemsForWatchlist: Stock[] | undefined = undefined;
  let categoryWatchlistTitle: string = "";
  
  const isWeb3 = searchMode === 'Web3';

  if (activePrimaryItem === "Portfolio") {
      if (activeSecondaryItem === "Holdings") {
          const holdings = isWeb3 ? mockWeb3Holdings : exchangeHoldings;
          newsForView = getRelevantNewsForHoldings(holdings, mockNewsArticles);
      } else if (activeSecondaryItem === "Positions") {
          newsForView = getRelevantNewsForPositions(mockRealCryptoIntradayPositions, mockRealCryptoFutures, mockNewsArticles);
      } else if (activeSecondaryItem === "Portfolio Watchlist") {
          itemsForWatchlist = isWeb3 ? web3PortfolioWatchlistItems : mockCryptoAssets.slice(0, 5);
          newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
      }
  } else if (!isWeb3) { // Exchange Mode Watchlists
    categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
    if (activePrimaryItem === "Crypto Spot") itemsForWatchlist = mockCryptoAssets;
    else if (activePrimaryItem === "Crypto Futures") itemsForWatchlist = mockCryptoFuturesForWatchlist;
    else if (activePrimaryItem === "Crypto Mutual Fund") itemsForWatchlist = [...mockCryptoMutualFunds, ...mockCryptoETFs];
    newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
  } else { // Web3 Mode Watchlists
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
      
      {activePrimaryItem === 'Portfolio' && activeSecondaryItem === 'Holdings' && (
        <>
          <CryptoHoldingsSection 
            title={isWeb3 ? "Web3 Wallet & Holdings" : "Crypto Wallet & Holdings"} 
            holdings={isWeb3 ? mockWeb3Holdings : exchangeHoldings} 
            cashBalance={isWeb3 ? web3CashBalance : exchangeCashBalance} 
            setCashBalance={isWeb3 ? setWeb3CashBalance : setExchangeCashBalance} 
            mainPortfolioCashBalance={mainPortfolioCashBalance} 
            setMainPortfolioCashBalance={setMainPortfolioCashBalance} 
            isRealMode={true} 
          />
          <NewsSection articles={newsForView} />
        </>
      )}
      
      {activePrimaryItem === 'Portfolio' && activeSecondaryItem === 'Positions' && !isWeb3 && (
        <div className="space-y-8">
          <CryptoIntradayPositionsSection positions={mockRealCryptoIntradayPositions} />
          <CryptoFuturesSection positions={mockRealCryptoFutures} />
          <NewsSection articles={newsForView} />
        </div>
      )}

      {activePrimaryItem === 'Portfolio' && activeSecondaryItem === 'Portfolio Watchlist' && (
        <div className="space-y-8">
          <WatchlistSection 
            title={isWeb3 ? "My Web3 Watchlist" : "My Crypto Watchlist"}
            defaultInitialItems={itemsForWatchlist} 
            localStorageKeyOverride={isWeb3 ? 'simWeb3Watchlist_real' : 'simCryptoWatchlist_real'}
          />
          <NewsSection articles={newsForView} />
        </div>
      )}

      {(activePrimaryItem === 'Crypto Spot' || activePrimaryItem === 'Crypto Futures' || activePrimaryItem === 'Crypto Mutual Fund') && !isWeb3 && (
        <div className="space-y-8">
          <WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true}/>
          <NewsSection articles={newsForView} />
        </div>
      )}

      {isWeb3 && ['Gainers', 'Trending', 'Memes', 'DeFi', 'AI'].includes(activePrimaryItem) && (
        <div className="space-y-8">
            <WatchlistSection 
                title={categoryWatchlistTitle}
                displayItems={itemsForWatchlist}
                isPredefinedList={true} 
            />
            <NewsSection articles={newsForView} />
        </div>
      )}
    </main>
  );
}
