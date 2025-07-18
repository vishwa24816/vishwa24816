
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { mockFoPositions } from '@/lib/mockData';
import type { FoPosition } from '@/types';
import { cn } from '@/lib/utils';
import { Layers, XCircle, Settings2, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PositionRow = ({ position, onAdjust, onExit }: { position: FoPosition, onAdjust: () => void, onExit: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    };

    const isPnlPositive = position.pAndL >= 0;
    const isMtmPositive = position.mtmPnl >= 0;
    const totalQuantity = position.lots * position.quantityPerLot;

    return (
        <div className="border-b transition-all duration-300">
            <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{position.instrumentName}</p>
                    <p className={cn("text-xs font-medium", position.transactionType === 'BUY' ? 'text-green-600' : 'text-red-600')}>{position.transactionType} ({position.optionType})</p>
                </div>
                <div className="text-right ml-2 shrink-0">
                    <p className={cn("text-sm font-medium", isPnlPositive ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(position.pAndL)}
                    </p>
                    <p className={cn("text-xs", isMtmPositive ? 'text-green-500' : 'text-red-500')}>MTM: {formatCurrency(position.mtmPnl)}</p>
                </div>
                <ChevronDown className={cn("h-4 w-4 ml-3 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
            </div>

            {isExpanded && (
                <div className="bg-muted/30 px-3 py-3 space-y-3 animate-accordion-down">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div><p className="text-muted-foreground">Quantity</p><p className="font-medium text-foreground">{totalQuantity.toLocaleString()} ({position.lots} lots)</p></div>
                        <div className="text-right"><p className="text-muted-foreground">Avg. Price</p><p className="font-medium text-foreground">{formatCurrency(position.avgPrice)}</p></div>
                        <div><p className="text-muted-foreground">LTP</p><p className="font-medium text-foreground">{formatCurrency(position.ltp)}</p></div>
                        <div className="text-right"><p className="text-muted-foreground">P&L %</p><p className={cn("font-medium", isPnlPositive ? 'text-green-600' : 'text-red-600')}>{position.pAndLPercent.toFixed(2)}%</p></div>
                        <div><p className="text-muted-foreground">Expiry</p><p className="font-medium text-foreground">{new Date(position.expiryDate).toLocaleDateString()}</p></div>
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


export function FoPositionsSection() {
  const positions = mockFoPositions;
  const router = useRouter();
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleAdjustPosition = (pos: FoPosition) => {
    let path = '';
    if (pos.optionType === 'FUT') {
        path = `/order/future/${encodeURIComponent(pos.instrumentName)}`;
    } else if (pos.optionType === 'CE' || pos.optionType === 'PE') {
        path = `/order/option/${encodeURIComponent(pos.instrumentName)}`;
    }
    if (path) {
        router.push(path);
    }
  };

  const handleExitPosition = (pos: FoPosition) => {
    toast({
      title: `Exiting Position (Mock): ${pos.instrumentName}`,
      description: `A market order would be placed to close this position.`,
      variant: "destructive"
    });
  };

  const totalPandL = positions.reduce((acc, pos) => acc + pos.pAndL, 0);
  const totalMtmPnl = positions.reduce((acc, pos) => acc + pos.mtmPnl, 0);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center mb-2 sm:mb-0">
            <Layers className="h-6 w-6 mr-2" /> F&O Positions
          </CardTitle>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">MTM P&L</p>
              <p className={cn("text-lg font-semibold", totalMtmPnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(totalMtmPnl)}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">Overall P&L</p>
              <p className={cn("text-lg font-semibold", totalPandL >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(totalPandL)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {positions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 px-6">You have no open F&O positions.</p>
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
