
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { mockCryptoFuturesForWatchlist, mockNewsArticles } from '@/lib/mockData';
import type { Stock, NewsArticle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { CryptoFutureOrderPageContent } from '@/components/order-pages/CryptoFutureOrderPageContent';


// News relevance function
function getRelevantNewsForCryptoFuture(asset: Stock | null, allNews: NewsArticle[]): NewsArticle[] {
    if (!asset || !allNews.length) {
        return [];
    }
    const relevantNews: NewsArticle[] = [];
    // Extract base currency from symbol like 'BTCUSDT.P' -> 'btc'
    const baseCurrency = asset.symbol.split('USDT')[0].toLowerCase();
    const assetKeywords = [asset.name.toLowerCase(), asset.symbol.toLowerCase(), baseCurrency];

    allNews.forEach(news => {
        const headlineLower = news.headline.toLowerCase();
        if (assetKeywords.some(keyword => keyword && headlineLower.includes(keyword))) {
        relevantNews.push(news);
        }
    });
    return relevantNews;
}


export default function CryptoFutureOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const symbol = typeof params.symbol === 'string' ? decodeURIComponent(params.symbol) : undefined;

  const [asset, setAsset] = useState<Stock | null>(null);
  const [assetSpecificNews, setAssetSpecificNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    if (symbol) {
      const foundAsset = mockCryptoFuturesForWatchlist.find(s => 
        s.symbol.toUpperCase() === symbol.toUpperCase()
      );
      if (foundAsset) {
        setAsset(foundAsset);
        const relevantNews = getRelevantNewsForCryptoFuture(foundAsset, mockNewsArticles);
        setAssetSpecificNews(relevantNews);

      } else {
        toast({
          title: "Error",
          description: `Crypto Future with symbol ${symbol} not found.`,
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
            <p>Loading asset details...</p>
          </main>
        </div>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <CryptoFutureOrderPageContent asset={asset} assetSpecificNews={assetSpecificNews} />
    </ProtectedRoute>
  );
}
