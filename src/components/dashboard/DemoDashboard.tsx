

"use client";

import { SubNav } from '@/components/shared/SubNav';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { WatchlistSection } from '@/components/dashboard/WatchlistSection';
import { CryptoHoldingsSection } from '@/components/dashboard/CryptoHoldingsSection';
import { FiatHoldingsSection } from '@/components/dashboard/FiatHoldingsSection';
import { CryptoFuturesSection } from '@/components/dashboard/CryptoFuturesSection';
import { PackageOpen, ShieldCheck } from 'lucide-react';
import { IntradayPositionsSection } from '@/components/dashboard/IntradayPositionsSection';
import { FoPositionsSection } from '@/components/dashboard/FoPositionsSection';
import { FoBasketSection } from '@/components/dashboard/FoBasketSection';
import { FiatOptionChain } from '@/components/dashboard/FiatOptionChain';
import { CryptoOptionChain } from '@/components/dashboard/CryptoOptionChain';
import { ReadymadeStrategiesSection } from '@/components/dashboard/ReadymadeStrategiesSection';
import { StrategyBuilder } from '@/components/dashboard/StrategyBuilder';
import { MarketOverview } from './MarketOverview';
import { CryptoBasketSection } from './CryptoBasketSection';
import { MarketMovers } from './MarketMovers';
import { WealthHoldingsSection } from './WealthHoldingsSection';
import { VolumeOiSection } from './VolumeOiSection';
import { OverallPortfolioSummary } from './OverallPortfolioSummary';
import { OpenPositionsDisplay } from '../orders/OpenPositionsDisplay';
import { AddFundsDialog } from '@/components/shared/AddFundsDialog';
import { IpoSection } from './IpoSection';


