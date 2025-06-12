
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  "Portfolio", "Stocks", "Futures", "Options", "Crypto", "Mutual funds", "Bonds", "IPO"
];

export function SubNav() {
  const [activeItem, setActiveItem] = useState("Stocks"); // Default to "Stocks"

  return (
    <div className="border-b border-border"> {/* Container with bottom border */}
      <div className="flex space-x-0 overflow-x-auto whitespace-nowrap pb-0 no-scrollbar">
        {navItems.map((item) => (
          <Button
            key={item}
            variant="ghost"
            className={cn(
              "px-4 py-3 h-auto text-sm font-medium rounded-none focus-visible:ring-0 focus-visible:ring-offset-0",
              "border-b-2 hover:bg-transparent", // Common border style for tab-like appearance
              activeItem === item
                ? "text-primary border-primary font-semibold" // Active state: primary color text and border
                : "text-muted-foreground border-transparent hover:text-primary hover:border-primary/30" // Inactive state
            )}
            onClick={() => {
                setActiveItem(item);
                // Placeholder for actual navigation logic
                console.log(`Navigating to ${item}`);
            }}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
}
