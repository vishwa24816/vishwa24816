"use client";

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockStocks, mockIndexFuturesForWatchlist, mockStockFuturesForWatchlist, mockCryptoAssets, mockMutualFunds, mockBonds, mockOptionsForWatchlist, mockCryptoFuturesForWatchlist } from '@/lib/mockData';
import { mockUsStocks } from '@/lib/mockData/usStocks';
import type { Stock } from '@/types';
import { Eye, PlusCircle, Trash2, TrendingUp, TrendingDown, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const WATCHLIST_LS_KEY = 'simUserWatchlist';
const DRAG_THRESHOLD = 50;
const ACTION_AREA_WIDTH = 80;

// Combine all searchable assets
const allSearchableAssets: Stock[] = [
    ...mockStocks,
    ...mockUsStocks,
    ...mockIndexFuturesForWatchlist,
    ...mockStockFuturesForWatchlist,
    ...mockOptionsForWatchlist,
    ...mockCryptoAssets,
    ...mockCryptoFuturesForWatchlist,
    ...mockMutualFunds,
    ...mockBonds
];


interface StockListItemProps {
  stock: Stock;
  isPredefinedList: boolean;
  onRemoveStock: (stockId: string) => void;
  cardTitleForToast: string;
}

const StockListItem: React.FC<StockListItemProps> = ({ stock, isPredefinedList, onRemoveStock, cardTitleForToast }) => {
  const [touchStartX, setTouchStartX] = useState(0);
  const [currentTranslateX, setCurrentTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);
  const { toast } = useToast();
  const ignoreClickAfterSwipeRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isPredefinedList) return;
    setTouchStartX(e.targetTouches[0].clientX);
    setIsSwiping(true);
    ignoreClickAfterSwipeRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPredefinedList || !isSwiping) return;
    const currentX = e.targetTouches[0].clientX;
    let diffX = currentX - touchStartX;

    if (diffX > ACTION_AREA_WIDTH) diffX = ACTION_AREA_WIDTH;
    if (diffX < -ACTION_AREA_WIDTH) diffX = -ACTION_AREA_WIDTH;

    setCurrentTranslateX(diffX);

    if (Math.abs(diffX) > 10) {
      ignoreClickAfterSwipeRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (isPredefinedList || !isSwiping) return;

    setIsSwiping(false);

    if (currentTranslateX > DRAG_THRESHOLD) {
      toast({ title: "BUY Action (Mock)", description: `Initiate BUY for ${stock.symbol}` });
    } else if (currentTranslateX < -DRAG_THRESHOLD) {
      toast({ title: "SELL Action (Mock)", description: `Initiate SELL for ${stock.symbol}` });
    }

    setCurrentTranslateX(0);
    setTimeout(() => {
      ignoreClickAfterSwipeRef.current = false;
    }, 50);
  };

  const isPositive = stock.change >= 0;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (ignoreClickAfterSwipeRef.current) {
      e.preventDefault();
    }
    if (!isPredefinedList && currentTranslateX !== 0) {
      e.preventDefault();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onRemoveStock(stock.id);
  };

  let itemLink = `/order/stock/${stock.symbol}`;
  if (stock.exchange === 'MF') {
    itemLink = `/order/mutual-fund/${stock.symbol}`;
  } else if (stock.exchange === 'Crypto') {
    itemLink = `/order/crypto/${stock.symbol}`;
  } else if (stock.exchange === 'Crypto MF') {
    itemLink = `/order/crypto-mutual-fund/${stock.symbol}`;
  } else if (stock.exchange === 'NFO') {
    if (stock.symbol.includes('FUT') || stock.name.toLowerCase().includes('future')) {
      itemLink = `/order/future/${stock.symbol}`;
    } else if (stock.symbol.includes('CE') || stock.symbol.includes('PE') || stock.name.toLowerCase().includes('option')) {
      itemLink = `/order/option/${stock.symbol}`;
    }
  } else if (stock.exchange === 'BOND' || stock.exchange === 'CORP BOND' || stock.exchange === 'SGB') {
    itemLink = `/order/bond/${stock.symbol}`;
  } else if (stock.exchange === 'Crypto Futures') {
    itemLink = `/order/crypto-future/${stock.symbol}`;
  }


  return (
    <li
      ref={itemRef}
      onTouchStart={!isPredefinedList ? handleTouchStart : undefined}
      onTouchMove={!isPredefinedList ? handleTouchMove : undefined}
      onTouchEnd={!isPredefinedList ? handleTouchEnd : undefined}
      className={cn(
        "relative group overflow-hidden rounded-md",
        !isPredefinedList ? "bg-card" : "hover:bg-muted/30"
      )}
    >
      {!isPredefinedList && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 flex items-center justify-start pl-4 bg-green-600 text-white transition-all duration-300 ease-out"
            style={{
              width: `${Math.max(0, currentTranslateX)}px`,
              opacity: currentTranslateX > DRAG_THRESHOLD / 2 ? 1 : 0,
              pointerEvents: 'none'
            }}
          >
            <ChevronsRight className="h-5 w-5 mr-1" /> BUY
          </div>
          <div
            className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-4 bg-red-600 text-white transition-all duration-300 ease-out"
            style={{
              width: `${Math.max(0, -currentTranslateX)}px`,
              opacity: currentTranslateX < -DRAG_THRESHOLD / 2 ? 1 : 0,
              pointerEvents: 'none'
            }}
          >
            SELL <ChevronsLeft className="h-5 w-5 ml-1" />
          </div>
        </>
      )}

      <div
        className="relative z-10 w-full"
        style={{
          transform: `translateX(${currentTranslateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
          backgroundColor: !isPredefinedList ? 'hsl(var(--card))' : 'transparent',
        }}
      >
        <Link
          href={itemLink}
          passHref
          className={cn(
            "flex items-center justify-between w-full p-3",
            isPredefinedList ? "cursor-pointer" : "cursor-grab"
          )}
          onClick={handleLinkClick}
        >
          <div className="flex-grow">
            <p className="font-semibold text-sm">{stock.symbol}</p>
            <p className="text-xs text-muted-foreground">{stock.exchange || stock.name.substring(0,20)}{stock.name.length > 20 ? '...' : ''}</p>
          </div>
          <div className="text-right ml-2 shrink-0">
            <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              ₹{stock.price.toFixed(2)}
            </p>
            <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center justify-end`}>
              {isPositive ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
              {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </p>
          </div>
          {!isPredefinedList && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive h-7 w-7 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity ml-2 shrink-0 z-20"
              onClick={handleDeleteClick}
              aria-label={`Remove ${stock.symbol} from watchlist`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </Link>
      </div>
    </li>
  );
};


interface WatchlistSectionProps {
  displayItems?: Stock[];
  isPredefinedList?: boolean;
  title?: string;
  localStorageKeyOverride?: string;
  defaultInitialItems?: Stock[];
}

export function WatchlistSection({
  displayItems,
  isPredefinedList = false,
  title,
  localStorageKeyOverride,
  defaultInitialItems,
}: WatchlistSectionProps) {
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [newStockSymbol, setNewStockSymbol] = useState('');
  const { toast } = useToast();

  const effectiveLocalStorageKey = localStorageKeyOverride || WATCHLIST_LS_KEY;
  const cardTitle = title || "My Watchlist";

  useEffect(() => {
    if (isPredefinedList) {
      setWatchlist(displayItems || []);
    } else {
      try {
        const storedWatchlist = localStorage.getItem(effectiveLocalStorageKey);
        if (storedWatchlist) {
          setWatchlist(JSON.parse(storedWatchlist));
        } else {
          if (typeof defaultInitialItems !== 'undefined') {
            setWatchlist(defaultInitialItems);
          } else if (effectiveLocalStorageKey === WATCHLIST_LS_KEY) { 
            setWatchlist(mockStocks.slice(0, 5));
          } else {
            setWatchlist([]);
          }
        }
      } catch (error) {
        console.error(`Failed to load watchlist from localStorage (key: ${effectiveLocalStorageKey}):`, error);
        if (typeof defaultInitialItems !== 'undefined') {
          setWatchlist(defaultInitialItems);
        } else if (effectiveLocalStorageKey === WATCHLIST_LS_KEY) {
          setWatchlist(mockStocks.slice(0, 5));
        } else {
          setWatchlist([]);
        }
      }
    }
  }, [displayItems, isPredefinedList, effectiveLocalStorageKey, defaultInitialItems]);

  useEffect(() => {
    if (!isPredefinedList) {
      localStorage.setItem(effectiveLocalStorageKey, JSON.stringify(watchlist));
    }
  }, [watchlist, isPredefinedList, effectiveLocalStorageKey]);

  const handleAddStock = (e: FormEvent) => {
    e.preventDefault();
    if (!newStockSymbol.trim()) return;

    if (isPredefinedList) {
        toast({ title: "Info", description: "This is a predefined watchlist and cannot be modified here."});
        setNewStockSymbol('');
        return;
    }

    const stockToAdd = allSearchableAssets.find(stock => stock.symbol.toUpperCase() === newStockSymbol.toUpperCase());

    if (stockToAdd) {
      if (!watchlist.find(s => s.id === stockToAdd.id)) {
        setWatchlist(prev => [...prev, stockToAdd]);
        toast({ title: "Added to Watchlist", description: `${stockToAdd.name} added to ${cardTitle}.` });
      } else {
        toast({ title: "Already Added", description: `${stockToAdd.name} is already in ${cardTitle}.`, variant: "destructive" });
      }
    } else {
      toast({ title: "Asset Not Found", description: `Could not find asset with symbol: ${newStockSymbol}. Please try common symbols.`, variant: "destructive" });
    }
    setNewStockSymbol('');
  };

  const handleRemoveStock = (stockId: string) => {
    if (isPredefinedList) return; 
    const stock = watchlist.find(s => s.id === stockId);
    setWatchlist(prev => prev.filter(s => s.id !== stockId));
    if (stock) {
      toast({ title: "Removed from Watchlist", description: `${stock.name} removed from ${cardTitle}.` });
    }
  };

  const itemsToRender = isPredefinedList ? (displayItems || []) : watchlist;

  return (
    <section aria-labelledby={`watchlist-section-title-${title?.replace(/\s+/g, '-') || 'default'}`} className="space-y-4">
      <div>
        <h2 id={`watchlist-section-title-${title?.replace(/\s+/g, '-') || 'default'}`} className="text-xl font-semibold font-headline text-primary flex items-center mb-1">
          <Eye className="h-6 w-6 mr-2" /> {cardTitle}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {isPredefinedList ? "Tap items to view order page." : "Track your favorite assets. Swipe items for actions."}
        </p>
      </div>

      <form onSubmit={handleAddStock} className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter symbol (e.g., RELIANCE, NIFTYJANFUT)"
          value={newStockSymbol}
          onChange={(e) => setNewStockSymbol(e.target.value.toUpperCase())}
          className="flex-grow"
        />
        <Button type="submit" size="icon" aria-label="Add stock to watchlist">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </form>

      <ScrollArea className="max-h-[480px] pr-1">
        {itemsToRender.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            {isPredefinedList ? "No items in this watchlist." : "Your watchlist is empty. Add assets to track them."}
          </p>
        ) : (
          <ul className="space-y-1">
            {itemsToRender.map((stock) => (
              <StockListItem
                key={stock.id}
                stock={stock}
                isPredefinedList={isPredefinedList}
                onRemoveStock={handleRemoveStock}
                cardTitleForToast={cardTitle}
              />
            ))}
          </ul>
        )}
      </ScrollArea>
      {!isPredefinedList && itemsToRender.length > 0 && (
        <p className="text-sm text-muted-foreground pt-2">
          You are tracking {itemsToRender.length} asset(s) in {cardTitle}.
        </p>
      )}
    </section>
  );
}
