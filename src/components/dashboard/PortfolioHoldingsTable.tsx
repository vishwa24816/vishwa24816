
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockPortfolioHoldings } from '@/lib/mockData';
import type { PortfolioHolding } from '@/types';
import { cn } from '@/lib/utils';
import { Briefcase } from 'lucide-react';

type HoldingFilterType = 'All' | 'Stock' | 'Mutual Fund';

export function PortfolioHoldingsTable() {
  const holdings = mockPortfolioHoldings;
  const [activeFilter, setActiveFilter] = useState<HoldingFilterType>('All');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const totalCurrentValue = holdings.reduce((acc, holding) => acc + holding.currentValue, 0);
  const totalInvestmentValue = holdings.reduce((acc, holding) => acc + (holding.quantity * holding.avgCostPrice), 0);
  const overallPandL = totalCurrentValue - totalInvestmentValue;
  const overallPandLPercent = totalInvestmentValue !== 0 ? (overallPandL / totalInvestmentValue) * 100 : 0;
  
  const totalDayChangeAbsolute = holdings.reduce((acc, holding) => acc + holding.dayChangeAbsolute, 0);
  const totalPreviousDayValue = totalCurrentValue - totalDayChangeAbsolute;
  const totalDayChangePercent = totalPreviousDayValue !== 0 ? (totalDayChangeAbsolute / totalPreviousDayValue) * 100 : 0;

  const filterOptions: { label: string; value: HoldingFilterType }[] = [
    { label: "All", value: "All" },
    { label: "Stocks", value: "Stock" },
    { label: "Mutual Funds", value: "Mutual Fund" },
  ];

  const filteredHoldings = holdings.filter(holding => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Stock') return holding.type === 'Stock' || holding.type === 'ETF';
    if (activeFilter === 'Mutual Fund') return holding.type === 'Mutual Fund';
    return false;
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
            <Briefcase className="h-6 w-6 mr-2" /> Portfolio Holdings
        </CardTitle>

        {/* Row 1: P&L Figures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div> {/* Overall P&L */}
                <p className="text-sm text-muted-foreground">Overall P&L</p>
                <p className={cn("text-lg font-semibold", overallPandL >= 0 ? 'text-green-600' : 'text-red-600')}>
                    {formatCurrency(overallPandL)} ({overallPandLPercent.toFixed(2)}%)
                </p>
            </div>
            <div className="text-left sm:text-right"> {/* Day's P&L */}
                <p className="text-sm text-muted-foreground">Day's P&L</p>
                <p className={cn("text-lg font-semibold", totalDayChangeAbsolute >= 0 ? 'text-green-600' : 'text-red-600')}>
                    {formatCurrency(totalDayChangeAbsolute)} ({totalDayChangePercent.toFixed(2)}%)
                </p>
            </div>
        </div>

        {/* Row 2: Investment & Current Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Removed mt from CardHeader's space-y */}
            <div> {/* Total Investment */}
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="font-semibold text-lg">{formatCurrency(totalInvestmentValue)}</p>
            </div>
            <div className="text-left sm:text-right"> {/* Current Value */}
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border-b border-border mb-4">
          <div className="flex space-x-1 overflow-x-auto whitespace-nowrap pb-0 no-scrollbar">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                className={cn(
                  "px-3 py-1.5 h-auto text-xs font-medium rounded-t-md rounded-b-none focus-visible:ring-0 focus-visible:ring-offset-0",
                  "border-b-2 hover:bg-transparent",
                  activeFilter === option.value
                    ? "text-primary border-primary font-semibold"
                    : "text-muted-foreground border-transparent hover:text-primary hover:border-primary/30"
                )}
                onClick={() => setActiveFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] min-w-[150px]">Instrument</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Qty.</TableHead>
              <TableHead className="text-right">Avg. Cost</TableHead>
              <TableHead className="text-right">LTP</TableHead>
              <TableHead className="text-right">Current Val.</TableHead>
              <TableHead className="text-right">P&L (%)</TableHead>
              <TableHead className="text-right">Day's Chg (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHoldings.length > 0 ? (
              filteredHoldings.map((holding) => (
                <TableRow key={holding.id}>
                  <TableCell className="font-medium">
                    <div>{holding.name}</div>
                    {holding.symbol && <div className="text-xs text-muted-foreground">{holding.symbol}</div>}
                  </TableCell>
                  <TableCell>{holding.type}</TableCell>
                  <TableCell className="text-right">{holding.quantity.toLocaleString()}</TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No holdings match the selected filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
