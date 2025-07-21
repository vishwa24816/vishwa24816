
"use client";

import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockStocks } from '@/lib/mockData';
import type { Stock } from '@/types';
import { Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { WatchlistItem } from './WatchlistItem';
import { WatchlistAddForm } from './WatchlistAddForm';

const WATCHLIST_LS_KEY = 'simUserWatchlist';

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

  const handleAddStock = (stockToAdd: Stock) => {
    if (!watchlist.find(s => s.id === stockToAdd.id)) {
      setWatchlist(prev => [...prev, stockToAdd]);
      toast({ title: "Added to Watchlist", description: `${stockToAdd.name} added to ${cardTitle}.` });
    } else {
      toast({ title: "Already Added", description: `${stockToAdd.name} is already in ${cardTitle}.`, variant: "destructive" });
    }
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

      <WatchlistAddForm 
        onAddStock={handleAddStock}
        isPredefinedList={isPredefinedList} 
        toast={toast}
      />

      <ScrollArea className="max-h-[480px] pr-1">
        {itemsToRender.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            {isPredefinedList ? "No items in this watchlist." : "Your watchlist is empty. Add assets to track them."}
          </p>
        ) : (
          <ul className="space-y-1">
            {itemsToRender.map((stock) => (
              <WatchlistItem
                key={stock.id}
                stock={stock}
                isPredefinedList={isPredefinedList}
                onRemoveStock={handleRemoveStock}
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
