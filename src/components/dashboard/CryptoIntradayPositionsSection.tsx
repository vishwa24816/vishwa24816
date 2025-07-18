
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import type { IntradayPosition } from '@/types';
import { cn } from '@/lib/utils';
import { TrendingUp, XCircle, Settings2, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CryptoIntradayPositionsSectionProps {
  positions: IntradayPosition[];
}

const PositionRow = ({ position, onAdjust, onExit }: { position: IntradayPosition, onAdjust: () => void, onExit: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    };

    const isProfit = position.pAndL >= 0;

    return (
        <div className="border-b transition-all duration-300">
            <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{position.name} ({position.symbol})</p>
                    <p className={cn("text-xs font-medium", position.transactionType === 'BUY' ? 'text-green-600' : 'text-red-600')}>{position.transactionType}</p>
                </div>
                <div className="text-right ml-2 shrink-0">
                    <p className={cn("text-sm font-medium", isProfit ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(position.pAndL)}
                    </p>
                    <p className="text-xs text-muted-foreground">({position.pAndLPercent.toFixed(2)}%)</p>
                </div>
                <ChevronDown className={cn("h-4 w-4 ml-3 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
            </div>

            {isExpanded && (
                <div className="bg-muted/30 px-3 py-3 space-y-3 animate-accordion-down">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div><p className="text-muted-foreground">Quantity</p><p className="font-medium text-foreground">{position.quantity.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})}</p></div>
                        <div className="text-right"><p className="text-muted-foreground">Avg. Price</p><p className="font-medium text-foreground">{formatCurrency(position.avgPrice)}</p></div>
                        <div><p className="text-muted-foreground">LTP</p><p className="font-medium text-foreground">{formatCurrency(position.ltp)}</p></div>
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


export function CryptoIntradayPositionsSection({ positions }: CryptoIntradayPositionsSectionProps) {
  const router = useRouter();
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
     return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };
  
  const handleAdjustPosition = (pos: IntradayPosition) => {
      router.push(`/order/crypto/${encodeURIComponent(pos.symbol)}`);
  };

  const handleExitPosition = (pos: IntradayPosition) => {
    toast({
      title: `Exiting Position (Mock): ${pos.symbol}`,
      description: `A market order would be placed to close this position.`,
      variant: "destructive"
    });
  };

  const totalPandL = positions.reduce((acc, pos) => acc + pos.pAndL, 0);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center mb-2 sm:mb-0">
            <TrendingUp className="h-6 w-6 mr-2" /> Crypto Intraday Positions
          </CardTitle>
          <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <p className={cn("text-lg font-semibold", totalPandL >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(totalPandL)}
              </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {positions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 px-6">You have no open crypto intraday positions.</p>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
