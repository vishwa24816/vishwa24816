
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubNavProps {
  primaryNavItems: string[];
  activePrimaryItem: string;
  activeSecondaryItem: string;
  onPrimaryNavClick: (item: string) => void;
  onSecondaryNavClick: (item: string) => void;
  secondaryNavTriggerCategories: Record<string, string[]>;
}

export function SubNav({ 
  primaryNavItems,
  activePrimaryItem, 
  activeSecondaryItem, 
  onPrimaryNavClick, 
  onSecondaryNavClick,
  secondaryNavTriggerCategories 
}: SubNavProps) {
  const { toast } = useToast();
  const currentSecondaryNavItems = secondaryNavTriggerCategories[activePrimaryItem] || [];
  const showSecondaryNav = currentSecondaryNavItems.length > 0;

  // Check if the current primary item is a watchlist category
  const isWatchlistCategory = currentSecondaryNavItems.some(item => item.startsWith("Watchlist") || item.startsWith("Top watchlist"));

  const handleAddWatchlist = () => {
    toast({
      title: "Feature Coming Soon",
      description: "You'll soon be able to create and manage custom watchlists here.",
    });
  };

  return (
    <div>
      <div className="border-b border-border">
        <div className="flex space-x-0 overflow-x-auto whitespace-nowrap pb-0 no-scrollbar">
          {primaryNavItems.map((item) => (
            <Button
              key={item}
              variant="ghost"
              className={cn(
                "px-4 py-3 h-auto text-sm font-medium rounded-none focus-visible:ring-0 focus-visible:ring-offset-0",
                "border-b-2 hover:bg-transparent",
                activePrimaryItem === item
                  ? "text-primary border-primary font-semibold"
                  : "text-muted-foreground border-transparent hover:text-primary hover:border-primary/30"
              )}
              onClick={() => onPrimaryNavClick(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      {showSecondaryNav && (
        <div className="border-b border-border mt-1">
          <div className="flex items-center space-x-0 overflow-x-auto whitespace-nowrap pb-0 no-scrollbar">
            {currentSecondaryNavItems.map((item) => (
              <Button
                key={item}
                variant="ghost"
                className={cn(
                  "px-4 py-3 h-auto text-sm font-medium rounded-none focus-visible:ring-0 focus-visible:ring-offset-0",
                  "border-b-2 hover:bg-transparent",
                  activeSecondaryItem === item
                    ? "text-primary border-primary font-semibold"
                    : "text-muted-foreground border-transparent hover:text-primary hover:border-primary/30"
                )}
                onClick={() => onSecondaryNavClick(item)}
              >
                {item}
              </Button>
            ))}
            {isWatchlistCategory && (
              <Button
                variant="ghost"
                size="icon"
                className="h-auto w-auto p-3 text-muted-foreground hover:text-primary shrink-0"
                onClick={handleAddWatchlist}
                aria-label="Add new watchlist"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

    