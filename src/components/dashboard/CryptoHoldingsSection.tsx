
"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { mockPortfolioHoldings } from '@/lib/mockData';
import type { PortfolioHolding } from '@/types';
import { cn } from '@/lib/utils';
import { Bitcoin } from 'lucide-react'; 

export function CryptoHoldingsSection() {
  const cryptoHoldings = mockPortfolioHoldings.filter(holding => holding.type === 'Crypto');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const totalCurrentValue = cryptoHoldings.reduce((acc, holding) => acc + holding.currentValue, 0);
  const totalInvestmentValue = cryptoHoldings.reduce((acc, holding) => acc + (holding.quantity * holding.avgCostPrice), 0);
  const overallPandL = totalCurrentValue - totalInvestmentValue;
  const overallPandLPercent = totalInvestmentValue !== 0 ? (overallPandL / totalInvestmentValue) * 100 : 0;
  
  const totalDayChangeAbsolute = cryptoHoldings.reduce((acc, holding) => acc + holding.dayChangeAbsolute, 0);
  const totalPreviousDayValue = totalCurrentValue - totalDayChangeAbsolute;
  const totalDayChangePercent = totalPreviousDayValue !== 0 ? (totalDayChangeAbsolute / totalPreviousDayValue) * 100 : 0;

  if (cryptoHoldings.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold font-headline text-primary flex items-center">
            <Bitcoin className="h-6 w-6 mr-2" /> Crypto Wallet & Holdings
        </h2>
        <p className="text-muted-foreground text-center py-4">You have no crypto assets in your portfolio.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold font-headline text-primary flex items-center">
          <Bitcoin className="h-6 w-6 mr-2" /> Crypto Wallet & Holdings
      </h2>

      <div className="space-y-3 pt-2 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <p
              className={cn(
                "text-xl font-semibold",
                overallPandL >= 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              {formatCurrency(overallPandL)}
            </p>
            <p className="text-xs text-muted-foreground">
              Overall Crypto P&L ({overallPandLPercent.toFixed(2)}%)
            </p>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "text-xl font-semibold",
                totalDayChangeAbsolute >= 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              {formatCurrency(totalDayChangeAbsolute)}
            </p>
            <p className="text-xs text-muted-foreground">
              Day's Crypto P&L ({totalDayChangePercent.toFixed(2)}%)
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">Total Crypto Investment</p>
            <p className="font-medium text-foreground">
              {formatCurrency(totalInvestmentValue)}
            </p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">Current Crypto Value</p>
            <p className="font-medium text-foreground">
              {formatCurrency(totalCurrentValue)}
            </p>
          </div>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] min-w-[150px]">Asset</TableHead>
            <TableHead className="text-right">Qty.</TableHead>
            <TableHead className="text-right">Avg. Cost</TableHead>
            <TableHead className="text-right">LTP</TableHead>
            <TableHead className="text-right">Current Val.</TableHead>
            <TableHead className="text-right">P&L (%)</TableHead>
            <TableHead className="text-right">Day's Chg (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cryptoHoldings.map((holding) => (
            <TableRow key={holding.id}>
              <TableCell className="font-medium">
                <div>{holding.name}</div>
                {holding.symbol && <div className="text-xs text-muted-foreground">{holding.symbol}</div>}
              </TableCell>
              <TableCell className="text-right">{holding.quantity.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 8})}</TableCell>
              <TableCell className="text-right">{formatCurrency(holding.avgCostPrice)}</TableCell>
              <TableCell className="text-right">{formatCurrency(holding.ltp)}</TableCell>
              <TableCell className="text-right">{formatCurrency(holding.currentValue)}</TableCell>
              <TableCell className={cn("text-right whitespace-nowrap", holding.profitAndLoss >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(holding.profitAndLoss)}<br/>({holding.profitAndLossPercent.toFixed(2)}%)
              </TableCell>
              <TableCell className={cn("text-right whitespace-nowrap", holding.dayChangeAbsolute >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(holding.dayChangeAbsolute)}<br/>({holding.dayChangePercent.toFixed(2)}%)
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

