
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import type { CryptoFuturePosition } from '@/types';
import { cn } from '@/lib/utils';
import { Repeat, XCircle, Settings2, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CryptoFuturesSectionProps {
  positions: CryptoFuturePosition[];
  cashBalance: number;
}

const PositionRow = ({ position, onAdjust, onExit }: { position: CryptoFuturePosition, onAdjust: () => void, onExit: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    };
    const formatPrice = (value: number) => {
        return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const isPnlPositive = position.unrealizedPnL >= 0;
    const isMtmPositive = position.mtmPnl >= 0;

    return (
        <div className="border-b transition-all duration-300">
            <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{position.symbol}</p>
                    <p className={cn("text-xs font-medium", position.positionSide === 'LONG' ? 'text-green-600' : 'text-red-600')}>{position.positionSide}</p>
                </div>
                <div className="text-right ml-2 shrink-0">
                    <p className={cn("text-sm font-medium", isPnlPositive ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(position.unrealizedPnL)}
                    </p>
                    <p className={cn("text-xs", isMtmPositive ? 'text-green-500' : 'text-red-500')}>MTM: {formatCurrency(position.mtmPnl)}</p>
                </div>
                <ChevronDown className={cn("h-4 w-4 ml-3 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
            </div>

            {isExpanded && (
                <div className="bg-muted/30 px-3 py-3 space-y-3 animate-accordion-down">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div><p className="text-muted-foreground">Quantity</p><p className="font-medium text-foreground">{position.quantity.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})}</p></div>
                        <div className="text-right"><p className="text-muted-foreground">Leverage</p><p className="font-medium text-foreground">{position.leverage}x</p></div>
                        <div><p className="text-muted-foreground">Entry / Mark Price</p><p className="font-medium text-foreground">{formatPrice(position.entryPrice)} / {formatPrice(position.markPrice)}</p></div>
                        <div className="text-right"><p className="text-muted-foreground">Liq. Price</p><p className="font-medium text-foreground">{position.liquidationPrice ? formatPrice(position.liquidationPrice) : '-'}</p></div>
                        <div><p className="text-muted-foreground">Margin</p><p className="font-medium text-foreground">{formatCurrency(position.margin)}</p></div>
                    </div>
                    <div className="pt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 justify-center" onClick={onAdjust}><Settings2 className="mr-2 h-4 w-4" /> Adjust</Button>
                        <Button size="sm" variant="destructive" className="flex-1 justify-center" onClick={onExit}><XCircle className="mr-2 h-4 w-4" /> Exit</Button>
                    </div>
                </div>
            )}
        </div>
    );
};


export function CryptoFuturesSection({ positions, cashBalance }: CryptoFuturesSectionProps) {
  const router = useRouter();
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleAdjustPosition = (pos: CryptoFuturePosition) => {
      router.push(`/order/crypto-future/${encodeURIComponent(pos.symbol)}`);
  };

  const handleExitPosition = (pos: CryptoFuturePosition) => {
    toast({
      title: `Exiting Position (Mock): ${pos.symbol}`,
      description: `A market order would be placed to close this position.`,
      variant: "destructive"
    });
  };

  const totalUnrealizedPnL = positions.reduce((acc, pos) => acc + pos.unrealizedPnL, 0);
  const totalMtmPnl = positions.reduce((acc, pos) => acc + pos.mtmPnl, 0);
  const totalMargin = positions.reduce((acc, pos) => acc + pos.margin, 0);
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
              <Repeat className="h-6 w-6 mr-2" /> Crypto Futures
            </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 pb-4 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">MTM P&L</p>
              <p className={cn("text-lg font-semibold", totalMtmPnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(totalMtmPnl)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall P&L</p>
              <p className={cn("text-lg font-semibold", totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(totalUnrealizedPnL)}
              </p>
            </div>
            <div className='text-right'>
               <p className="text-sm text-muted-foreground">Used Margin</p>
               <p className="text-lg font-semibold">{formatCurrency(totalMargin)}</p>
            </div>
            <div className='text-right'>
               <p className="text-sm text-muted-foreground">Available Margin</p>
               <p className="text-lg font-semibold">{formatCurrency(cashBalance)}</p>
            </div>
          </div>
        </div>
        
        {positions.length > 0 ? (
          <div>
            {positions.map((pos) => (
              <PositionRow 
                key={pos.id} 
                position={pos}
                onAdjust={() => handleAdjustPosition(pos)}
                onExit={() => handleExitPosition(pos)}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">You have no open crypto futures positions.</p>
        )}
      </CardContent>
    </Card>
  );
}
