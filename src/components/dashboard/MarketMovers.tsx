
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
}

export function MarketMovers({ stocks, displayMode, optionsData, futuresData, onAssetClick }: MarketMoversProps) {

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
  
  const isCrypto = stocks.some(s => s.exchange === 'Crypto' || s.exchange === 'Crypto Futures');
  const isCryptoOptions = stocks.some(s => s.exchange === 'Crypto Options');
  const isNfoDerivative = stocks.some(s => s.exchange === 'NFO');
  
  const trendingTitle = useMemo(() => {
    if (isCryptoOptions) return "Trending Crypto Options";
    if (isCrypto) return "Trending Crypto";
    if (isNfoDerivative) return "Trending Options/Futures";
    return "Trending Stocks";
  }, [isCrypto, isCryptoOptions, isNfoDerivative]);


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
