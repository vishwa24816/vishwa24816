
"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import type { Stock } from '@/types';
import { cn } from '@/lib/utils';
import { Trash2, TrendingUp, TrendingDown, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const DRAG_THRESHOLD = 50;
const ACTION_AREA_WIDTH = 80;

interface WatchlistItemProps {
  stock: Stock;
  isPredefinedList: boolean;
  onRemoveStock: (stockId: string) => void;
  onAssetClick: (asset: Stock) => void;
}

export const WatchlistItem: React.FC<WatchlistItemProps> = ({ stock, isPredefinedList, onRemoveStock, onAssetClick }) => {
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

  const handleItemClick = (e: React.MouseEvent) => {
    if (ignoreClickAfterSwipeRef.current) {
      e.preventDefault();
      return;
    }
    if (!isPredefinedList && currentTranslateX !== 0) {
      e.preventDefault();
      return;
    }
    onAssetClick(stock);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onRemoveStock(stock.id);
  };

  const fallbackText = stock.symbol.substring(0, 2);

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
        <button
          onClick={handleItemClick}
          className={cn(
            "flex items-center justify-between w-full p-3 text-left",
            isPredefinedList ? "cursor-pointer" : "cursor-grab"
          )}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="h-9 w-9 text-xs">
              <AvatarFallback>{fallbackText}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{stock.symbol}</p>
                <p className="text-xs text-muted-foreground truncate">{stock.exchange || stock.name}</p>
            </div>
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
        </button>
      </div>
    </li>
  );
};
