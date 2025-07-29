
"use client";

import { SubNav } from '@/components/shared/SubNav';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { WatchlistSection } from '@/components/dashboard/WatchlistSection';
import { CryptoHoldingsSection } from '@/components/dashboard/CryptoHoldingsSection';
import { CryptoFuturesSection } from '@/components/dashboard/CryptoFuturesSection';
import { CryptoBasketSection } from './CryptoBasketSection';
import { CryptoOptionChain } from '@/components/dashboard/CryptoOptionChain';
import { StrategyBuilder } from '@/components/dashboard/StrategyBuilder';
import { ReadymadeStrategiesSection } from '@/components/dashboard/ReadymadeStrategiesSection';
import { MarketMovers } from './MarketMovers';

import React, { useState, useMemo, useEffect } from 'react';
import type { PortfolioHolding, NewsArticle, CryptoFuturePosition, Stock, SelectedOptionLeg } from '@/types';
import { 
  mockNewsArticles, 
  mockCryptoAssets,
  mockCryptoFuturesForWatchlist,
  mockCryptoMutualFunds,
  mockCryptoETFs,
  mockRealPortfolioHoldings,
  mockRealCryptoFutures,
} from '@/lib/mockData';
import { mockCryptoOptionsForWatchlist } from '@/lib/mockData/cryptoOptionsWatchlist';
import type { WalletMode } from './CryptoHoldingsSection';
import { FundTransferDialog } from '../shared/FundTransferDialog';
import { useToast } from '@/hooks/use-toast';

// Helper functions (could be moved to a utils file)
function getRelevantNewsForHoldings(holdings: PortfolioHolding[], allNews: NewsArticle[]): NewsArticle[] {
  if (!holdings.length || !allNews.length) return [];
  const keywords = new Set(holdings.flatMap(h => [h.name.toLowerCase(), h.symbol?.toLowerCase()]).filter(Boolean));
  return allNews.filter(news => Array.from(keywords).some(keyword => (keyword as string) && news.headline.toLowerCase().includes(keyword as string)));
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
  return allNews.filter(news => Array.from(keywords).some(keyword => (keyword as string) && news.headline.toLowerCase().includes(keyword as string)));
}

function getRelevantNewsForWatchlistItems(items: Stock[] | undefined, allNews: NewsArticle[]): NewsArticle[] {
  if (!items || !items.length || !allNews.length) return [];
  const keywords = new Set(items.flatMap(i => [i.name.toLowerCase(), i.symbol?.toLowerCase()]).filter(Boolean));
  return allNews.filter(news => Array.from(keywords).some(keyword => (keyword as string) && news.headline.toLowerCase().includes(keyword as string)));
}

interface RealDashboardProps {
  activeMode: 'Portfolio' | 'Fiat' | 'Crypto' | 'Web3';
  walletMode: WalletMode;
  setWalletMode: (mode: WalletMode) => void;
  onAssetClick: (asset: Stock) => void;
}

