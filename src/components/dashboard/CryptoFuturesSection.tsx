
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockCryptoFutures } from '@/lib/mockData';
import type { CryptoFuturePosition } from '@/types';
import { cn } from '@/lib/utils';
import { Repeat } from 'lucide-react';

export function CryptoFuturesSection() {
  const positions = mockCryptoFutures;

  const formatQuoteCurrency = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + ' USDT';
  };
   const formatPrice = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
                {formatQuoteCurrency(totalUnrealizedPnL)}
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
              <TableHead className="text-right">Margin (USDT)</TableHead>
              <TableHead className="text-right">Leverage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((pos) => (
              <TableRow key={pos.id}>
                <TableCell className="font-medium">{pos.symbol}</TableCell>
                <TableCell className={cn(pos.positionSide === 'LONG' ? 'text-green-600' : 'text-red-600')}>
                  {pos.positionSide}
                </TableCell>
                <TableCell className="text-right">{pos.quantity.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})}</TableCell>
                <TableCell className="text-right">{formatPrice(pos.entryPrice)}</TableCell>
                <TableCell className="text-right">{formatPrice(pos.markPrice)}</TableCell>
                <TableCell className="text-right">{pos.liquidationPrice ? formatPrice(pos.liquidationPrice) : '-'}</TableCell>
                <TableCell className={cn("text-right", pos.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatQuoteCurrency(pos.unrealizedPnL)}
                </TableCell>
                <TableCell className="text-right">{formatPrice(pos.margin)}</TableCell>
                <TableCell className="text-right">{pos.leverage}x</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
