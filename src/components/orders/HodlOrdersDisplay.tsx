
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { HodlOrder } from '@/types';
import { mockHodlOrders } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, TrendingUp, Calendar, Coins, AlertTriangle } from 'lucide-react';

interface HodlOrderItemProps {
  order: HodlOrder;
}

const HodlOrderItem: React.FC<HodlOrderItemProps> = ({ order }) => {
  const { toast } = useToast();
  const [isConfirmingUnhold, setIsConfirmingUnhold] = useState(false);

  const handleUnholdClick = () => {
    setIsConfirmingUnhold(!isConfirmingUnhold);
  };
  
  const handleConfirmUnhold = () => {
    toast({
        title: 'Unheld (Mock)',
        description: `${order.quantity} ${order.symbol} has been unheld.`,
    });
    setIsConfirmingUnhold(false);
    // Here you would typically call an action to update the order status
  }

  const isProfit = order.profit >= 0;

  return (
    <div className="border-b">
        <div className="p-3">
            <div className="flex justify-between items-center">
                <p className="font-semibold text-sm text-foreground">{order.instrumentName} ({order.symbol})</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{order.assetType}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Lock className="h-3 w-3 mr-1.5" />
                <span>Locked until {new Date(order.lockInEndDate).toLocaleDateString()}</span>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs px-3 pb-2">
            <div className="flex items-center gap-1"><Coins className="h-3 w-3" />Invested: ₹{order.investedAmount.toLocaleString()}</div>
            <div className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />Current: ₹{order.currentValue.toLocaleString()}</div>
            <div className="flex items-center col-span-2 gap-1">
                <span>Profit:</span>
                <span className={cn(isProfit ? 'text-green-600' : 'text-red-600', "font-medium")}>
                    {isProfit ? '+' : ''}₹{order.profit.toLocaleString()}
                </span>
            </div>
        </div>
        <div className="px-3 pb-2 flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleUnholdClick}>
                <Unlock className="mr-1 h-3 w-3" /> Unhold
            </Button>
        </div>
        {isConfirmingUnhold && (
            <div className="bg-destructive/10 border-t border-destructive/20 p-3 animate-accordion-down">
                <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-destructive mr-3 mt-1"/>
                    <div>
                        <h4 className="font-semibold text-destructive">Confirm Unhold</h4>
                        <p className="text-xs text-destructive/90 mt-1">
                            Unholding before {new Date(order.lockInEndDate).toLocaleDateString()} will incur a 10% penalty on the profit earned.
                        </p>
                         <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="destructive" onClick={handleConfirmUnhold}>Confirm Unhold</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsConfirmingUnhold(false)}>Cancel</Button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export function HodlOrdersDisplay() {
  const orders = mockHodlOrders;

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          No HODL orders found.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] p-1">
      {orders.map((order) => (
        <HodlOrderItem key={order.id} order={order} />
      ))}
    </ScrollArea>
  );
}
