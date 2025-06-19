
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
import { Briefcase, Info, PlusCircle, MinusCircle, XCircle, Coins, Landmark } from 'lucide-react'; 
import { useToast } from "@/hooks/use-toast";

type HoldingFilterType = 'All' | 'Stock' | 'Mutual Fund' | 'Bond';

interface PortfolioHoldingsTableProps {
  mainPortfolioCashBalance: number;
  setMainPortfolioCashBalance: React.Dispatch<React.SetStateAction<number>>;
}

export function PortfolioHoldingsTable({ mainPortfolioCashBalance, setMainPortfolioCashBalance }: PortfolioHoldingsTableProps) {
  const holdings = mockPortfolioHoldings.filter(h => h.type !== 'Crypto'); // Exclude crypto from main holdings table
  const [activeFilter, setActiveFilter] = useState<HoldingFilterType>('All');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleRowClick = (holdingId: string) => {
    setExpandedRowId(prevId => (prevId === holdingId ? null : holdingId));
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
    { label: "Bonds", value: "Bond" },
  ];

  const filteredHoldings = holdings.filter(holding => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Stock') return holding.type === 'Stock' || holding.type === 'ETF';
    if (activeFilter === 'Mutual Fund') return holding.type === 'Mutual Fund';
    if (activeFilter === 'Bond') return holding.type === 'Bond';
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
          <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">Cash Balance</p>
            <p className="font-medium text-foreground">
              {formatCurrency(mainPortfolioCashBalance)}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: "Add Cash (Mock)", description: "Functionality to add funds to your main portfolio." })}>
              <Coins className="mr-2 h-4 w-4" /> Add Cash
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: "Withdraw Cash (Mock)", description: "Functionality to withdraw funds from your main portfolio." })}>
              <Landmark className="mr-2 h-4 w-4" /> Withdraw Cash
            </Button>
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
              <React.Fragment key={holding.id}>
                <TableRow 
                  onClick={() => handleRowClick(holding.id)}
                  className="cursor-pointer"
                >
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
                {expandedRowId === holding.id && (
                  <TableRow className="bg-muted/50 hover:bg-muted/60 data-[state=selected]:bg-muted/70">
                    <TableCell colSpan={8} className="p-0">
                      <div className="p-4 space-y-3">
                        <h4 className="font-semibold text-md text-foreground">
                          {holding.name} ({holding.symbol || holding.type}) - Actions
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 justify-center text-green-600 border-green-500 hover:bg-green-500/10 hover:text-green-700" 
                            onClick={(e) => {
                                e.stopPropagation();
                                toast({ title: `Buy More: ${holding.symbol || holding.name}`});
                            }}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" /> Buy More
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 justify-center text-orange-600 border-orange-500 hover:bg-orange-500/10 hover:text-orange-700" 
                            onClick={(e) => {
                                e.stopPropagation();
                                toast({ title: `Sell/Reduce: ${holding.symbol || holding.name}`});
                            }}
                          >
                            <MinusCircle className="mr-2 h-4 w-4" /> Sell/Reduce
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="flex-1 justify-center" 
                            onClick={(e) => {
                                e.stopPropagation();
                                toast({ 
                                    title: `Exit Position: ${holding.symbol || holding.name}`,
                                    description: "This action would close your entire position.",
                                    variant: "destructive"
                                });
                            }}
                          >
                            <XCircle className="mr-2 h-4 w-4" /> Exit Position
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
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

