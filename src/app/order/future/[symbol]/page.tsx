
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { 
    mockStocks, 
    mockCryptoAssets, 
    mockMutualFunds, 
    mockBonds, 
    mockIndexFuturesForWatchlist, 
    mockStockFuturesForWatchlist, 
    mockOptionsForWatchlist, 
    mockNewsArticles 
} from '@/lib/mockData';
import type { Stock, NewsArticle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { FutureOrderPageContent } from '@/components/order-pages/FutureOrderPageContent';

// Combine all mock asset lists for easier lookup
const allMockAssets: Stock[] = [
  ...mockStocks,
  ...mockCryptoAssets,
  ...mockMutualFunds,
  ...mockBonds,
  ...mockIndexFuturesForWatchlist,
  ...mockStockFuturesForWatchlist,
  ...mockOptionsForWatchlist
];


function getRelevantNewsForAsset(asset: Stock | null, allNews: NewsArticle[]): NewsArticle[] {
    if (!asset || !allNews.length) {
        return [];
    }
    const relevantNews: NewsArticle[] = [];
    const assetKeywords = [asset.name.toLowerCase(), asset.symbol.toLowerCase()];
    if(asset.sector) assetKeywords.push(asset.sector.toLowerCase());
    if(asset.symbol.includes("FUT")) { // Add underlying for futures
        const underlying = asset.symbol.replace("JANFUT", "").replace("FEBFUT", "").replace("MARFUT", ""); // Basic matcher
        assetKeywords.push(underlying.toLowerCase());
    }


    allNews.forEach(news => {
        const headlineLower = news.headline.toLowerCase();
        if (assetKeywords.some(keyword => keyword && headlineLower.includes(keyword))) {
        relevantNews.push(news);
        }
    });
    return relevantNews;
}


export default function FutureOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const symbol = typeof params.symbol === 'string' ? decodeURIComponent(params.symbol) : undefined;

  const [asset, setAsset] = useState<Stock | null>(null);
  const [assetSpecificNews, setAssetSpecificNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    if (symbol) {
      const foundAsset = allMockAssets.find(s => 
        s.symbol.toUpperCase() === symbol.toUpperCase() &&
        (s.exchange === 'NFO' && (s.symbol.includes('FUT') || s.name.toLowerCase().includes('future')))
      );
      if (foundAsset) {
        setAsset(foundAsset);
        const relevantNews = getRelevantNewsForAsset(foundAsset, mockNewsArticles);
        setAssetSpecificNews(relevantNews);
      } else {
        toast({
          title: "Error",
          description: `Future with symbol ${symbol} not found.`,
          variant: "destructive",
        });
        router.push('/'); 
      }
    }
  }, [symbol, router, toast]);

  if (!asset) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <main className="w-full p-4 flex items-center justify-center">
            <p>Loading future details...</p>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <FutureOrderPageContent asset={asset} assetSpecificNews={assetSpecificNews} />
    </ProtectedRoute>
  );
}
