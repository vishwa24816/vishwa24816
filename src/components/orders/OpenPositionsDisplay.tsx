
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PortfolioHolding, IntradayPosition, FoPosition, CryptoFuturePosition } from '@/types';
import { mockPortfolioHoldings, mockIntradayPositions, mockFoPositions, mockCryptoFutures, mockWeb3Holdings } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, InfoIcon, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PositionItemProps {
  item: PortfolioHolding | IntradayPosition | FoPosition | CryptoFuturePosition;
  type: string;
}

const PositionItemCard: React.FC<PositionItemProps> = ({ item, type }) => {
  const { toast } = useToast();
  const router = useRouter();

  let name = '', symbolDisplay = '', qty = '', avgPrice = '', ltp = '', pnl = '', pnlPercent = '', details = '';
  let isProfit = true;

  // Determine display values based on item type
  if (type === 'Holding') {
    const holdingItem = item as PortfolioHolding;
    name = holdingItem.name;
    symbolDisplay = holdingItem.symbol || '';
    qty = `${holdingItem.quantity.toLocaleString()} units`;
    avgPrice = `Avg: ₹${holdingItem.avgCostPrice.toFixed(2)}`;
    ltp = `LTP: ₹${holdingItem.ltp.toFixed(2)}`;
    pnl = `₹${holdingItem.profitAndLoss.toFixed(2)}`;
    pnlPercent = `(${holdingItem.profitAndLossPercent.toFixed(2)}%)`;
    isProfit = holdingItem.profitAndLoss >= 0;
  } else if (type === 'Intraday') {
    const intradayItem = item as IntradayPosition;
    name = intradayItem.name;
    symbolDisplay = intradayItem.symbol;
    qty = `${intradayItem.quantity.toLocaleString()} units (${intradayItem.transactionType})`;
    avgPrice = `Avg: ₹${intradayItem.avgPrice.toFixed(2)}`;
    ltp = `LTP: ₹${intradayItem.ltp.toFixed(2)}`;
    pnl = `₹${intradayItem.pAndL.toFixed(2)}`;
    pnlPercent = `(${intradayItem.pAndLPercent.toFixed(2)}%)`;
    isProfit = intradayItem.pAndL >= 0;
  } else if (type === 'F&O') {
    const foItem = item as FoPosition;
    name = foItem.instrumentName;
    // symbolDisplay is not directly applicable here, name is primary
    qty = `${foItem.lots} Lots (${foItem.transactionType})`;
    avgPrice = `Avg: ₹${foItem.avgPrice.toFixed(2)}`;
    ltp = `LTP: ₹${foItem.ltp.toFixed(2)}`;
    pnl = `₹${foItem.pAndL.toFixed(2)}`;
    pnlPercent = `(${foItem.pAndLPercent.toFixed(2)}%)`;
    details = `Expiry: ${new Date(foItem.expiryDate).toLocaleDateString()}`;
    isProfit = foItem.pAndL >= 0;
  } else if (type === 'Crypto Future') {
    const cryptoFutItem = item as CryptoFuturePosition;
    name = cryptoFutItem.symbol; // Name is the symbol for crypto futures
    symbolDisplay = ''; // No separate symbol display needed
    qty = `${cryptoFutItem.quantity} (${cryptoFutItem.positionSide})`;
    avgPrice = `Entry: ${cryptoFutItem.entryPrice.toFixed(2)} USDT`;
    ltp = `Mark: ${cryptoFutItem.markPrice.toFixed(2)} USDT`;
    pnl = `${cryptoFutItem.unrealizedPnL.toFixed(2)} USDT`;
    isProfit = cryptoFutItem.unrealizedPnL >= 0;
    details = `Leverage: ${cryptoFutItem.leverage}x`;
  } else if (type === 'Crypto' || type === 'Web3') { // Explicitly handling 'Crypto' passed as type prop
    const cryptoItem = item as PortfolioHolding; // Assuming it's from portfolio holdings
    name = cryptoItem.name;
    symbolDisplay = cryptoItem.symbol || '';
    qty = `${cryptoItem.quantity.toLocaleString()} units`;
    avgPrice = `Avg: ₹${cryptoItem.avgCostPrice.toFixed(2)}`;
    ltp = `LTP: ₹${cryptoItem.ltp.toFixed(2)}`;
    pnl = `₹${cryptoItem.profitAndLoss.toFixed(2)}`;
    pnlPercent = `(${cryptoItem.profitAndLossPercent.toFixed(2)}%)`;
    isProfit = cryptoItem.profitAndLoss >= 0;
  }


  const handleInfoClick = () => {
    let routerSymbolForPath: string | undefined;
    let path = '';

    if (type === "Holding") {
      const holdingItem = item as PortfolioHolding;
      routerSymbolForPath = holdingItem.symbol;
      if (routerSymbolForPath) {
        const encodedSymbol = encodeURIComponent(routerSymbolForPath);
        if (holdingItem.type === 'Stock' || holdingItem.type === 'ETF') {
          path = `/order/stock/${encodedSymbol}`;
        } else if (holdingItem.type === 'Crypto') {
          path = `/order/crypto/${encodedSymbol}`;
        }
      }
    } else if (type === "Intraday") {
      const intradayItem = item as IntradayPosition;
      routerSymbolForPath = intradayItem.symbol;
      if (routerSymbolForPath) path = `/order/stock/${encodeURIComponent(routerSymbolForPath)}`;
    } else if (type === "F&O") {
      const foItem = item as FoPosition;
      routerSymbolForPath = foItem.instrumentName; // F&O uses instrumentName as the key
      if(routerSymbolForPath) {
        const encodedSymbol = encodeURIComponent(routerSymbolForPath);
        if (foItem.optionType === 'FUT') {
          path = `/order/future/${encodedSymbol}`;
        } else if (foItem.optionType === 'CE' || foItem.optionType === 'PE') {
          path = `/order/option/${encodedSymbol}`;
        }
      }
    } else if (type === "Crypto") { 
      const cryptoItem = item as PortfolioHolding; 
      routerSymbolForPath = cryptoItem.symbol;
      if (routerSymbolForPath) path = `/order/crypto/${encodeURIComponent(routerSymbolForPath)}`;
    } else if (type === "Web3") {
      const web3Item = item as PortfolioHolding;
      routerSymbolForPath = web3Item.symbol;
      if (routerSymbolForPath) path = `/order/crypto/${encodeURIComponent(routerSymbolForPath)}`; // Web3 assets use the crypto order page for now
    } else if (type === "Crypto Future") {
      const cryptoFutItem = item as CryptoFuturePosition;
      routerSymbolForPath = cryptoFutItem.symbol;
      if (routerSymbolForPath) path = `/order/crypto-future/${encodeURIComponent(routerSymbolForPath)}`;
    }

    if (!routerSymbolForPath) {
      toast({ title: "Error", description: "Identifier not found for navigation.", variant: "destructive" });
      return;
    }

    if (path) {
      router.push(path);
    } else {
      toast({
        title: "Navigation Info",
        description: `Info click for ${routerSymbolForPath}. Path not determined for type: ${type} / item type: ${'type' in item ? (item as any).type : 'N/A'}.`,
        variant: "default"
      });
    }
  };

  const handleExitClick = () => {
    const exitName = name || symbolDisplay;
    toast({ title: `Close/Exit: ${exitName}`, variant: "destructive"});
  };


  return (
    <Card className="mb-3 shadow-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-md font-semibold flex justify-between items-center">
          <span>{name} {symbolDisplay && `(${symbolDisplay})`}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{type}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs px-4 pb-3 space-y-1">
        <div className="flex justify-between"><span>Qty: {qty}</span> <span className={cn(isProfit ? "text-green-600" : "text-red-600")}>P&L: {pnl} {pnlPercent}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>{avgPrice}</span> <span>{ltp}</span></div>
        {details && <p className="text-muted-foreground">{details}</p>}
      </CardContent>
      <CardFooter className="px-4 py-2 border-t flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={handleInfoClick}>
          <InfoIcon className="mr-2 h-4 w-4" />
          Info
        </Button>
        <Button variant="destructive" size="sm" className="flex-1" onClick={handleExitClick}>
          <XCircle className="mr-2 h-4 w-4" />
          Exit
        </Button>
      </CardFooter>
    </Card>
  );
};

