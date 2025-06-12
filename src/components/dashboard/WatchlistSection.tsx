
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockStocks } from '@/lib/mockData';
import type { Stock } from '@/types';
import { Eye, PlusCircle, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const WATCHLIST_LS_KEY = 'simUserWatchlist'; // Default key for the main user portfolio watchlist

interface WatchlistSectionProps {
  displayItems?: Stock[];
  isPredefinedList?: boolean;
  title?: string;
  localStorageKeyOverride?: string; // To allow multiple independent editable watchlists
  defaultInitialItems?: Stock[]; // To control initial items for new editable watchlists
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

  useEffect(() => {
    if (isPredefinedList) {
      setWatchlist(displayItems || []);
    } else {
      try {
        const storedWatchlist = localStorage.getItem(effectiveLocalStorageKey);
        if (storedWatchlist) {
          setWatchlist(JSON.parse(storedWatchlist));
        } else {
          // Use defaultInitialItems if provided (e.g., [] for new empty watchlists).
          // Fallback to mockStocks only for the very default user watchlist if defaultInitialItems is not set.
          if (typeof defaultInitialItems !== 'undefined') {
            setWatchlist(defaultInitialItems);
          } else if (effectiveLocalStorageKey === WATCHLIST_LS_KEY) {
            setWatchlist(mockStocks.slice(0, 2));
          } else {
            setWatchlist([]); // Other editable watchlists start empty by default
          }
        }
      } catch (error) {
        console.error(`Failed to load watchlist from localStorage (key: ${effectiveLocalStorageKey}):`, error);
        if (typeof defaultInitialItems !== 'undefined') {
          setWatchlist(defaultInitialItems);
        } else if (effectiveLocalStorageKey === WATCHLIST_LS_KEY) {
          setWatchlist(mockStocks.slice(0, 2));
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
    if (isPredefinedList || !newStockSymbol.trim()) return;

    const stockToAdd = mockStocks.find(stock => stock.symbol.toUpperCase() === newStockSymbol.toUpperCase());

    if (stockToAdd) {
      if (!watchlist.find(s => s.id === stockToAdd.id)) {
        setWatchlist(prev => [...prev, stockToAdd]);
        toast({ title: "Stock Added", description: `${stockToAdd.name} added to ${cardTitle}.` });
      } else {
        toast({ title: "Already Added", description: `${stockToAdd.name} is already in ${cardTitle}.`, variant: "destructive" });
      }
    } else {
      toast({ title: "Stock Not Found", description: `Could not find stock with symbol: ${newStockSymbol}. Please use symbols like RELIANCE, TCS etc.`, variant: "destructive" });
    }
    setNewStockSymbol('');
  };

  const handleRemoveStock = (stockId: string) => {
    if (isPredefinedList) return;
    const stock = watchlist.find(s => s.id === stockId);
    setWatchlist(prev => prev.filter(s => s.id !== stockId));
    if (stock) {
      toast({ title: "Stock Removed", description: `${stock.name} removed from ${cardTitle}.` });
    }
  };

  const itemsToRender = isPredefinedList ? (displayItems || []) : watchlist;
  const cardTitle = title || "My Watchlist";

  return (
    <section aria-labelledby="watchlist-section-title">
      <Card className="shadow-lg flex flex-col">
        <CardHeader>
          <CardTitle id="watchlist-section-title" className="text-xl font-semibold font-headline text-primary flex items-center">
            <Eye className="h-6 w-6 mr-2" /> {cardTitle}
          </CardTitle>
          {!isPredefinedList && <CardDescription>Track your favorite stocks.</CardDescription>}
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          {!isPredefinedList && (
            <form onSubmit={handleAddStock} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter stock symbol (e.g., RELIANCE)"
                value={newStockSymbol}
                onChange={(e) => setNewStockSymbol(e.target.value.toUpperCase())}
                className="flex-grow"
              />
              <Button type="submit" size="icon" aria-label="Add stock to watchlist">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </form>
          )}
          <ScrollArea className="max-h-72 pr-3">
            {itemsToRender.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {isPredefinedList ? "No items in this watchlist." : "Your watchlist is empty. Add stocks to track them."}
              </p>
            ) : (
              <ul className="space-y-1">
                {itemsToRender.map((stock) => {
                  const isPositive = stock.change >= 0;
                  return (
                    <li key={stock.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/30 transition-colors group">
                      <div>
                        <p className="font-semibold text-sm">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground">{stock.exchange || stock.name.substring(0,15)}</p>
                      </div>
                      <div className="text-right">
                         <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.price.toFixed(2)}
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
                          className="text-muted-foreground hover:text-destructive h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                          onClick={() => handleRemoveStock(stock.id)}
                          aria-label={`Remove ${stock.symbol} from watchlist`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
        {!isPredefinedList && itemsToRender.length > 0 && (
          <CardFooter className="text-sm text-muted-foreground">
            <p>You are tracking {itemsToRender.length} stock(s) in {cardTitle}.</p>
          </CardFooter>
        )}
      </Card>
    </section>
  );
}