import React, { useState, useMemo, useEffect } from 'react';
import type { PortfolioHolding, IntradayPosition, FoPosition, CryptoFuturePosition, Stock, SelectedOptionLeg, NewsArticle } from '@/types';
import { mockPortfolioHoldings } from '@/lib/mockData/portfolioHoldings';
import { mockNewsArticles } from '@/lib/mockData/newsArticles';
import { mockIntradayPositions } from '@/lib/mockData/intradayPositions';
import { mockFoPositions } from '@/lib/mockData/foPositions';
import { mockCryptoFutures } from '@/lib/mockData/cryptoFutures';
import { mockCryptoAssets } from '@/lib/mockData/cryptoAssets';
import { mockStocks } from '@/lib/mockData/stocks';
import { mockIndexFuturesForWatchlist, mockStockFuturesForWatchlist } from '@/lib/mockData/futuresWatchlistData';
import { mockMutualFunds } from '@/lib/mockData/mutualFunds';
import { mockBonds } from '@/lib/mockData/bonds';
import { mockCryptoFuturesForWatchlist } from '@/lib/mockData/cryptoFuturesWatchlist';
import { mockCryptoMutualFunds } from '@/lib/mockData/cryptoMutualFunds';
import { mockCryptoETFs } from '@/lib/mockData/cryptoETFs';
import { mockWeb3AI } from '@/lib/mockData/web3AI';
import { mockWeb3DeFi } from '@/lib/mockData/web3DeFi';
import { mockWeb3Trending } from '@/lib/mockData/web3Trending';
import { mockWeb3Memes } from '@/lib/mockData/web3Memes';
import { mockWeb3Holdings } from '@/lib/mockData/web3Holdings';
import { mockMarketIndices } from '@/lib/mockData/marketIndices';
import { mockOptionsForWatchlist } from '@/lib/mockData/optionsWatchlistData';
import { mockLifeInsurance } from '@/lib/mockData/lifeInsurance';
import { mockHealthInsurance } from '@/lib/mockData/healthInsurance';
import { mockCarInsurance } from '@/lib/mockData/carInsurance';
import { mockBikeInsurance } from '@/lib/mockData/bikeInsurance';
import { mockOtherInsurance } from '@/lib/mockData/otherInsurance';
import { mockCryptoOptionsForWatchlist } from '@/lib/mockData/cryptoOptionsWatchlist';
import { mockCryptoIndices } from '@/lib/mockData/cryptoIndices';
import { mockUsStocks } from '@/lib/mockData/usStocks';
import type { WalletMode } from '@/components/dashboard/CryptoHoldingsSection';
import Image from 'next/image';
import { FundTransferDialog } from '../shared/FundTransferDialog';
import { useToast } from '@/hooks/use-toast';

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
    if (h.type === 'Mutual Fund' || h.type === 'Bond' || h.type === 'Crypto') {
        const nameParts = h.name.split(/[\s-]+/);
        keywords.push(...nameParts.map(part => part.toLowerCase()));
        if (h.symbol) { 
            const symbolParts = h.symbol.match(/[A-Z]+|[0-9.]+/g) || [];
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
    if (Array.from(holdingKeywords).some(keyword => keyword && (keyword as string).includes(headlineLower))) {
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
    if (Array.from(positionKeywords).some(keyword => keyword && (keyword as string).includes(headlineLower))) {
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
    
    // Improved keyword extraction for complex financial instruments
    const nameParts = item.name.split(/[\s-]+/); 
    keywords.push(...nameParts.map(part => part.toLowerCase()));
    if ('symbol' in item && item.symbol) { 
        const symbolParts = item.symbol.match(/[A-Z]+|[0-9.]+/g) || [];
        keywords.push(...symbolParts.map(part => part.toLowerCase()));
    }

    return keywords;
  }).filter(Boolean).reduce((acc, keyword) => {
    acc.add(keyword);
    return acc;
  }, new Set<string>());


  allNews.forEach(news => {
    const headlineLower = news.headline.toLowerCase();
    if (Array.from(itemKeywords).some(keyword => keyword && (keyword as string).includes(headlineLower))) {
      relevantNews.push(news);
    }
  });
  return relevantNews;
}

const usePersistentState = (key: string, defaultValue: number): [number, React.Dispatch<React.SetStateAction<number>>] => {
    const [state, setState] = useState(() => {
        if (typeof window === 'undefined') {
            return defaultValue;
        }
        try {
            const storedValue = window.localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error(error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(error);
        }
    }, [key, state]);

    return [state, setState];
};

interface DemoDashboardProps {
  activeMode: 'Portfolio' | 'Fiat' | 'Wealth' | 'Crypto' | 'Web3';
  onModeChange: (mode: 'Portfolio' | 'Fiat' | 'Wealth' | 'Crypto' | 'Web3') => void;
  walletMode: WalletMode;
  setWalletMode: React.Dispatch<React.SetStateAction<WalletMode>>;
  onAssetClick: (asset: Stock) => void;
}

export function DemoDashboard({ activeMode, onModeChange, walletMode, setWalletMode, onAssetClick }: DemoDashboardProps) {
    const { toast } = useToast();
    const { primaryNavItems, secondaryNavTriggerCategories } = useMemo(() => {
    if (activeMode === 'Portfolio') {
        return {
            primaryNavItems: ["Overview", "Fiat", "Crypto", "Pledged Holdings"],
            secondaryNavTriggerCategories: {
                Overview: [],
                Fiat: ["Fiat Holdings", "Wealth Holdings", "Positions", "Portfolio Watchlist"],
                Crypto: ["Holdings", "Positions", "Portfolio Watchlist"],
                "Pledged Holdings": [],
            }
        }
    }
    if (activeMode === 'Fiat') {
        const watchlistNav = ["Top watchlist", ...Array.from({ length: 3 }, (_, i) => `Watchlist ${i + 1}`)];
        return {
            primaryNavItems: ["Indian Stocks", "US Stocks", "Futures", "Options", "IPO"],
            secondaryNavTriggerCategories: {
                "Indian Stocks": watchlistNav,
                "US Stocks": watchlistNav,
                "Futures": ["Index Futures", "Stock Futures"],
                "Options": ["Dashboard", "Custom", "Readymade"],
                "IPO": ["All", "Upcoming", "Open", "Applied"],
            }
        };
    }
    if (activeMode === 'Wealth') {
        const watchlistNav = ["Top watchlist", ...Array.from({ length: 3 }, (_, i) => `Watchlist ${i + 1}`)];
        return {
            primaryNavItems: ["Mutual Funds", "Bonds", "Insurance"],
            secondaryNavTriggerCategories: {
                "Mutual Funds": watchlistNav,
                "Bonds": watchlistNav,
                "Insurance": ["Life Insurance", "Health Insurance", "Car Insurance", "Bike Insurance", "Other Insurance"],
            }
        };
    }
     if (activeMode === 'Web3') {
        return {
            primaryNavItems: ["Trending", "AI", "DeFi", "Memes", "NFT"],
            secondaryNavTriggerCategories: {
                Trending: [],
                AI: [],
                DeFi: [],
                Memes: [],
                NFT: [],
            }
        };
    }
    
    // Crypto mode
    const cryptoPrimaryNav = [
      "Spot", "Futures", "Options", "Mutual Fund"
    ];
    const cryptoSecondaryNav: Record<string, string[]> = {
      "Spot": ["Top watchlist", ...Array.from({ length: 3 }, (_, i) => `Watchlist ${i + 1}`)],
      "Futures": ["Top watchlist", ...Array.from({ length: 3 }, (_, i) => `Watchlist ${i + 1}`)],
      "Options": ["Dashboard", "Custom", "Readymade"],
      "Mutual Fund": ["Top watchlist", ...Array.from({ length: 3 }, (_, i) => `Watchlist ${i + 1}`)],
    };
    return { primaryNavItems: cryptoPrimaryNav, secondaryNavTriggerCategories: cryptoSecondaryNav };
  }, [activeMode]);


  const [activePrimaryItem, setActivePrimaryItem] = useState(primaryNavItems[0]);
  const [activeSecondaryItem, setActiveSecondaryItem] = useState(
    secondaryNavTriggerCategories[primaryNavItems[0]]?.[0] || ""
  );
  
  const [mainPortfolioCashBalance, setMainPortfolioCashBalance] = usePersistentState('mainPortfolioCashBalance', 50000.00);
  const [cryptoCashBalance, setCryptoCashBalance] = usePersistentState('cryptoCashBalance', 15000.00);
  const [strategyLegs, setStrategyLegs] = useState<SelectedOptionLeg[]>([]);
  const [isFundTransferDialogOpen, setIsFundTransferDialogOpen] = useState(false);
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false);
  const [transferDirection, setTransferDirection] = useState<'toCrypto' | 'fromCrypto'>('toCrypto');

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

  const handleAddWithdrawConfirm = (amount: number, type: 'add' | 'withdraw') => {
      if (type === 'add') {
        setMainPortfolioCashBalance((prev: number) => prev + amount);
        toast({ title: "Funds Added", description: `${formatCurrency(amount)} added to your main portfolio.` });
      } else {
        setMainPortfolioCashBalance((prev: number) => prev - amount);
        toast({ title: "Withdrawal Successful", description: `${formatCurrency(amount)} withdrawn from your main portfolio.` });
      }
  };


  useEffect(() => {
    const firstPrimary = primaryNavItems[0] || "";
    setActivePrimaryItem(firstPrimary);
    const newSecondaryItems = secondaryNavTriggerCategories[firstPrimary] || [];
    setActiveSecondaryItem(newSecondaryItems[0] || '');
  }, [activeMode, primaryNavItems, secondaryNavTriggerCategories]);
  
   useEffect(() => {
    let theme = 'portfolio'; // Default theme
    if (activeMode === 'Fiat') {
        const themeMapping: { [key: string]: string } = {
            'Indian Stocks': 'orange',
            'US Stocks': 'brown', // This is now red
            'Futures': 'caramel', // This is now brown
            'Options': 'yellow',
            'IPO': 'red'
        };
        theme = themeMapping[activePrimaryItem] || 'fiat';
    } else if (activeMode === 'Wealth') {
        const themeMapping: { [key: string]: string } = {
            'Mutual Funds': 'mutual_funds',
            'Bonds': 'bonds',
            'Insurance': 'insurance', // This is now caramel
        };
        theme = themeMapping[activePrimaryItem] || 'wealth';
    } else if (activeMode === 'Crypto') {
        const themeMapping: { [key: string]: string } = {
            'Spot': 'spot',
            'Futures': 'crypto_futures',
            'Options': 'crypto_options',
            'Mutual Fund': 'crypto_mutual_fund',
        };
        theme = themeMapping[activePrimaryItem] || 'crypto';
    } else if (activeMode === 'Web3') {
        const themeMapping: { [key: string]: string } = {
            'Trending': 'web3',
            'AI': 'ai',
            'DeFi': 'defi',
            'Memes': 'memes',
            'NFT': 'nft',
        };
        theme = themeMapping[activePrimaryItem.split(' ')[0]] || 'web3';
    } else {
      theme = activeMode.toLowerCase();
    }
    document.documentElement.setAttribute('data-theme', theme);
  }, [activeMode, activePrimaryItem]);


  const handlePrimaryNavClick = (item: string) => {
    setActivePrimaryItem(item);
    const newSecondaryItems = secondaryNavTriggerCategories[item] || [];
    setActiveSecondaryItem(newSecondaryItems[0] || "");
  };

  const handleSecondaryNavClick = (item: string) => {
    setActiveSecondaryItem(item);
  };
  
  const handleCategoryClick = (category: 'Fiat' | 'Crypto' | 'Wealth' | 'Pledged') => {
      onModeChange('Portfolio');
      if (category === 'Fiat') {
          setActivePrimaryItem('Fiat');
          setActiveSecondaryItem('Fiat Holdings');
      } else if (category === 'Wealth') {
          setActivePrimaryItem('Fiat');
          setActiveSecondaryItem('Wealth Holdings');
      } else if (category === 'Crypto') {
          setActivePrimaryItem('Crypto');
          setActiveSecondaryItem('Holdings');
      } else if (category === 'Pledged') {
          setActivePrimaryItem('Pledged Holdings');
          setActiveSecondaryItem('');
      }
  };

  const fiatHoldings = useMemo(() => mockPortfolioHoldings.filter(h => h.type === 'Stock' || h.type === 'ETF'), []);
  const wealthHoldings = useMemo(() => mockPortfolioHoldings.filter(h => h.type === 'Mutual Fund' || h.type === 'Bond'), []);
  const cryptoAndWeb3Holdings = useMemo(() => [
    ...mockPortfolioHoldings.filter(h => h.type === 'Crypto'),
    ...mockWeb3Holdings
  ], []);
  
  let newsForView: NewsArticle[] = mockNewsArticles; 
  let itemsForWatchlist: Stock[] | undefined = undefined;
  let categoryWatchlistTitle: string = "";

  if (activeMode === 'Portfolio') {
      const isFiatHoldingsView = activeSecondaryItem === "Fiat Holdings";
      const isWealthHoldingsView = activeSecondaryItem === "Wealth Holdings";
      const isCryptoHoldingsView = activeSecondaryItem === "Holdings";
      const isPositionsView = activeSecondaryItem === "Positions";
      const isWatchlistView = activeSecondaryItem === "Portfolio Watchlist";

      if (activePrimaryItem === 'Fiat') {
          if (isFiatHoldingsView) newsForView = getRelevantNewsForHoldings(fiatHoldings, mockNewsArticles);
          if (isWealthHoldingsView) newsForView = getRelevantNewsForHoldings(wealthHoldings, mockNewsArticles);
          if (isPositionsView) newsForView = getRelevantNewsForPositions(mockIntradayPositions, [], mockFoPositions, mockNewsArticles);
          if (isWatchlistView) {
            itemsForWatchlist = mockStocks.slice(0, 5);
            newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
          }
      } else if (activePrimaryItem === 'Crypto') {
          if (isCryptoHoldingsView) newsForView = getRelevantNewsForHoldings(cryptoAndWeb3Holdings, mockNewsArticles);
          if (isPositionsView) newsForView = getRelevantNewsForPositions([], mockCryptoFutures, [], mockNewsArticles);
          if (isWatchlistView) {
              itemsForWatchlist = mockCryptoAssets.slice(0, 5);
              newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
          }
      }
  } else if (activeMode === 'Fiat') {
    const isIndianStockView = activePrimaryItem === "Indian Stocks";
    const isUsStockView = activePrimaryItem === "US Stocks";
    const isTopWatchlistView = (isIndianStockView || isUsStockView) && activeSecondaryItem.startsWith("Top watchlist");
    const isCategoryNumberedWatchlistView = (isIndianStockView || isUsStockView) && !!activeSecondaryItem.match(/^Watchlist \d+$/);
    
    if (activePrimaryItem === 'Futures') {
        if(activeSecondaryItem === 'Index Futures') {
            itemsForWatchlist = mockIndexFuturesForWatchlist;
            categoryWatchlistTitle = 'Top Indices';
        } else if (activeSecondaryItem === 'Stock Futures') {
            itemsForWatchlist = mockStockFuturesForWatchlist;
            categoryWatchlistTitle = 'Top Stock Futures';
        }
        newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
    } else if (isTopWatchlistView) {
        categoryWatchlistTitle = 'Top Stocks';
        itemsForWatchlist = isIndianStockView ? mockStocks : mockUsStocks;
        newsForView = getRelevantNewsForWatchlistItems(itemsForWatchlist, mockNewsArticles);
    } else if (isCategoryNumberedWatchlistView) {
        itemsForWatchlist = [];
        newsForView = mockNewsArticles;
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
  } else if (activeMode === 'Web3' || activeMode === 'Wealth') {
      newsForView = mockNewsArticles;
  }
  
  const allHoldings = useMemo(() => [...fiatHoldings, ...wealthHoldings, ...cryptoAndWeb3Holdings], [fiatHoldings, wealthHoldings, cryptoAndWeb3Holdings]);
  
    const { totalPortfolioValue, unrealisedPnl, investedMargin } = useMemo(() => {
        let holdingsValue = 0
        let holdingsInvestment = 0
        allHoldings.forEach(h => {
            holdingsValue += h.currentValue || 0;
            holdingsInvestment += (h.avgCostPrice || 0) * (h.quantity || 0);
        });

        const intradayPnl = mockIntradayPositions.reduce((acc, p) => acc + p.pAndL, 0);

        const foPnl = mockFoPositions.reduce((acc, p) => acc + p.pAndL, 0);
        
        const cryptoFuturesPnl = mockCryptoFutures.reduce((acc, p) => acc + p.unrealizedPnL, 0);

        const totalPnl = (holdingsValue - holdingsInvestment) + intradayPnl + foPnl + cryptoFuturesPnl;
        
        const intradayInvestment = mockIntradayPositions.reduce((acc, p) => acc + (p.avgPrice * p.quantity), 0);
        const foInvestment = mockFoPositions.reduce((acc, p) => acc + (p.avgPrice * p.lots * p.quantityPerLot), 0);
        const cryptoFuturesInvestment = mockCryptoFutures.reduce((acc, p) => acc + (p.margin || 0), 0);
        const totalInvestment = holdingsInvestment + intradayInvestment + foInvestment + cryptoFuturesInvestment;
        
        return {
            totalPortfolioValue: totalInvestment + totalPnl,
            unrealisedPnl: totalPnl,
            investedMargin: totalInvestment,
        };
    }, [allHoldings]);

  const renderPortfolioContent = () => {
    const isFiatHoldingsView = activeSecondaryItem === "Fiat Holdings";
    const isWealthHoldingsView = activeSecondaryItem === "Wealth Holdings";
    const isCryptoHoldingsView = activeSecondaryItem === "Holdings";
    const isPositionsView = activeSecondaryItem === "Positions";
    const isWatchlistView = activeSecondaryItem === "Portfolio Watchlist";
    
    if (activePrimaryItem === 'Overview') {
        return (
            <div className="space-y-8">
                <OverallPortfolioSummary 
                    totalPortfolioValue={totalPortfolioValue} 
                    unrealisedPnl={unrealisedPnl}
                    availableMargin={mainPortfolioCashBalance + cryptoCashBalance} // simplified
                    investedMargin={investedMargin}
                    onAddFunds={() => setIsAddFundsDialogOpen(true)}
                    onWithdrawFunds={() => setIsAddFundsDialogOpen(true)}
                />
                <OpenPositionsDisplay 
                    fiatHoldings={fiatHoldings}
                    wealthHoldings={wealthHoldings}
                    cryptoHoldings={cryptoAndWeb3Holdings}
                    intradayPositions={mockIntradayPositions}
                    foPositions={mockFoPositions}
                    cryptoFutures={mockCryptoFutures}
                    onCategoryClick={handleCategoryClick}
                    onAssetClick={onAssetClick}
                />
            </div>
        )
    }

    if (activePrimaryItem === 'Pledged Holdings') {
        const pledgedFiatHoldings = fiatHoldings.slice(0, 2); 
        const pledgedWealthHoldings = wealthHoldings.slice(0, 2);
        const pledgedCryptoHoldings = cryptoAndWeb3Holdings.slice(0, 1);
        const allPledged = [...pledgedFiatHoldings, ...pledgedWealthHoldings, ...pledgedCryptoHoldings];

        const totalPledgedValue = allPledged.reduce((acc, h) => acc + h.currentValue, 0);
        const totalPledgedInvestment = allPledged.reduce((acc, h) => acc + (h.quantity * h.avgCostPrice), 0);
        const unrealisedPnl = totalPledgedValue - totalPledgedInvestment;
        // Mock margin values
        const availableMargin = allPledged.reduce((acc, h) => acc + (h.currentValue * 0.8), 0); // 80% of value as margin
        const investedMargin = totalPledgedInvestment;
        
        return (
            <div className="space-y-8">
                <OverallPortfolioSummary 
                    title="Pledge Overview"
                    totalPortfolioValue={totalPledgedValue} 
                    unrealisedPnl={unrealisedPnl}
                    availableMargin={availableMargin}
                    investedMargin={investedMargin}
                    onAddFunds={() => setIsAddFundsDialogOpen(true)}
                    onWithdrawFunds={() => setIsAddFundsDialogOpen(true)}
                />
                <FiatHoldingsSection title="Pledged Fiat Holdings" holdings={pledgedFiatHoldings} intradayPositions={[]} foPositions={[]} mainPortfolioCashBalance={0} setMainPortfolioCashBalance={() => {}} cryptoCashBalance={0} setCryptoCashBalance={() => {}} isPledged={true} onAssetClick={onAssetClick} onAddFunds={() => setIsAddFundsDialogOpen(true)} />
                <WealthHoldingsSection holdings={pledgedWealthHoldings} isPledged={true} onAssetClick={onAssetClick} />
                <CryptoHoldingsSection title="Pledged Crypto Holdings" holdings={pledgedCryptoHoldings} cashBalance={0} setCashBalance={() => {}} mainPortfolioCashBalance={0} setMainPortfolioCashBalance={() => {}} isRealMode={false} isPledged={true} walletMode={walletMode} setWalletMode={setWalletMode} onAssetClick={onAssetClick} />
            </div>
        )
    }

    switch (activePrimaryItem) {
        case 'Fiat':
            if (isFiatHoldingsView) return <><FiatHoldingsSection holdings={fiatHoldings} intradayPositions={[]} foPositions={[]} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} cryptoCashBalance={cryptoCashBalance} setCryptoCashBalance={setCryptoCashBalance} onAssetClick={onAssetClick} onAddFunds={() => setIsAddFundsDialogOpen(true)} /><NewsSection articles={newsForView} /></>;
            if (isWealthHoldingsView) return <><WealthHoldingsSection holdings={wealthHoldings} onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></>;
            if (isPositionsView) return <div className="space-y-8"><IntradayPositionsSection onAssetClick={onAssetClick}/><FoPositionsSection onAssetClick={onAssetClick}/><FoBasketSection /><NewsSection articles={newsForView} /></div>;
            if (isWatchlistView) return <div className="space-y-8"><WatchlistSection title="My Fiat Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride="simFiatWatchlist" onAssetClick={onAssetClick}/><NewsSection articles={newsForView} /></div>;
            return null;
        case 'Crypto':
            if (isCryptoHoldingsView) return <><CryptoHoldingsSection title="Crypto & Web3 Wallet" holdings={cryptoAndWeb3Holdings} cashBalance={cryptoCashBalance} setCashBalance={setCryptoCashBalance} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} isRealMode={false} walletMode={walletMode} setWalletMode={setWalletMode} onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></>;
            if (isPositionsView) return <div className="space-y-8"><CryptoFuturesSection positions={mockCryptoFutures} cashBalance={cryptoCashBalance} /><CryptoBasketSection /><NewsSection articles={newsForView} /></div>;
            if (isWatchlistView) return <div className="space-y-8"><WatchlistSection title="My Crypto Watchlist" defaultInitialItems={itemsForWatchlist} localStorageKeyOverride={'simCryptoWatchlist'} onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></div>;
            return null;
        default: return null;
    }
  };

  const renderMarketContent = () => {
    if (activeMode === 'Fiat') {
        const isIndianStockView = activePrimaryItem === "Indian Stocks";
        const isUsStockView = activePrimaryItem === "US Stocks";
        const isTopWatchlistView = (isIndianStockView || isUsStockView) && activeSecondaryItem.startsWith("Top watchlist");
        const isCategoryNumberedWatchlistView = (isIndianStockView || isUsStockView) && !!activeSecondaryItem.match(/^Watchlist \d+$/);
        
        if (isTopWatchlistView) {
            const stockData = isIndianStockView ? mockStocks : mockUsStocks;
            return (
                <div className="space-y-8">
                    <MarketMovers stocks={stockData} displayMode="trending" category="Stocks" onAssetClick={onAssetClick} />
                    <WatchlistSection title={"Top Stocks"} displayItems={itemsForWatchlist} isPredefinedList={true} onAssetClick={onAssetClick} />
                    <MarketMovers stocks={stockData} displayMode="gainers-losers" onAssetClick={onAssetClick} />
                    <NewsSection articles={newsForView} />
                </div>
            )
        }
        if (activePrimaryItem === "Options") {
            if (activeSecondaryItem === 'Dashboard') {
                return (
                    <div className="space-y-8">
                        <MarketMovers stocks={mockOptionsForWatchlist} displayMode="full" category="Options" onAssetClick={onAssetClick} />
                        <VolumeOiSection optionsData={mockOptionsForWatchlist}/>
                        <NewsSection articles={newsForView} />
                    </div>
                );
            }
            if (activeSecondaryItem === "Custom") return ( <div className="space-y-8"><FiatOptionChain onAddLeg={(leg) => setStrategyLegs(prev => [...prev, leg])} />{strategyLegs.length > 0 && <StrategyBuilder legs={strategyLegs} setLegs={setStrategyLegs} />}<NewsSection articles={newsForView} /></div>);
            if (activeSecondaryItem === "Readymade") return ( <div className="space-y-8"><ReadymadeStrategiesSection onStrategySelect={(legs) => setStrategyLegs(legs)} />{strategyLegs.length > 0 && <StrategyBuilder legs={strategyLegs} setLegs={setStrategyLegs} />}<NewsSection articles={newsForView} /></div> );
            return null
        }
        if (activePrimaryItem === "IPO") {
            return <IpoSection />;
        }
        if (activePrimaryItem === "Futures") {
            if (activeSecondaryItem === "Index Futures") {
                return (
                    <div className="space-y-8">
                        <MarketMovers stocks={mockIndexFuturesForWatchlist} displayMode="trending" category="Futures" onAssetClick={onAssetClick} />
                        <WatchlistSection title={"Top Indices"} displayItems={itemsForWatchlist} isPredefinedList={true} onAssetClick={onAssetClick} />
                        <MarketMovers stocks={mockIndexFuturesForWatchlist} displayMode="gainers-losers" onAssetClick={onAssetClick} />
                        <NewsSection articles={getRelevantNewsForWatchlistItems(mockIndexFuturesForWatchlist, mockNewsArticles)} />
                    </div>
                );
            }
            if (activeSecondaryItem === "Stock Futures") {
              return (
                <div className="space-y-8">
                  <MarketMovers stocks={mockStockFuturesForWatchlist} displayMode="trending" category="Futures" onAssetClick={onAssetClick} />
                  <WatchlistSection title={"Top Stock Futures"} displayItems={itemsForWatchlist} isPredefinedList={true} onAssetClick={onAssetClick} />
                  <MarketMovers stocks={mockStockFuturesForWatchlist} displayMode="gainers-losers" onAssetClick={onAssetClick} />
                  <NewsSection articles={getRelevantNewsForWatchlistItems(mockStockFuturesForWatchlist, mockNewsArticles)} />
                </div>
              );
            }
        }
        
        if(isCategoryNumberedWatchlistView) return <div className="space-y-8"><WatchlistSection title={`${activePrimaryItem} - ${activeSecondaryItem}`} isPredefinedList={false} localStorageKeyOverride={`simAppWatchlist_Fiat_${activePrimaryItem.replace(/\s+/g, '_')}_${activeSecondaryItem.replace(/\s+/g, '_')}`} defaultInitialItems={[]} onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></div>
    
    } else if (activeMode === 'Crypto') {
        const isNumberedWatchlist = !!activeSecondaryItem.match(/^Watchlist \d+$/);

        if (walletMode === 'cold' && activePrimaryItem === 'Spot') {
            return (
                <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
                    <ShieldCheck className="h-16 w-16 mb-4 text-blue-500" />
                    <h2 className="text-2xl font-semibold mb-2 text-foreground">Spot Trading Disabled</h2>
                    <p className="max-w-md">Spot trading is unavailable in Cold Wallet mode. Switch to your Hot Wallet to trade spot assets.</p>
                </div>
            );
        }
        
        if (activePrimaryItem === "Spot" && activeSecondaryItem.startsWith("Top watchlist")) {
             return (
                <div className="space-y-8">
                    <CryptoHoldingsSection title="Crypto & Web3 Wallet" holdings={cryptoAndWeb3Holdings} cashBalance={cryptoCashBalance} setCashBalance={setCryptoCashBalance} mainPortfolioCashBalance={mainPortfolioCashBalance} setMainPortfolioCashBalance={setMainPortfolioCashBalance} isRealMode={false} walletMode={walletMode} setWalletMode={setWalletMode} onAssetClick={onAssetClick} />
                    <MarketMovers stocks={mockCryptoAssets} displayMode="trending" category="Crypto" onAssetClick={onAssetClick} />
                    <WatchlistSection title={"Top Crypto"} displayItems={mockCryptoAssets} isPredefinedList={true} onAssetClick={onAssetClick} />
                    <MarketMovers stocks={mockCryptoAssets} displayMode="gainers-losers" onAssetClick={onAssetClick} />
                    <NewsSection articles={newsForView} />
                </div>
            )
        }
        if (activePrimaryItem === "Futures" && activeSecondaryItem.startsWith("Top watchlist")) {
             return (
                <div className="space-y-8">
                    <MarketMovers stocks={mockCryptoFuturesForWatchlist} displayMode="trending" category="Futures" onAssetClick={onAssetClick} />
                    <WatchlistSection title={"Top Crypto Futures"} displayItems={mockCryptoFuturesForWatchlist} isPredefinedList={true} onAssetClick={onAssetClick} />
                    <MarketMovers stocks={mockCryptoFuturesForWatchlist} displayMode="gainers-losers" onAssetClick={onAssetClick} />
                    <NewsSection articles={newsForView} />
                </div>
            )
        }
        if (isNumberedWatchlist) {
           return <div className="space-y-8"><WatchlistSection title={`${activePrimaryItem} - ${activeSecondaryItem}`} isPredefinedList={false} localStorageKeyOverride={`simAppWatchlist_Crypto_${activePrimaryItem.replace(/\s+/g, '_')}_${activeSecondaryItem.replace(/\s+/g, '_')}`} defaultInitialItems={[]} onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></div>
        }

        if (activePrimaryItem === "Options") {
            if (activeSecondaryItem === 'Dashboard') return <div className="space-y-8"><MarketMovers stocks={mockCryptoOptionsForWatchlist} displayMode="full" category="Crypto Options" onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></div>;
            if (activeSecondaryItem === "Custom") return ( <div className="space-y-8"><CryptoOptionChain onAddLeg={(leg) => setStrategyLegs(prev => [...prev, leg])} />{strategyLegs.length > 0 && <StrategyBuilder legs={strategyLegs} setLegs={setStrategyLegs} />}<NewsSection articles={newsForView} /></div>);
            if (activeSecondaryItem === "Readymade") return ( <div className="space-y-8"><ReadymadeStrategiesSection onStrategySelect={(legs) => setStrategyLegs(legs)} />{strategyLegs.length > 0 && <StrategyBuilder legs={strategyLegs} setLegs={setStrategyLegs} />}<NewsSection articles={newsForView} /></div> );
            return null
        }
        return <div className="space-y-8"><WatchlistSection title={categoryWatchlistTitle} displayItems={itemsForWatchlist} isPredefinedList={true} onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></div>
    } else if (activeMode === 'Web3') {
        let web3Items: Stock[] = [];
        let watchlistTitle = activePrimaryItem;
        switch (activePrimaryItem) {
            case 'Trending': web3Items = mockWeb3Trending; watchlistTitle = "Trending Web3 Tokens"; break;
            case 'AI': web3Items = mockWeb3AI; watchlistTitle = "Top AI Tokens"; break;
            case 'DeFi': web3Items = mockWeb3DeFi; watchlistTitle = "Top DeFi Tokens"; break;
            case 'Memes': web3Items = mockWeb3Memes; watchlistTitle = "Top Meme Tokens"; break;
            case 'NFT':
                // Special case for NFT, since it might need a different display
                return (
                    <div className="space-y-8">
                        <WatchlistSection 
                            title="Top NFT Collections" 
                            displayItems={[]} // Let's assume a special NFT component would be used
                            isPredefinedList={true} 
                            onAssetClick={onAssetClick} 
                        />
                        <NewsSection articles={newsForView} />
                    </div>
                );
        }
        newsForView = getRelevantNewsForWatchlistItems(web3Items, mockNewsArticles);
        return <div className="space-y-8"><WatchlistSection title={watchlistTitle} displayItems={web3Items} isPredefinedList={true} onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></div>;
    } else if (activeMode === 'Wealth') {
        if (activePrimaryItem === "Mutual Funds") {
            const isTopWatchlist = activeSecondaryItem.startsWith("Top watchlist");
            const isNumberedWatchlist = !!activeSecondaryItem.match(/^Watchlist \d+$/);
            if (isTopWatchlist) {
                const categories = ['Index Fund', 'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap', 'ELSS', 'Sectoral', 'Thematic', 'Debt'];
                const etfCategory = { title: 'Top ETFs', items: mockETFs };
                const groupedFunds = categories.map(category => ({
                    title: `Top ${category} Funds`,
                    items: mockMutualFunds.filter(fund => fund.sector === category)
                })).filter(group => group.items.length > 0);

                const elssFunds = mockMutualFunds.filter(fund => fund.sector === 'ELSS');
                const elssNews = getRelevantNewsForWatchlistItems(elssFunds, mockNewsArticles);

                return (
                    <div className="space-y-8">
                        {[...groupedFunds, etfCategory].map(group => (
                            <WatchlistSection key={group.title} title={group.title.replace(/ Funds$/, '')} displayItems={group.items} isPredefinedList={true} onAssetClick={onAssetClick} />
                        ))}
                        <NewsSection articles={elssNews} title="Latest on Tax Saver Funds" customDescription="Stay updated with news relevant to ELSS and tax-saving investments." />
                    </div>
                );
            }
            if (isNumberedWatchlist) return <div className="space-y-8"><WatchlistSection title={`Mutual Funds - ${activeSecondaryItem}`} isPredefinedList={false} localStorageKeyOverride={`simAppWatchlist_Wealth_MF_${activeSecondaryItem.replace(/\s+/g, '_')}`} defaultInitialItems={[]} onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></div>;
        }
        if (activePrimaryItem === "Bonds") {
            const isTopWatchlist = activeSecondaryItem.startsWith("Top watchlist");
            const isNumberedWatchlist = !!activeSecondaryItem.match(/^Watchlist \d+$/);
            const governmentBonds = mockBonds.filter(b => b.exchange === 'BOND' || b.exchange === 'SGB');
            const corporateBonds = mockBonds.filter(b => b.exchange === 'CORP BOND');
            if (isTopWatchlist) return <div className="space-y-8"><WatchlistSection title="Government Bonds" displayItems={governmentBonds} isPredefinedList={true} onAssetClick={onAssetClick} /><WatchlistSection title="Corporate Bonds" displayItems={corporateBonds} isPredefinedList={true} onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></div>;
            if (isNumberedWatchlist) return <div className="space-y-8"><WatchlistSection title={`Bonds - ${activeSecondaryItem}`} isPredefinedList={false} localStorageKeyOverride={`simAppWatchlist_Wealth_Bonds_${activeSecondaryItem.replace(/\s+/g, '_')}`} defaultInitialItems={[]} onAssetClick={onAssetClick} /><NewsSection articles={newsForView} /></div>;
        }
        if (activePrimaryItem === "Insurance") {
            return (
                <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
                    <Image src="https://placehold.co/200x200.png" alt="Insurance Coming Soon" width={200} height={200} className="mb-8 opacity-75 rounded-lg" data-ai-hint="shield protection" />
                    <ShieldCheck className="h-16 w-16 mb-4 text-primary" />
                    <h2 className="text-2xl font-semibold mb-2 text-foreground">Insurance Marketplace Coming Soon!</h2>
                    <p className="max-w-md">We are working hard to bring you a seamless way to compare and purchase insurance policies directly within SIM.</p>
                </div>
            );
        }
    }
    
    return <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground"><PackageOpen className="h-16 w-16 mb-4" /><h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome!</h2><p className="max-w-md">Select a category above to view your assets and portfolio.</p></div>;
  }

  return (
    <>
    <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-8">
      <SubNav
        primaryNavItems={primaryNavItems}
        activePrimaryItem={activePrimaryItem}
        activeSecondaryItem={activeSecondaryItem}
        onPrimaryNavClick={handlePrimaryNavClick}
        onSecondaryNavClick={handleSecondaryNavClick}
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
       <AddFundsDialog
        isOpen={isAddFundsDialogOpen}
        onOpenChange={setIsAddFundsDialogOpen}
        currentBalance={mainPortfolioCashBalance}
        onConfirm={handleAddWithdrawConfirm}
      />
    </>
  );
}
