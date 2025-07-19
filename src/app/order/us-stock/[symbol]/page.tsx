"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { mockStocks, mockNewsArticles, mockUsStocks } from '@/lib/mockData';
import type { Stock, NewsArticle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { StockOrderPageContent } from '@/components/order-pages/StockOrderPageContent';


// Combine all mock asset lists for easier lookup
const allMockAssets: Stock[] = [
  ...mockStocks,
  ...mockUsStocks,
];

function getRelevantNewsForStock(stock: Stock | null, allNews: NewsArticle[]): NewsArticle[] {
    if (!stock || !allNews.length) {
        return [];
    }
    const relevantNews: NewsArticle[] = [];
    const stockKeywords = [stock.name.toLowerCase(), stock.symbol.toLowerCase()];
    if(stock.sector) stockKeywords.push(stock.sector.toLowerCase());


    allNews.forEach(news => {
        const headlineLower = news.headline.toLowerCase();
        if (stockKeywords.some(keyword => keyword && headlineLower.includes(keyword))) {
        relevantNews.push(news);
        }
    });
    return relevantNews;
}


export default function StockOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const symbol = typeof params.symbol === 'string' ? decodeURIComponent(params.symbol) : undefined;

  const [asset, setAsset] = useState<Stock | null>(null);
  const [assetSpecificNews, setAssetSpecificNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    if (symbol) {
      // For a stock page, we explicitly look for assets that are typically stocks
      const foundAsset = allMockAssets.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());

      if (foundAsset) {
        setAsset(foundAsset);
        const relevantNews = getRelevantNewsForStock(foundAsset, mockNewsArticles);
        setAssetSpecificNews(relevantNews);

      } else {
        toast({
          title: "Error",
          description: `Stock with symbol ${symbol} not found.`,
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
      <StockOrderPageContent asset={asset} assetSpecificNews={assetSpecificNews} />
    </ProtectedRoute>
  );
}