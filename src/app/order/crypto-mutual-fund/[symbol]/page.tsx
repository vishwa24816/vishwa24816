
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { mockCryptoMutualFunds, mockNewsArticles } from '@/lib/mockData';
import type { Stock, NewsArticle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { CryptoMutualFundOrderPageContent } from '@/components/order-pages/CryptoMutualFundOrderPageContent';

// News relevance function
function getRelevantNewsForCryptoMF(asset: Stock | null, allNews: NewsArticle[]): NewsArticle[] {
    if (!asset || !allNews.length) {
        return [];
    }
    const relevantNews: NewsArticle[] = [];
    // For MFs, check for broader keywords
    const assetKeywords = [asset.name.toLowerCase(), asset.symbol.toLowerCase(), 'crypto', 'blockchain', 'defi'];

    allNews.forEach(news => {
        const headlineLower = news.headline.toLowerCase();
        if (assetKeywords.some(keyword => keyword && headlineLower.includes(keyword))) {
        relevantNews.push(news);
        }
    });
    return relevantNews;
}

export default function CryptoMutualFundOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const symbol = typeof params.symbol === 'string' ? decodeURIComponent(params.symbol) : undefined;

  const [asset, setAsset] = useState<Stock | null>(null);
  const [assetSpecificNews, setAssetSpecificNews] = useState<NewsArticle[]>([]);
  
  useEffect(() => {
    if (symbol) {
      const foundAsset = mockCryptoMutualFunds.find(s => 
        s.symbol.toUpperCase() === symbol.toUpperCase()
      );
      if (foundAsset) {
        setAsset(foundAsset);
        const relevantNews = getRelevantNewsForCryptoMF(foundAsset, mockNewsArticles);
        setAssetSpecificNews(relevantNews);

      } else {
        toast({
          title: "Error",
          description: `Crypto Mutual Fund with symbol ${symbol} not found.`,
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
      <CryptoMutualFundOrderPageContent asset={asset} assetSpecificNews={assetSpecificNews} />
    </ProtectedRoute>
  );
}
