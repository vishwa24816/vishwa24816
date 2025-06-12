
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockFoPositions } from '@/lib/mockData';
import type { FoPosition } from '@/types';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';

export function FoPositionsSection() {
  const positions = mockFoPositions;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const totalPandL = positions.reduce((acc, pos) => acc + pos.pAndL, 0);
  const totalQuantity = (pos: FoPosition) => pos.lots * pos.quantityPerLot;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
          <Layers className="h-6 w-6 mr-2" /> F&O Positions
        </CardTitle>
         <div className="pt-2">
            <p className="text-sm text-muted-foreground">Total P&L</p>
            <p className={cn("text-lg font-semibold", totalPandL >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(totalPandL)}
            </p>
        </div>
      </CardHeader>
      <CardContent>
        {positions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">You have no open F&O positions.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Instrument</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Lots</TableHead>
                <TableHead className="text-right">Qty.</TableHead>
                <TableHead className="text-right">Avg. Price</TableHead>
                <TableHead className="text-right">LTP</TableHead>
                <TableHead className="text-right">P&L (%)</TableHead>
                <TableHead className="text-right">Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((pos) => (
                <TableRow key={pos.id}>
                  <TableCell className="font-medium">{pos.instrumentName}</TableCell>
                  <TableCell>
                    <span className={cn(pos.transactionType === 'BUY' ? 'text-green-600' : 'text-red-600')}>{pos.transactionType}</span>
                    <span className="ml-1 text-xs text-muted-foreground">({pos.optionType})</span>
                  </TableCell>
                  <TableCell className="text-right">{pos.lots}</TableCell>
                  <TableCell className="text-right">{totalQuantity(pos).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{formatCurrency(pos.avgPrice)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(pos.ltp)}</TableCell>
                   <TableCell className={cn("text-right whitespace-nowrap", pos.pAndL >= 0 ? 'text-green-600' : 'text-red-600')}>
                    {formatCurrency(pos.pAndL)}<br/>({pos.pAndLPercent.toFixed(2)}%)
                  </TableCell>
                  <TableCell className="text-right">{new Date(pos.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
