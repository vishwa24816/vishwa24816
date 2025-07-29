
"use client";

import React, { useState, useMemo } from 'react';
import type { PortfolioHolding, Stock } from '@/types';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Landmark, Settings2, XCircle, ChevronDown, PlusCircle, MinusCircle } from 'lucide-react';

interface HoldingCardProps {
    holding: PortfolioHolding;
    onPledgeClick: (holding: PortfolioHolding, mode: 'pledge' | 'payback') => void;
    isPledged?: boolean;
    onAssetClick: (asset: Stock) => void;
}

const PledgedDetails: React.FC<{ holding: PortfolioHolding, onPledgeClick: (holding: PortfolioHolding, mode: 'pledge' | 'payback') => void }> = ({ holding, onPledgeClick }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    };

    const { pledgedValue, haircut, collateralMargin, interestLevied, paybackAmount } = useMemo(() => {
        const HAIRCUT_PERCENTAGE = 10;
        const INTEREST_RATE = 8.5;

        const value = holding.quantity * holding.ltp;
        const haircutAmount = value * (HAIRCUT_PERCENTAGE / 100);
        const margin = value - haircutAmount;
        // Mock interest calculation
        const interest = margin * (INTEREST_RATE / 100 / 365) * 30; // Approx 30 days interest
        const payback = value + interest;

        return {
            pledgedValue: value,
            haircut: haircutAmount,
            collateralMargin: margin,
            interestLevied: interest,
            paybackAmount: payback,
        };
    }, [holding]);

    return (
        <div className="bg-muted/30 px-3 py-3 space-y-3 animate-accordion-down">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div><p className="text-muted-foreground">Pledged Value</p><p className="font-medium text-foreground">{formatCurrency(pledgedValue)}</p></div>
                <div className="text-right"><p className="text-muted-foreground">Haircut (10%)</p><p className="font-medium text-red-500">- {formatCurrency(haircut)}</p></div>
                <div><p className="text-muted-foreground">Interest Levied</p><p className="font-medium text-foreground">{formatCurrency(interestLevied)}</p></div>
                <div className="text-right"><p className="text-muted-foreground">Collateral Margin</p><p className="font-medium text-green-600">{formatCurrency(collateralMargin)}</p></div>
                <div className="col-span-2 text-center border-t pt-2 mt-1"><p className="text-muted-foreground">Total Payback Amount</p><p className="font-semibold text-lg text-primary">{formatCurrency(paybackAmount)}</p></div>
            </div>
            <div className="pt-2 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 justify-center" onClick={() => onPledgeClick(holding, 'pledge')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Pledge More
                </Button>
                <Button size="sm" variant="destructive" className="flex-1 justify-center" onClick={() => onPledgeClick(holding, 'payback')}>
                    <MinusCircle className="mr-2 h-4 w-4" /> Payback
                </Button>
            </div>
        </div>
    );
};

export const HoldingCard: React.FC<HoldingCardProps> = ({ holding, onPledgeClick, isPledged = false, onAssetClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const currency: 'INR' | 'USD' = (holding.exchange === 'NASDAQ' || holding.exchange === 'NYSE') ? 'USD' : 'INR';

    const formatCurrency = (value: number, currencyToUse: 'INR' | 'USD' = currency) => {
        return new Intl.NumberFormat(currencyToUse === 'INR' ? 'en-IN' : 'en-US', { 
            style: 'currency', 
            currency: currencyToUse, 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        }).format(value);
    };

    const isProfit = (holding.profitAndLoss ?? 0) >= 0;
    const isDayProfit = (holding.dayChangeAbsolute ?? 0) >= 0;

    const handleAdjustPosition = () => {
        onAssetClick(holding as Stock);
    };

    const handleExitPosition = () => {
      toast({
        title: `Exiting Position (Mock): ${holding.symbol}`,
        description: `A market order would be placed to close this position.`,
        variant: "destructive"
      });
    };

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
                        {formatCurrency(holding.profitAndLoss ?? 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">({(holding.profitAndLossPercent ?? 0).toFixed(2)}%)</p>
                </div>
                <ChevronDown className={cn("h-4 w-4 ml-3 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
            </div>

            {isExpanded && (
                isPledged ? (
                    <PledgedDetails holding={holding} onPledgeClick={onPledgeClick} />
                ) : (
                    <div className="bg-muted/30 px-3 py-3 space-y-3 animate-accordion-down">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <div>
                                <p className="text-muted-foreground">Quantity</p>
                                <p className="font-medium text-foreground">{holding.quantity.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: (currency === 'USD' ? 8 : 0) })}</p>
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
                                    {formatCurrency(holding.dayChangeAbsolute ?? 0)} ({(holding.dayChangePercent ?? 0).toFixed(2)}%)
                                </p>
                            </div>
                        </div>
                        <div className="pt-2 flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1 justify-center" onClick={handleAdjustPosition}>
                                <Settings2 className="mr-2 h-4 w-4" /> Adjust
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 justify-center" onClick={() => onPledgeClick(holding, 'pledge')}>
                                <Landmark className="mr-2 h-4 w-4" /> Pledge
                            </Button>
                            <Button size="sm" variant="destructive" className="flex-1 justify-center" onClick={handleExitPosition}>
                                <XCircle className="mr-2 h-4 w-4" /> Exit
                            </Button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};
