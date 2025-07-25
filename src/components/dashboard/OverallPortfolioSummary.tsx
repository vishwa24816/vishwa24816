
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Info, Coins, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface OverallPortfolioSummaryProps {
  totalPortfolioValue: number;
  unrealisedPnl: number;
  availableMargin: number;
  investedMargin: number;
  onAddFunds: () => void;
  onWithdrawFunds: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function OverallPortfolioSummary({
  totalPortfolioValue,
  unrealisedPnl,
  availableMargin,
  investedMargin,
  onAddFunds,
  onWithdrawFunds
}: OverallPortfolioSummaryProps) {
  return (
    <Card className="shadow-md">
       <CardHeader>
        <CardTitle className="text-xl font-semibold font-headline text-primary">
          Portfolio Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xl font-semibold text-foreground">
              {formatCurrency(totalPortfolioValue)}
            </p>
            <p className="text-xs text-muted-foreground flex items-center">
              Total Portfolio
              <Info className="h-3 w-3 ml-1.5 text-muted-foreground cursor-pointer" />
            </p>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "text-xl font-semibold",
                unrealisedPnl >= 0 ? 'text-green-500' : 'text-red-500' 
              )}
            >
              {formatCurrency(unrealisedPnl)}
            </p>
            <p className="text-xs text-muted-foreground">Unrealised P&L</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">Available Margin</p>
            <p className="font-medium text-foreground">
              {formatCurrency(availableMargin)}
            </p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">Invested Margin</p>
            <p className="font-medium text-foreground">
              {formatCurrency(investedMargin)}
            </p>
          </div>
        </div>
        
        <div className="pt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="h-11" onClick={onAddFunds}>
                <Coins className="mr-2 h-4 w-4" /> Add Funds
            </Button>
            <Button variant="outline" size="sm" className="h-11" onClick={onWithdrawFunds}>
                <Landmark className="mr-2 h-4 w-4" /> Withdraw
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

    