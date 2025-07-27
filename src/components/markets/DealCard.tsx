
"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, MoreHorizontal, Bell, Plus, ShoppingBasket } from 'lucide-react';
import type { BulkBlockDeal } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DealCardProps {
  deal: BulkBlockDeal;
}

const getActionClass = (action: BulkBlockDeal['action']) => {
    switch (action) {
        case 'Purchase': return 'text-green-600 dark:text-green-400';
        case 'Sell': return 'text-red-600 dark:text-red-400';
        default: return 'text-muted-foreground';
    }
};

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
    const { toast } = useToast();

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center text-primary font-semibold">
                            <span>{deal.companyName}</span>
                            <ChevronRight className="h-4 w-4" />
                        </div>
                        <p className="text-xs text-muted-foreground">{deal.date} • {deal.clientName}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-left">
                    <div>
                        <p className="text-xs text-muted-foreground">Quantity</p>
                        <p className="font-semibold">{deal.quantity.toLocaleString('en-IN')} ({deal.exchange})</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-semibold">₹{deal.price.toFixed(2)}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-xs text-muted-foreground">% Traded</p>
                        <p className="font-semibold">{deal.percentTraded.toFixed(2)}%</p>
                    </div>
                </div>
                
                <div className="flex justify-between items-center mt-2 text-sm">
                    <p className={cn("font-semibold", getActionClass(deal.action))}>{deal.action}</p>
                    <p className="text-xs font-semibold text-muted-foreground">{deal.dealType}</p>
                </div>
                 <div className="mt-3 border-t pt-2 flex justify-end items-center">
                    <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => toast({title: "Alert Created (Mock)"})}><Bell className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => toast({title: "Added to Basket (Mock)"})}><ShoppingBasket className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => toast({title: "Added to Watchlist (Mock)"})}><Plus className="h-4 w-4" /></Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
