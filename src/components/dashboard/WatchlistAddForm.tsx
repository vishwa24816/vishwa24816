
"use client";

import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import type { Stock } from '@/types';
import { mockStocks, mockIndexFuturesForWatchlist, mockStockFuturesForWatchlist, mockCryptoAssets, mockMutualFunds, mockBonds, mockOptionsForWatchlist, mockCryptoFuturesForWatchlist } from '@/lib/mockData';
import { mockUsStocks } from '@/lib/mockData/usStocks';

const allSearchableAssets: Stock[] = [
    ...mockStocks,
    ...mockUsStocks,
    ...mockIndexFuturesForWatchlist,
    ...mockStockFuturesForWatchlist,
    ...mockOptionsForWatchlist,
    ...mockCryptoAssets,
    ...mockCryptoFuturesForWatchlist,
    ...mockMutualFunds,
    ...mockBonds
];

interface WatchlistAddFormProps {
    onAddStock: (stock: Stock) => void;
    isPredefinedList: boolean;
    toast: (options: { title: string; description: string; variant?: "default" | "destructive" | undefined; }) => void;
}

export const WatchlistAddForm: React.FC<WatchlistAddFormProps> = ({ onAddStock, isPredefinedList, toast }) => {
    const [newStockSymbol, setNewStockSymbol] = useState('');

    const handleAddStock = (e: FormEvent) => {
        e.preventDefault();
        if (!newStockSymbol.trim()) return;

        if (isPredefinedList) {
            toast({ title: "Info", description: "This is a predefined watchlist and cannot be modified here."});
            setNewStockSymbol('');
            return;
        }

        const stockToAdd = allSearchableAssets.find(stock => stock.symbol.toUpperCase() === newStockSymbol.toUpperCase());

        if (stockToAdd) {
            onAddStock(stockToAdd);
        } else {
            toast({ title: "Asset Not Found", description: `Could not find asset with symbol: ${newStockSymbol}. Please try common symbols.`, variant: "destructive" });
        }
        setNewStockSymbol('');
    };

    return (
        <form onSubmit={handleAddStock} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter symbol (e.g., RELIANCE, NIFTYJANFUT)"
              value={newStockSymbol}
              onChange={(e) => setNewStockSymbol(e.target.value.toUpperCase())}
              className="flex-grow"
            />
            <Button type="submit" size="icon" aria-label="Add stock to watchlist">
              <PlusCircle className="h-5 w-5" />
            </Button>
        </form>
    );
};
