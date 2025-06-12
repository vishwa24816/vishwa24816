
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const primaryNavItems = [
  "Portfolio", "Stocks", "Futures", "Options", "Crypto", "Mutual funds", "Bonds", "IPO"
];

interface SubNavProps {
  activePrimaryItem: string;
  activeSecondaryItem: string;
  onPrimaryNavClick: (item: string) => void;
  onSecondaryNavClick: (item: string) => void;
  secondaryNavTriggerCategories: Record<string, string[]>;
}

export function SubNav({ 
  activePrimaryItem, 
  activeSecondaryItem, 
  onPrimaryNavClick, 
  onSecondaryNavClick,
  secondaryNavTriggerCategories 
}: SubNavProps) {

  const currentSecondaryNavItems = secondaryNavTriggerCategories[activePrimaryItem] || [];
  const showSecondaryNav = currentSecondaryNavItems.length > 0;

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
          <div className="flex space-x-0 overflow-x-auto whitespace-nowrap pb-0 no-scrollbar">
            {currentSecondaryNavItems.map((item) => (
              <Button
                key={item}
                variant="ghost"
                className={cn(
                  "px-3 py-2 h-auto text-xs font-medium rounded-none focus-visible:ring-0 focus-visible:ring-offset-0",
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
          </div>
        </div>
      )}
    </div>
  );
}
