
"use client";

import React from 'react';
import type { Stock } from '@/types';
import { StockOrderPageContent } from '@/components/order-pages/StockOrderPageContent';
import { CryptoOrderPageContent } from '@/components/order-pages/CryptoOrderPageContent';
import { FutureOrderPageContent } from '@/components/order-pages/FutureOrderPageContent';
import { MutualFundOrderPageContent } from '@/components/order-pages/MutualFundOrderPageContent';
import { GenericOrderPageContent } from '@/components/order-pages/GenericOrderPageContent';
import { CryptoFutureOrderPageContent } from '@/components/order-pages/CryptoFutureOrderPageContent';
import { CryptoMutualFundOrderPageContent } from '@/components/order-pages/CryptoMutualFundOrderPageContent';
import { mockNewsArticles } from '@/lib/mockData';
import type { InitialOrderDetails } from '@/app/page';

interface OrderPageDispatcherProps {
  asset: Stock;
  onBack: () => void;
  initialDetails: InitialOrderDetails | null;
}

// Helper to get relevant news. This could be moved to a shared utility.
function getRelevantNewsForAsset(stock: Stock | null, allNews: typeof mockNewsArticles): typeof mockNewsArticles {
    if (!stock || !allNews.length) {
        return [];
    }
    const relevantNews: typeof mockNewsArticles = [];
    const stockKeywords = [stock.name.toLowerCase(), stock.symbol.toLowerCase()];
    if(stock.sector) stockKeywords.push(stock.sector.toLowerCase());
    if(stock.symbol.includes("FUT")) { 
        const underlying = stock.symbol.replace("JANFUT", "").replace("FEBFUT", "").replace("MARFUT", "");
        stockKeywords.push(underlying.toLowerCase());
    }

    allNews.forEach(news => {
        const headlineLower = news.headline.toLowerCase();
        if (stockKeywords.some(keyword => keyword && headlineLower.includes(keyword))) {
        relevantNews.push(news);
        }
    });
    return relevantNews;
}


export function OrderPageDispatcher({ asset, onBack, initialDetails }: OrderPageDispatcherProps) {
  const assetSpecificNews = getRelevantNewsForAsset(asset, mockNewsArticles);

  if (!asset.exchange) {
    return <GenericOrderPageContent asset={asset} assetSpecificNews={assetSpecificNews} onBack={onBack} />;
  }

  const exchange = asset.exchange.toLowerCase();
  
  // Specific check for crypto futures and options first
  if (exchange.includes('crypto future') || exchange.includes('crypto options')) {
    return <CryptoFutureOrderPageContent asset={asset} assetSpecificNews={assetSpecificNews} onBack={onBack} />;
  }
  
  if (exchange.includes('crypto')) {
    if (exchange.includes('mf')) {
        return <CryptoMutualFundOrderPageContent asset={asset} assetSpecificNews={assetSpecificNews} onBack={onBack} />;
    }
    // This will now only handle spot crypto
    return <CryptoOrderPageContent asset={asset} assetSpecificNews={assetSpecificNews} onBack={onBack} />;
  }
  
  if (exchange.includes('nfo')) {
      return <FutureOrderPageContent asset={asset} assetSpecificNews={assetSpecificNews} onBack={onBack} />;
  }

  if (exchange.includes('mf')) {
    return <MutualFundOrderPageContent asset={asset} assetSpecificNews={assetSpecificNews} onBack={onBack} initialDetails={initialDetails} />;
  }

  if (exchange === 'nse' || exchange === 'bse' || exchange === 'nasdaq' || exchange === 'nyse') {
    return <StockOrderPageContent asset={asset} assetSpecificNews={assetSpecificNews} onBack={onBack} initialDetails={initialDetails} />;
  }
  
  // Fallback for any other types
  return <GenericOrderPageContent asset={asset} assetSpecificNews={assetSpecificNews} onBack={onBack} />;
}
