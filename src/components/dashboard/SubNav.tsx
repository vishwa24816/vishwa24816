
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const primaryNavItems = [
  "Portfolio", "Stocks", "Futures", "Options", "Crypto", "Mutual funds", "Bonds", "IPO"
];

const secondaryNavTriggerCategories: Record<string, string[]> = {
  Stocks: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
  Futures: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
  Crypto: ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
  "Mutual funds": ["Top watchlist", ...Array.from({ length: 10 }, (_, i) => `Watchlist ${i + 1}`)],
  Portfolio: ["Holdings", "Positions", "Portfolio Watchlist"],
};

export function SubNav() {
  const [activePrimaryItem, setActivePrimaryItem] = useState("Stocks");
  const [activeSecondaryItem, setActiveSecondaryItem] = useState("Top watchlist");

  const currentSecondaryNavItems = secondaryNavTriggerCategories[activePrimaryItem] || [];
  const showSecondaryNav = currentSecondaryNavItems.length > 0;

  const handlePrimaryNavClick = (item: string) => {
    setActivePrimaryItem(item);
    const newSecondaryItems = secondaryNavTriggerCategories[item] || [];
    if (newSecondaryItems.length > 0) {
      setActiveSecondaryItem(newSecondaryItems[0]); // Default to the first item of the new secondary nav
    } else {
      setActiveSecondaryItem(""); // No secondary nav
    }
    // Placeholder for actual navigation logic
    console.log(`Navigating to ${item}`);
  };

  const handleSecondaryNavClick = (item: string) => {
    setActiveSecondaryItem(item);
    // Placeholder for actual navigation logic
    console.log(`Navigating to ${activePrimaryItem} > ${item}`);
  };

  return (
    <div>
      <div className="border-b border-border"> {/* Container for primary nav */}
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
              onClick={() => handlePrimaryNavClick(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      {showSecondaryNav && (
        <div className="border-b border-border mt-1"> {/* Container for secondary nav */}
          <div className="flex space-x-0 overflow-x-auto whitespace-nowrap pb-0 no-scrollbar">
            {currentSecondaryNavItems.map((item) => (
              <Button
                key={item}
                variant="ghost"
                className={cn(
                  "px-3 py-2 h-auto text-xs font-medium rounded-none focus-visible:ring-0 focus-visible:ring-offset-0", // Slightly smaller padding/text for secondary
                  "border-b-2 hover:bg-transparent",
                  activeSecondaryItem === item
                    ? "text-primary border-primary font-semibold"
                    : "text-muted-foreground border-transparent hover:text-primary hover:border-primary/30"
                )}
                onClick={() => handleSecondaryNavClick(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
