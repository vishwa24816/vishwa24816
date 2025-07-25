
"use client";

import React, { useMemo } from 'react';
import type { Stock } from '@/types';
import { TrendingSection } from './TrendingSection';
import { GainersLosersSection } from './GainersLosersSection';

interface MarketMoversProps {
  stocks: Stock[];
  displayMode: 'trending' | 'gainers-losers' | 'full';
  optionsData?: Stock[];
  futuresData?: Stock[];
  onAssetClick: (asset: Stock) => void;
  category?: 'Stocks' | 'Options' | 'Futures' | 'Crypto' | 'Crypto Options';
}

export function MarketMovers({ stocks, displayMode, optionsData, futuresData, onAssetClick, category }: MarketMoversProps) {

  const { mostTraded, topGainers, topLosers } = useMemo(() => {
    const isDerivative = stocks.some(s => s.exchange === 'NFO' || s.exchange === 'Crypto Options');
    const sourceData = isDerivative ? (optionsData || futuresData || stocks) : stocks;
    
    const sortedByActivity = [...sourceData].sort((a, b) => {
        const activityA = a.openInterest || a.volume || 0;
        const activityB = b.openInterest || b.volume || 0;
        return activityB - activityA;
    }).slice(0, 5);

    const sortedByGain = [...sourceData].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
    const sortedByLoss = [...sourceData].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
    
    return { mostTraded: sortedByActivity, topGainers: sortedByGain, topLosers: sortedByLoss };
  }, [stocks, optionsData, futuresData]);
  
  const trendingTitle = useMemo(() => {
    switch(category) {
        case 'Stocks': return 'Trending Stocks';
        case 'Options': return 'Trending Options';
        case 'Futures': return 'Trending Futures';
        case 'Crypto': return 'Trending Crypto';
        case 'Crypto Options': return 'Trending Crypto Options';
        default:
            const isCrypto = stocks.some(s => s.exchange === 'Crypto' || s.exchange === 'Crypto Futures');
            if (isCrypto) return "Trending Crypto";
            const isNfoFutures = stocks.some(s => s.symbol?.includes('FUT'));
            if(isNfoFutures) return "Trending Futures";
            const isNfoOptions = stocks.some(s => s.symbol?.includes('CE') || s.symbol?.includes('PE'));
            if(isNfoOptions) return "Trending Options";
            return "Trending Stocks";
    }
  }, [stocks, category]);


  switch (displayMode) {
    case 'trending':
      return <TrendingSection title={trendingTitle} items={mostTraded} onAssetClick={onAssetClick} />;
    case 'gainers-losers':
      return <GainersLosersSection gainers={topGainers} losers={topLosers} onAssetClick={onAssetClick} />;
    case 'full':
    default:
      return (
        <div className="space-y-6">
          <TrendingSection title={trendingTitle} items={mostTraded} onAssetClick={onAssetClick} />
          <GainersLosersSection gainers={topGainers} losers={topLosers} onAssetClick={onAssetClick} />
        </div>
      );
  }
}
