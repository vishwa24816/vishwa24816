
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockIntradayPositions } from '@/lib/mockData';
import type { IntradayPosition } from '@/types';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

export function IntradayPositionsSection() {
  const positions = mockIntradayPositions;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const totalPandL = positions.reduce((acc, pos) => acc + pos.pAndL, 0);

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold font-headline text-primary flex items-center mb-2 sm:mb-0">
          <TrendingUp className="h-6 w-6 mr-2" /> Intraday Positions
        </h2>
        <div className="text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Total P&L</p>
            <p className={cn("text-lg font-semibold", totalPandL >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(totalPandL)}
            </p>
        </div>
      </div>
      
      {positions.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">You have no open intraday positions.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Instrument</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Qty.</TableHead>
              <TableHead className="text-right">Avg. Price</TableHead>
              <TableHead className="text-right">LTP</TableHead>
              <TableHead className="text-right">P&L (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((pos) => (
              <TableRow key={pos.id}>
                <TableCell className="font-medium">
                  <div>{pos.name}</div>
                  <div className="text-xs text-muted-foreground">{pos.symbol}</div>
                </TableCell>
                <TableCell
                  className={cn(
                    pos.transactionType === 'BUY' ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {pos.transactionType}
                </TableCell>
                <TableCell className="text-right">{pos.quantity.toLocaleString()}</TableCell>
                <TableCell className="text-right">{formatCurrency(pos.avgPrice)}</TableCell>
                <TableCell className="text-right">{formatCurrency(pos.ltp)}</TableCell>
                <TableCell className={cn("text-right whitespace-nowrap", pos.pAndL >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(pos.pAndL)}<br/>({pos.pAndLPercent.toFixed(2)}%)
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
