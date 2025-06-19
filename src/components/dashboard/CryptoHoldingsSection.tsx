
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
import { Bitcoin, PlusCircle, MinusCircle, XCircle, Coins, Landmark } from 'lucide-react'; 
import { useToast } from "@/hooks/use-toast";

export function CryptoHoldingsSection() {
  const cryptoHoldings = mockPortfolioHoldings.filter(holding => holding.type === 'Crypto');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleRowClick = (holdingId: string) => {
    setExpandedRowId(prevId => (prevId === holdingId ? null : holdingId));
  };

  const totalCurrentValue = cryptoHoldings.reduce((acc, holding) => acc + holding.currentValue, 0);
  const totalInvestmentValue = cryptoHoldings.reduce((acc, holding) => acc + (holding.quantity * holding.avgCostPrice), 0);
  const overallPandL = totalCurrentValue - totalInvestmentValue;
  const overallPandLPercent = totalInvestmentValue !== 0 ? (overallPandL / totalInvestmentValue) * 100 : 0;
  
  const totalDayChangeAbsolute = cryptoHoldings.reduce((acc, holding) => acc + holding.dayChangeAbsolute, 0);
  const totalPreviousDayValue = totalCurrentValue - totalDayChangeAbsolute;
  const totalDayChangePercent = totalPreviousDayValue !== 0 ? (totalDayChangeAbsolute / totalPreviousDayValue) * 100 : 0;
  const mockCryptoCashBalance = 15000.00; // Mock crypto cash balance

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
          <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">Cash Balance (Crypto)</p>
            <p className="font-medium text-foreground">
              {formatCurrency(mockCryptoCashBalance)}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: "Add Crypto Funds (Mock)", description: "Functionality to add crypto funds." })}>
              <Coins className="mr-2 h-4 w-4" /> Add Funds
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: "Withdraw Crypto Funds (Mock)", description: "Functionality to withdraw crypto funds." })}>
              <Landmark className="mr-2 h-4 w-4" /> Withdraw Funds
            </Button>
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
            <React.Fragment key={holding.id}>
              <TableRow 
                onClick={() => handleRowClick(holding.id)}
                className="cursor-pointer"
              >
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
              {expandedRowId === holding.id && (
                <TableRow className="bg-muted/50 hover:bg-muted/60 data-[state=selected]:bg-muted/70">
                  <TableCell colSpan={7} className="p-0">
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
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

