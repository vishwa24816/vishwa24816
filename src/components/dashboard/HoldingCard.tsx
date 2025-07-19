
"use client";

import React, { useState } from 'react';
import type { PortfolioHolding } from '@/types';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Landmark, Settings2, XCircle, ChevronDown } from 'lucide-react';

interface HoldingCardProps {
    holding: PortfolioHolding;
    onPledgeClick: (holding: PortfolioHolding) => void;
}

export const HoldingCard: React.FC<HoldingCardProps> = ({ holding, onPledgeClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const formatCurrency = (value: number, currency: 'INR' | 'USD' = 'INR') => {
        return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { 
            style: 'currency', 
            currency: currency, 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        }).format(value);
    };

    const isProfit = (holding.profitAndLoss ?? holding.change) >= 0;
    const isDayProfit = (holding.dayChangeAbsolute ?? holding.change) >= 0;
    const currency: 'INR' | 'USD' = holding.type === 'Crypto' || holding.exchange === 'NASDAQ' || holding.exchange === 'NYSE' ? 'USD' : 'INR';

    const handleAdjustPosition = () => {
      let path = `/order/stock/${holding.symbol}`;
      if (holding.exchange === 'NASDAQ' || holding.exchange === 'NYSE') {
        path = `/order/us-stock/${holding.symbol}`;
      } else if (holding.type === 'Crypto') {
        path = `/order/crypto/${holding.symbol}`;
      } else if (holding.type === 'Mutual Fund') {
        path = `/order/mutual-fund/${holding.symbol}`;
      } else if (holding.type === 'Bond') {
        path = `/order/bond/${holding.symbol}`;
      }
      router.push(path);
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
                        {formatCurrency(holding.profitAndLoss ?? holding.change, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">({(holding.profitAndLossPercent ?? holding.changePercent)?.toFixed(2)}%)</p>
                </div>
                <ChevronDown className={cn("h-4 w-4 ml-3 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
            </div>

            {isExpanded && (
                <div className="bg-muted/30 px-3 py-3 space-y-3 animate-accordion-down">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-medium text-foreground">{holding.quantity.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: (currency === 'USD' ? 8 : 0) })}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-muted-foreground">Avg. Cost</p>
                            <p className="font-medium text-foreground">{formatCurrency(holding.avgCostPrice, currency)}</p>
                        </div>
                         <div>
                            <p className="text-muted-foreground">LTP</p>
                            <p className="font-medium text-foreground">{formatCurrency(holding.ltp, currency)}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-muted-foreground">Current Value</p>
                            <p className="font-medium text-foreground">{formatCurrency(holding.currentValue, currency)}</p>
                        </div>
                         <div>
                            <p className="text-muted-foreground">Day's P&L</p>
                            <p className={cn("font-medium", isDayProfit ? 'text-green-600' : 'text-red-600')}>
                                {formatCurrency(holding.dayChangeAbsolute, currency)} ({(holding.dayChangePercent ?? holding.changePercent)?.toFixed(2)}%)
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 justify-center" onClick={handleAdjustPosition}>
                            <Settings2 className="mr-2 h-4 w-4" /> Adjust
                        </Button>
                         <Button size="sm" variant="outline" className="flex-1 justify-center" onClick={() => onPledgeClick(holding)}>
                            <Landmark className="mr-2 h-4 w-4" /> Pledge
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1 justify-center" onClick={handleExitPosition}>
                            <XCircle className="mr-2 h-4 w-4" /> Exit
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
