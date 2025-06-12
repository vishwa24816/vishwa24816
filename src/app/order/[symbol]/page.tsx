
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { mockStocks, mockCryptoAssets, mockMutualFunds, mockBonds, mockIndexFuturesForWatchlist, mockStockFuturesForWatchlist, mockOptionsForWatchlist } from '@/lib/mockData';
import type { Stock } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';

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


export default function OrderPlacementPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const symbol = typeof params.symbol === 'string' ? decodeURIComponent(params.symbol) : undefined;

  const [stock, setStock] = useState<Stock | null>(null);
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [productType, setProductType] = useState<'INTRADAY' | 'DELIVERY'>('DELIVERY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [triggerPrice, setTriggerPrice] = useState(''); // For SL orders, not fully implemented in UI

  useEffect(() => {
    if (symbol) {
      const foundStock = allMockAssets.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
      if (foundStock) {
        setStock(foundStock);
      } else {
        toast({
          title: "Error",
          description: `Stock with symbol ${symbol} not found.`,
          variant: "destructive",
        });
        router.push('/'); // Redirect if stock not found
      }
    }
  }, [symbol, router, toast]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stock) return;

    // Basic validation
    if (!quantity || parseInt(quantity) <= 0) {
      toast({ title: "Invalid Quantity", description: "Please enter a valid quantity.", variant: "destructive" });
      return;
    }
    if (orderType === 'LIMIT' && (!price || parseFloat(price) <= 0)) {
      toast({ title: "Invalid Price", description: "Please enter a valid limit price.", variant: "destructive" });
      return;
    }

    toast({
      title: "Order Placed (Mock)",
      description: `${side} ${quantity} of ${stock.symbol} ${orderType === 'LIMIT' ? `at ${price}` : 'at Market Price'}. Product: ${productType}.`,
    });
    // Reset form or navigate away
    // router.push('/orders');
  };

  if (!stock) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
            <p>Loading stock details...</p>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const isPositiveChange = stock.change >= 0;

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-primary hover:bg-primary/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Card className="w-full max-w-2xl mx-auto shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-headline text-primary flex items-center mb-1">
                    <ShoppingCart className="mr-3 h-7 w-7" /> Order for {stock.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {stock.symbol} ({stock.exchange || 'N/A'})
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.price.toFixed(2)}
                  </p>
                  <p className={`text-xs ${isPositiveChange ? 'text-green-500' : 'text-red-500'} flex items-center justify-end`}>
                    {isPositiveChange ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                    {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div>
                  <Label className="text-base">Side</Label>
                  <RadioGroup defaultValue="BUY" value={side} onValueChange={(value: 'BUY' | 'SELL') => setSide(value)} className="flex space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BUY" id="buy" className="text-green-600 border-green-600 focus:ring-green-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-700" />
                      <Label htmlFor="buy" className="text-base text-green-700 dark:text-green-500">Buy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SELL" id="sell" className="text-red-600 border-red-600 focus:ring-red-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-700" />
                      <Label htmlFor="sell" className="text-base text-red-700 dark:text-red-500">Sell</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base">Product</Label>
                  <RadioGroup defaultValue="DELIVERY" value={productType} onValueChange={(value: 'INTRADAY' | 'DELIVERY') => setProductType(value)} className="flex space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="DELIVERY" id="delivery" />
                      <Label htmlFor="delivery" className="text-base">Delivery (CNC)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="INTRADAY" id="intraday" />
                      <Label htmlFor="intraday" className="text-base">Intraday (MIS)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base">Order Type</Label>
                  <RadioGroup defaultValue="MARKET" value={orderType} onValueChange={(value: 'MARKET' | 'LIMIT') => setOrderType(value)} className="flex space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MARKET" id="market" />
                      <Label htmlFor="market" className="text-base">Market</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="LIMIT" id="limit" />
                      <Label htmlFor="limit" className="text-base">Limit</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity" className="text-base">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g., 10"
                      className="mt-1"
                      min="1"
                    />
                  </div>
                  {orderType === 'LIMIT' && (
                    <div>
                      <Label htmlFor="price" className="text-base">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={`e.g., ${stock.price.toFixed(2)}`}
                        className="mt-1"
                        step="0.05"
                        min="0.05"
                      />
                    </div>
                  )}
                </div>
                
                {/* Placeholder for future SL order type inputs
                {orderType === 'SL' || orderType === 'SL-M' && (
                  <div>
                    <Label htmlFor="triggerPrice">Trigger Price</Label>
                    <Input id="triggerPrice" type="number" value={triggerPrice} onChange={(e) => setTriggerPrice(e.target.value)} />
                  </div>
                )}
                */}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" className="w-full sm:w-auto text-lg py-3 px-6 flex-grow" disabled={!quantity}>
                    Place {side === 'BUY' ? 'Buy' : 'Sell'} Order
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto text-lg py-3 px-6">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
