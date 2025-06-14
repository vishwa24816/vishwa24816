
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
import { Separator } from "@/components/ui/separator"; 
import { mockPortfolioHoldings } from '@/lib/mockData';
import type { PortfolioHolding } from '@/types';
import { cn } from '@/lib/utils';
import { Briefcase, Info } from 'lucide-react'; 

type HoldingFilterType = 'All' | 'Stock' | 'Mutual Fund' | 'Bond'; // Added 'Bond'

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
    { label: "Bonds", value: "Bond" }, // Added Bonds filter option
  ];

  const filteredHoldings = holdings.filter(holding => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Stock') return holding.type === 'Stock' || holding.type === 'ETF';
    if (activeFilter === 'Mutual Fund') return holding.type === 'Mutual Fund';
    if (activeFilter === 'Bond') return holding.type === 'Bond'; // Added Bond filter logic
    return false;
  });

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold font-headline text-primary flex items-center">
          <Briefcase className="h-6 w-6 mr-2" /> Portfolio Holdings
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
              Overall P&L ({overallPandLPercent.toFixed(2)}%)
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
              Day's P&L ({totalDayChangePercent.toFixed(2)}%)
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">Total Investment</p>
            <p className="font-medium text-foreground">
              {formatCurrency(totalInvestmentValue)}
            </p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">Current Value</p>
            <p className="font-medium text-foreground">
              {formatCurrency(totalCurrentValue)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="border-b border-border">
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
    </section>
  );
}
