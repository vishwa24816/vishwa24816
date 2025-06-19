
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PortfolioHolding, IntradayPosition, FoPosition, CryptoFuturePosition } from '@/types';
import { mockPortfolioHoldings, mockIntradayPositions, mockFoPositions, mockCryptoFutures } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, TrendingUp, Layers, Repeat, TrendingDownIcon } from 'lucide-react';

interface PositionItemProps {
  item: PortfolioHolding | IntradayPosition | FoPosition | CryptoFuturePosition;
  type: string;
}

const PositionItemCard: React.FC<PositionItemProps> = ({ item, type }) => {
  const { toast } = useToast();

  let name = '', symbol = '', qty = '', avgPrice = '', ltp = '', pnl = '', pnlPercent = '', details = '';
  let isProfit = true;

  if ('name' in item && 'symbol' in item && 'ltp' in item && 'avgCostPrice' in item && 'quantity' in item && 'profitAndLoss' in item && 'profitAndLossPercent' in item && (item.type === 'Stock' || item.type === 'ETF' || item.type === 'Crypto')) { // PortfolioHolding (Stock/ETF/Crypto)
    name = item.name;
    symbol = item.symbol || '';
    qty = `${item.quantity.toLocaleString()} units`;
    avgPrice = `Avg: ₹${item.avgCostPrice.toFixed(2)}`;
    ltp = `LTP: ₹${item.ltp.toFixed(2)}`;
    pnl = `₹${item.profitAndLoss.toFixed(2)}`;
    pnlPercent = `(${item.profitAndLossPercent.toFixed(2)}%)`;
    isProfit = item.profitAndLoss >= 0;
  } else if ('name' in item && 'symbol' in item && 'transactionType' in item && 'avgPrice' in item && 'ltp' in item && 'pAndL' in item && 'pAndLPercent' in item ) { // IntradayPosition
    name = item.name;
    symbol = item.symbol;
    qty = `${item.quantity.toLocaleString()} units (${item.transactionType})`;
    avgPrice = `Avg: ₹${item.avgPrice.toFixed(2)}`;
    ltp = `LTP: ₹${item.ltp.toFixed(2)}`;
    pnl = `₹${item.pAndL.toFixed(2)}`;
    pnlPercent = `(${item.pAndLPercent.toFixed(2)}%)`;
    isProfit = item.pAndL >= 0;
  } else if ('instrumentName' in item && 'optionType' in item && 'ltp' in item && 'avgPrice' in item && 'lots' in item && 'pAndL' in item && 'pAndLPercent' in item) { // FoPosition
    name = item.instrumentName;
    qty = `${item.lots} Lots (${item.transactionType})`;
    avgPrice = `Avg: ₹${item.avgPrice.toFixed(2)}`;
    ltp = `LTP: ₹${item.ltp.toFixed(2)}`;
    pnl = `₹${item.pAndL.toFixed(2)}`;
    pnlPercent = `(${item.pAndLPercent.toFixed(2)}%)`;
    details = `Expiry: ${new Date(item.expiryDate).toLocaleDateString()}`;
    isProfit = item.pAndL >= 0;
  } else if ('symbol' in item && 'positionSide' in item && 'markPrice' in item && 'entryPrice' in item && 'quantity' in item && 'unrealizedPnL' in item) { // CryptoFuturePosition
    name = item.symbol;
    qty = `${item.quantity} (${item.positionSide})`;
    avgPrice = `Entry: ${item.entryPrice.toFixed(2)} USDT`;
    ltp = `Mark: ${item.markPrice.toFixed(2)} USDT`;
    pnl = `${item.unrealizedPnL.toFixed(2)} USDT`;
    isProfit = item.unrealizedPnL >= 0;
    details = `Leverage: ${item.leverage}x`;
  }


  return (
    <Card className="mb-3 shadow-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-md font-semibold flex justify-between items-center">
          <span>{name} {symbol && `(${symbol})`}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{type}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs px-4 pb-3 space-y-1">
        <div className="flex justify-between"><span>Qty: {qty}</span> <span className={cn(isProfit ? "text-green-600" : "text-red-600")}>P&L: {pnl} {pnlPercent}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>{avgPrice}</span> <span>{ltp}</span></div>
        {details && <p className="text-muted-foreground">{details}</p>}
      </CardContent>
      <CardFooter className="px-4 py-2 border-t flex justify-end space-x-2">
        <Button variant="outline" size="xs" onClick={() => toast({ title: `Info: ${name}`})}>Info</Button>
        <Button variant="destructive" size="xs" onClick={() => toast({ title: `Close/Exit: ${name}`, variant: "destructive"})}>Exit</Button>
      </CardFooter>
    </Card>
  );
};


export function OpenPositionsDisplay() {
  const equityHoldings = mockPortfolioHoldings.filter(h => h.type === 'Stock' || h.type === 'ETF');
  const cryptoHoldings = mockPortfolioHoldings.filter(h => h.type === 'Crypto');
  const allPositions = [
    ...equityHoldings.map(item => ({ item, type: "Holding" })),
    ...mockIntradayPositions.map(item => ({ item, type: "Intraday" })),
    ...mockFoPositions.map(item => ({ item, type: "F&O" })),
    ...cryptoHoldings.map(item => ({ item, type: "Crypto" })),
    ...mockCryptoFutures.map(item => ({ item, type: "Crypto Future" })),
  ];

  if (allPositions.length === 0) {
    return (
      <div className="text-center py-10">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No open positions or holdings found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] p-1"> {/* Adjust height as needed */}
      {allPositions.map((pos, index) => (
        <PositionItemCard key={`${pos.type}-${pos.item.id}-${index}`} item={pos.item} type={pos.type} />
      ))}
    </ScrollArea>
  );
}