interface OpenPositionsDisplayProps {
  isRealMode?: boolean;
  activeMode: 'Fiat' | 'Crypto' | 'Web3';
}

export function OpenPositionsDisplay({ isRealMode = false, activeMode }: OpenPositionsDisplayProps) {
  const allPositions = React.useMemo(() => {
    // Demo mode includes a mix of all types
    const demoPositions = [
      ...mockPortfolioHoldings.filter(h => h.type === 'Stock' || h.type === 'ETF').map(item => ({ item, typeLabel: "Holding", category: 'Fiat' as const })),
      ...mockIntradayPositions.map(item => ({ item, typeLabel: "Intraday", category: 'Fiat' as const })),
      ...mockFoPositions.map(item => ({ item, typeLabel: "F&O", category: 'Fiat' as const })),
      ...mockPortfolioHoldings.filter(h => h.type === 'Crypto').map(item => ({ item, typeLabel: "Crypto", category: 'Crypto' as const })),
      ...mockCryptoFutures.map(item => ({ item, typeLabel: "Crypto Future", category: 'Crypto' as const })),
      ...mockWeb3Holdings.map(item => ({ item, typeLabel: "Web3", category: 'Web3' as const })),
    ];
    
    // Real mode is focused on crypto/web3
    const realPositions = [
      ...mockPortfolioHoldings.filter(h => h.type === 'Crypto').map(item => ({ item, typeLabel: "Crypto", category: 'Crypto' as const })),
      ...mockCryptoFutures.map(item => ({ item, typeLabel: "Crypto Future", category: 'Crypto' as const })),
      ...mockWeb3Holdings.map(item => ({ item, typeLabel: "Web3", category: 'Web3' as const })),
    ];
    
    const basePositions = isRealMode ? realPositions : demoPositions;

    return basePositions.filter(p => p.category === activeMode);

  }, [isRealMode, activeMode]);

  if (allPositions.length === 0) {
    return (
      <div className="text-center py-10">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No open positions or holdings found for {activeMode} mode.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] p-1">
      {allPositions.map((pos, index) => (
        <PositionItemCard key={`${pos.typeLabel}-${pos.item.id}-${index}`} item={pos.item} type={pos.typeLabel} />
      ))}
    </ScrollArea>
  );
}
