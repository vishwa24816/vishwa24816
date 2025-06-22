
"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { mockCryptoFutures } from '@/lib/mockData';
import type { CryptoFuturePosition } from '@/types';
import { cn } from '@/lib/utils';
import { Repeat, PlusCircle, MinusCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function CryptoFuturesSection() {
  const positions = mockCryptoFutures;
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };
   const formatPrice = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleRowClick = (positionId: string) => {
    setExpandedRowId(prevId => (prevId === positionId ? null : positionId));
  };

  const totalUnrealizedPnL = positions.reduce((acc, pos) => acc + pos.unrealizedPnL, 0);

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold font-headline text-primary flex items-center mb-2 sm:mb-0">
          <Repeat className="h-6 w-6 mr-2" /> Crypto Futures
        </h2>
        <div className="text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Total Unrealized P&L</p>
            <p className={cn("text-lg font-semibold", totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(totalUnrealizedPnL)}
            </p>
        </div>
      </div>
      
      {positions.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">You have no open crypto futures positions.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Side</TableHead>
              <TableHead className="text-right">Qty.</TableHead>
              <TableHead className="text-right">Entry Price</TableHead>
              <TableHead className="text-right">Mark Price</TableHead>
              <TableHead className="text-right">Liq. Price</TableHead>
              <TableHead className="text-right">Unrealized P&L</TableHead>
              <TableHead className="text-right">Margin (INR)</TableHead>
              <TableHead className="text-right">Leverage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((pos) => (
              <React.Fragment key={pos.id}>
                <TableRow
                  onClick={() => handleRowClick(pos.id)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{pos.symbol}</TableCell>
                  <TableCell className={cn(pos.positionSide === 'LONG' ? 'text-green-600' : 'text-red-600')}>
                    {pos.positionSide}
                  </TableCell>
                  <TableCell className="text-right">{pos.quantity.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})}</TableCell>
                  <TableCell className="text-right">{formatPrice(pos.entryPrice)}</TableCell>
                  <TableCell className="text-right">{formatPrice(pos.markPrice)}</TableCell>
                  <TableCell className="text-right">{pos.liquidationPrice ? formatPrice(pos.liquidationPrice) : '-'}</TableCell>
                  <TableCell className={cn("text-right", pos.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600')}>
                    {formatCurrency(pos.unrealizedPnL)}
                  </TableCell>
                  <TableCell className="text-right">{formatPrice(pos.margin)}</TableCell>
                  <TableCell className="text-right">{pos.leverage}x</TableCell>
                </TableRow>
                {expandedRowId === pos.id && (
                  <TableRow className="bg-muted/50 hover:bg-muted/60">
                    <TableCell colSpan={9} className="p-0">
                      <div className="p-4 space-y-3">
                        <h4 className="font-semibold text-md text-foreground">
                          {pos.symbol} ({pos.positionSide}) - Actions
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 justify-center text-green-600 border-green-500 hover:bg-green-500/10 hover:text-green-700" 
                            onClick={(e) => {
                                e.stopPropagation();
                                toast({ title: `Increase Position: ${pos.symbol}`});
                            }}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" /> Increase Position
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 justify-center text-orange-600 border-orange-500 hover:bg-orange-500/10 hover:text-orange-700" 
                            onClick={(e) => {
                                e.stopPropagation();
                                toast({ title: `Reduce Position: ${pos.symbol}`});
                            }}
                          >
                            <MinusCircle className="mr-2 h-4 w-4" /> Reduce Position
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="flex-1 justify-center" 
                            onClick={(e) => {
                                e.stopPropagation();
                                toast({ 
                                    title: `Close Position: ${pos.symbol}`,
                                    description: "This action would close your crypto future position.",
                                    variant: "destructive"
                                });
                            }}
                          >
                            <XCircle className="mr-2 h-4 w-4" /> Close Position
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
