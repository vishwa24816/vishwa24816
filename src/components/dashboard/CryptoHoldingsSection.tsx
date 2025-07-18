
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { PortfolioHolding } from '@/types';
import { cn } from '@/lib/utils';
import { Bitcoin, XCircle, Coins, Landmark, Settings2, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { FundTransferDialog } from '@/components/shared/FundTransferDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CryptoHoldingsSectionProps {
  holdings: PortfolioHolding[];
  title: string;
  cashBalance: number;
  setCashBalance: React.Dispatch<React.SetStateAction<number>>;
  mainPortfolioCashBalance: number;
  setMainPortfolioCashBalance: React.Dispatch<React.SetStateAction<number>>;
  isRealMode?: boolean;
}

const HoldingRow = ({ holding, onAdjust, onExit }: { holding: PortfolioHolding, onAdjust: () => void, onExit: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    };

    const isProfit = holding.profitAndLoss >= 0;
    const isDayProfit = holding.dayChangeAbsolute >= 0;

    return (
        <div className="border-b transition-all duration-300">
            <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{holding.name}</p>
                    <p className="text-xs text-muted-foreground">{holding.symbol}</p>
                </div>
                <div className="text-right ml-2 shrink-0">
                    <p className={cn("text-sm font-medium", isProfit ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(holding.profitAndLoss)}
                    </p>
                    <p className="text-xs text-muted-foreground">({holding.profitAndLossPercent.toFixed(2)}%)</p>
                </div>
                <ChevronDown className={cn("h-4 w-4 ml-3 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
            </div>

            {isExpanded && (
                <div className="bg-muted/30 px-3 py-3 space-y-3 animate-accordion-down">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-medium text-foreground">{holding.quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-muted-foreground">Avg. Cost</p>
                            <p className="font-medium text-foreground">{formatCurrency(holding.avgCostPrice)}</p>
                        </div>
                         <div>
                            <p className="text-muted-foreground">LTP</p>
                            <p className="font-medium text-foreground">{formatCurrency(holding.ltp)}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-muted-foreground">Current Value</p>
                            <p className="font-medium text-foreground">{formatCurrency(holding.currentValue)}</p>
                        </div>
                         <div>
                            <p className="text-muted-foreground">Day's P&L</p>
                            <p className={cn("font-medium", isDayProfit ? 'text-green-600' : 'text-red-600')}>
                                {formatCurrency(holding.dayChangeAbsolute)} ({holding.dayChangePercent.toFixed(2)}%)
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 justify-center" onClick={onAdjust}>
                            <Settings2 className="mr-2 h-4 w-4" /> Adjust Position
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1 justify-center" onClick={onExit}>
                            <XCircle className="mr-2 h-4 w-4" /> Exit Position
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export function CryptoHoldingsSection({
  holdings,
  title,
  cashBalance,
  setCashBalance,
  mainPortfolioCashBalance,
  setMainPortfolioCashBalance,
  isRealMode = false
}: CryptoHoldingsSectionProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isFundTransferDialogOpen, setIsFundTransferDialogOpen] = useState(false);
  const [transferDirection, setTransferDirection] = useState<'toCrypto' | 'fromCrypto'>('toCrypto');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };
  
  const handleAdjustPosition = (holding: PortfolioHolding) => {
      e.stopPropagation();
      router.push(`/order/crypto/${encodeURIComponent(holding.symbol || holding.name)}`);
  };

  const handleExitPosition = (holding: PortfolioHolding) => {
    e.stopPropagation();
    toast({
      title: `Exiting Position (Mock): ${holding.symbol}`,
      description: `A market order would be placed to close this position.`,
      variant: "destructive"
    });
  };

  const totalCurrentValue = holdings.reduce((acc, holding) => acc + holding.currentValue, 0);
  const totalInvestmentValue = holdings.reduce((acc, holding) => acc + (holding.quantity * holding.avgCostPrice), 0);
  const overallPandL = totalCurrentValue - totalInvestmentValue;
  const overallPandLPercent = totalInvestmentValue !== 0 ? (overallPandL / totalInvestmentValue) * 100 : 0;

  const totalDayChangeAbsolute = holdings.reduce((acc, holding) => acc + holding.dayChangeAbsolute, 0);
  const totalPreviousDayValue = totalCurrentValue - totalDayChangeAbsolute;
  const totalDayChangePercent = totalPreviousDayValue !== 0 ? (totalDayChangeAbsolute / totalPreviousDayValue) * 100 : 0;

  const handleOpenFundTransferDialog = (direction: 'toCrypto' | 'fromCrypto') => {
    setTransferDirection(direction);
    setIsFundTransferDialogOpen(true);
  };

  const handleTransferConfirm = (amount: number, direction: 'toCrypto' | 'fromCrypto') => {
    if (direction === 'toCrypto') {
      setMainPortfolioCashBalance(prev => prev - amount);
      setCashBalance(prev => prev + amount);
      toast({ title: "Transfer Successful", description: `${formatCurrency(amount)} transferred to ${title}.` });
    } else { // fromCrypto
      setMainPortfolioCashBalance(prev => prev + amount);
      setCashBalance(prev => prev - amount);
      toast({ title: "Transfer Successful", description: `${formatCurrency(amount)} transferred to Main Portfolio.` });
    }
  };

  const walletCardTitle = title.includes('Web3') ? 'Web3 Wallet' : 'Crypto Wallet';
  const holdingsCardTitle = title.includes('Web3') ? 'Web3 Holdings' : 'Crypto Holdings';

  return (
    <>
      <div className="space-y-4">
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
              <Bitcoin className="h-6 w-6 mr-2" /> {walletCardTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className={cn("text-xl font-semibold", overallPandL >= 0 ? 'text-green-500' : 'text-red-500')}>
                    {formatCurrency(overallPandL)}
                  </p>
                  <p className="text-xs text-muted-foreground">Overall P&L ({overallPandLPercent.toFixed(2)}%)</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-xl font-semibold", totalDayChangeAbsolute >= 0 ? 'text-green-500' : 'text-red-500')}>
                    {formatCurrency(totalDayChangeAbsolute)}
                  </p>
                  <p className="text-xs text-muted-foreground">Day's P&L ({totalDayChangePercent.toFixed(2)}%)</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Total Investment</p>
                  <p className="font-medium text-foreground">{formatCurrency(totalInvestmentValue)}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Current Value</p>
                  <p className="font-medium text-foreground">{formatCurrency(totalCurrentValue)}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Cash Balance</p>
                  <p className="font-medium text-foreground">{formatCurrency(cashBalance)}</p>
                </div>
                {!isRealMode && (
                  <div className="pt-2 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-11" onClick={() => handleOpenFundTransferDialog('toCrypto')}>
                      <Coins className="mr-2 h-4 w-4" /> Add Funds
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-11" onClick={() => handleOpenFundTransferDialog('fromCrypto')}>
                      <Landmark className="mr-2 h-4 w-4" /> Withdraw Funds
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
                <Coins className="h-6 w-6 mr-2" /> {holdingsCardTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {holdings.length > 0 ? (
                 holdings.map((holding) => (
                    <HoldingRow 
                        key={holding.id} 
                        holding={holding} 
                        onAdjust={() => handleAdjustPosition(holding)}
                        onExit={() => handleExitPosition(holding)}
                    />
                ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                You have no crypto assets in this wallet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FundTransferDialog
        isOpen={isFundTransferDialogOpen}
        onOpenChange={setIsFundTransferDialogOpen}
        transferDirection={transferDirection}
        mainPortfolioCashBalance={mainPortfolioCashBalance}
        cryptoCashBalance={cashBalance}
        onTransferConfirm={handleTransferConfirm}
        currencyMode={'USD'}
      />
    </>
  );
}