export function RealDashboard({ activeMode, walletMode, setWalletMode, onAssetClick }: RealDashboardProps) {
   const { toast } = useToast();
   const { primaryNavItems, secondaryNavTriggerCategories } = useMemo(() => {
    if (activeMode === 'Portfolio') {
       return {
            primaryNavItems: ["Crypto"],
            secondaryNavTriggerCategories: {
                Crypto: ["Holdings", "Positions", "Portfolio Watchlist"],
            }
        }
    }
    
    // Default to Crypto mode
    const cryptoPrimaryNav = [
      "Spot", "Futures", "Options", "Mutual Fund"
    ];
    const cryptoSecondaryNav: Record<string, string[]> = {
      "Spot": ["Top watchlist"],
      "Futures": ["Top watchlist"],
      "Options": ["Dashboard", "Custom", "Readymade"],
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
  const [strategyLegs, setStrategyLegs] = useState<SelectedOptionLeg[]>([]);
  const [isFundTransferDialogOpen, setIsFundTransferDialogOpen] = useState(false);
  const [transferDirection, setTransferDirection] = useState<'toCrypto' | 'fromCrypto'>('toCrypto');

  useEffect(() => {
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

  const handleOpenFundTransferDialog = (direction: 'toCrypto' | 'fromCrypto') => {
    setTransferDirection(direction);
    setIsFundTransferDialogOpen(true);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleTransferConfirm = (amount: number, direction: 'toCrypto' | 'fromCrypto') => {
    if (direction === 'toCrypto') {
      setMainPortfolioCashBalance((prev: number) => prev - amount);
      setCryptoCashBalance((prev: number) => prev + amount);
      toast({ title: "Transfer Successful", description: `${formatCurrency(amount)} transferred to Crypto Wallet.` });
    } else { // fromCrypto
      setMainPortfolioCashBalance((prev: number) => prev + amount);
      setCryptoCashBalance((prev: number) => prev - amount);
      toast({ title: "Transfer Successful", description: `${formatCurrency(amount)} transferred to Main Portfolio.` });
    }
  };
  
  const cryptoHoldings = useMemo(() => mockRealPortfolioHoldings, []);

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
      }
  } else if (activeMode === 'Crypto') { // Crypto Mode Watchlists
    if (activePrimaryItem !== "Options") {
        categoryWatchlistTitle = `${activePrimaryItem} - ${activeSecondaryItem}`;
        if (activePrimaryItem === "Spot") itemsForWatchlist = mockCryptoAssets;
        else if (activePrimaryItem === "Futures") itemsForWatchlist = mockCryptoFuturesForWatchlist;
        else if (activePrimaryItem === "Mutual Fund") itemsForWatchlist = [...mockCryptoMutualFunds, ...mockCryptoETFs];
        newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
    } else {
        newsForView = mockNewsArticles;
    }
  }

  const renderPortfolioContent = () => {
    const isHoldingsView = activeSecondaryItem === "Holdings";
    const isPositionsView = activeSecondaryItem === "Positions";
    const isWatchlistView = activeSecondaryItem === "Portfolio Watchlist";

    if (activePrimaryItem === 'Crypto') {
      if (isHoldingsView) return <><CryptoHoldingsSection title="Crypto Wallet & Holdings" holdings={cryptoHoldings} cashBalance={cryptoCashBalance} setCashBalance={setCryptoCashBalance} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} isRealMode={true} walletMode={walletMode} setWalletMode={setWalletMode} onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></>;
      if (isPositionsView) return <div className="space-y-8"><CryptoFuturesSection positions={mockRealCryptoFutures} cashBalance={cryptoCashBalance} /><CryptoBasketSection /><NewsSection articles={newsForView} /></div>;
      if (isWatchlistView) return <div className="space-y-8"><WatchlistSection title="My Crypto Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride={'simCryptoWatchlist_real'} onAssetClick={onAssetClick}/><NewsSection articles={newsForView} /></div>;
    }
    return null;
  }
  
  const renderMarketContent = () => {
      if(activeMode === 'Crypto') {
          if (activePrimaryItem === "Options") {
            if (activeSecondaryItem === 'Dashboard') return <div className="space-y-8"><MarketMovers stocks={mockCryptoOptionsForWatchlist} displayMode="full" category="Crypto Options" onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></div>;
            if (activeSecondaryItem === "Custom") return ( <div className="space-y-8"><CryptoOptionChain onAddLeg={(leg) => setStrategyLegs(prev => [...prev, leg])} />{strategyLegs.length > 0 && <StrategyBuilder legs={strategyLegs} setLegs={setStrategyLegs} />}<NewsSection articles={newsForView} /></div>);
            if (activeSecondaryItem === "Readymade") return ( <div className="space-y-8"><ReadymadeStrategiesSection onStrategySelect={(legs) => setStrategyLegs(legs)} />{strategyLegs.length > 0 && <StrategyBuilder legs={strategyLegs} setLegs={setStrategyLegs} />}<NewsSection articles={newsForView} /></div> );
            return null
        }
          return <div className="space-y-8"><WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true} onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></div>
      }
      return null;
  }

  return (
    <>
    <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-8">
      <SubNav
        primaryNavItems={primaryNavItems}
        activePrimaryItem={activePrimaryItem}
        activeSecondaryItem={activeSecondaryItem}
        onPrimaryNavClick={handlePrimaryNavClick}
        onSecondaryNavClick={setActiveSecondaryItem}
        secondaryNavTriggerCategories={secondaryNavTriggerCategories}
        walletMode={walletMode}
        activeMode={activeMode}
      />
      
       {activeMode === 'Portfolio' ? renderPortfolioContent() : renderMarketContent()}

    </main>
     <FundTransferDialog
        isOpen={isFundTransferDialogOpen}
        onOpenChange={setIsFundTransferDialogOpen}
        transferDirection={transferDirection}
        mainPortfolioCashBalance={mainPortfolioCashBalance}
        cryptoCashBalance={cryptoCashBalance}
        onTransferConfirm={handleTransferConfirm}
        currencyMode={'INR'}
      />
    </>
  );
}
