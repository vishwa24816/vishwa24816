
"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, TrendingUp, TrendingDown, Layers3, Bell, Plus } from 'lucide-react';
import type { InsiderTrade } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface InsiderTradeCardProps {
  trade: InsiderTrade;
}

const getTransactionTypeClass = (type: InsiderTrade['transactionType']) => {
    switch (type) {
        case 'Acquisition': return 'text-green-600 dark:text-green-400';
        case 'Disposal': return 'text-red-600 dark:text-red-400';
        case 'Pledge': return 'text-yellow-600 dark:text-yellow-400';
        default: return 'text-muted-foreground';
    }
};

export const InsiderTradeCard: React.FC<InsiderTradeCardProps> = ({ trade }) => {
    const { toast } = useToast();

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center text-primary font-semibold">
                            <span>{trade.companyName}</span>
                            <ChevronRight className="h-4 w-4" />
                        </div>
                        <p className="text-xs text-muted-foreground">{trade.date} • {trade.insiderName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Badge variant="outline" className="text-violet-600 border-violet-400">{trade.insiderRelation}</Badge>
                         {/* Placeholder for 52w indicator */}
                        <div className="w-10 h-2 bg-muted rounded-full relative">
                            <div className="absolute h-2 w-1 bg-green-500 rounded-full" style={{left: '75%'}}></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div>
                        <p className="text-xs text-muted-foreground">Quantity</p>
                        <p className="font-semibold">{trade.quantity.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Avg. Price</p>
                        <p className="font-semibold">₹{trade.avgPrice.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">% Traded</p>
                        <p className="font-semibold">{trade.percentTraded.toFixed(2)}%</p>
                    </div>
                </div>

                <div className="text-center my-1">
                    <p className="text-xs text-muted-foreground">Value</p>
                    <p className="font-semibold">₹{(trade.quantity * trade.avgPrice).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>

                <div className="flex justify-between items-center mt-2 text-sm">
                    <p className={cn("font-semibold", getTransactionTypeClass(trade.transactionType))}>{trade.transactionType}</p>
                    <p className="text-xs text-muted-foreground">{trade.transactionMode}</p>
                </div>
                 <div className="mt-3 border-t pt-2 flex justify-end items-center">
                    <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => toast({title: "Added to Watchlist (Mock)"})}><Plus className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => toast({title: "Alert Created (Mock)"})}><Bell className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => toast({title: "Added to Basket (Mock)"})}><Layers3 className="h-4 w-4" /></Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
