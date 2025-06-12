"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockStocks } from '@/lib/mockData';
import type { Stock } from '@/types';
import { Star, PlusCircle, Trash2, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

const WATCHLIST_LS_KEY = 'simUserWatchlist';

export function WatchlistSection() {
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [newStockSymbol, setNewStockSymbol] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem(WATCHLIST_LS_KEY);
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      } else {
        // Add a few default stocks to watchlist if it's empty
        setWatchlist(mockStocks.slice(0,2));
      }
    } catch (error) {
        console.error("Failed to load watchlist from localStorage", error);
        setWatchlist(mockStocks.slice(0,2)); // Fallback to default
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(WATCHLIST_LS_KEY, JSON.stringify(watchlist));
  }, [watchlist]);
  
  const handleAddStock = (e: FormEvent) => {
    e.preventDefault();
    if (!newStockSymbol.trim()) return;

    const stockToAdd = mockStocks.find(stock => stock.symbol.toUpperCase() === newStockSymbol.toUpperCase());

    if (stockToAdd) {
      if (!watchlist.find(s => s.id === stockToAdd.id)) {
        setWatchlist(prev => [...prev, stockToAdd]);
        toast({ title: "Stock Added", description: `${stockToAdd.name} added to your watchlist.` });
      } else {
        toast({ title: "Already Added", description: `${stockToAdd.name} is already in your watchlist.`, variant: "destructive" });
      }
    } else {
      toast({ title: "Stock Not Found", description: `Could not find stock with symbol: ${newStockSymbol}. Please use symbols like RELIANCE, TCS etc.`, variant: "destructive" });
    }
    setNewStockSymbol('');
  };

  const handleRemoveStock = (stockId: string) => {
    const stock = watchlist.find(s => s.id === stockId);
    setWatchlist(prev => prev.filter(s => s.id !== stockId));
    if (stock) {
      toast({ title: "Stock Removed", description: `${stock.name} removed from your watchlist.` });
    }
  };

  return (
    <section aria-labelledby="watchlist-section-title">
      <Card className="shadow-lg h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
            <Eye className="h-6 w-6 mr-2" /> My Watchlist
          </CardTitle>
          <CardDescription>Track your favorite stocks.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
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
          <ScrollArea className="h-72 pr-3"> {/* Adjust height as needed */}
            {watchlist.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Your watchlist is empty. Add stocks to track them.</p>
            ) : (
              <ul className="space-y-3">
                {watchlist.map((stock) => {
                  const isPositive = stock.change >= 0;
                  return (
                    <li key={stock.id} className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/60 transition-colors group">
                      <div>
                        <p className="font-semibold">{stock.symbol} <span className="text-xs text-muted-foreground hidden sm:inline">({stock.name})</span></p>
                        <p className="text-sm">{stock.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                         <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center justify-end`}>
                          {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                          {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-7 w-7 opacity-50 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveStock(stock.id)}
                          aria-label={`Remove ${stock.symbol} from watchlist`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
        {watchlist.length > 0 && (
          <CardFooter className="text-sm text-muted-foreground">
            <p>You are tracking {watchlist.length} stock(s).</p>
          </CardFooter>
        )}
      </Card>
    </section>
  );
}
