
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { GttOrder } from '@/types';
import { mockGttOrders, mockRealGttOrders } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Target, Edit3, XCircle } from 'lucide-react';

interface LimitOrderItemProps {
  order: GttOrder;
}

const LimitOrderItem: React.FC<LimitOrderItemProps> = ({ order }) => {
  const { toast } = useToast();
  return (
    <div className="border-b">
        <div className="p-3">
            <div className="flex justify-between items-center">
                <p className="font-semibold text-sm text-foreground">{order.instrumentName} ({order.symbol})</p>
                <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    order.orderType === 'BUY' ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300"
                )}>{order.orderType}</span>
            </div>
            <p className="text-xs text-muted-foreground">{order.exchange} - {order.productType}</p>
        </div>
        <div className="text-xs px-3 pb-2 space-y-1">
            <div className="flex justify-between"><span>Trigger: ₹{order.triggerPrice.toFixed(2)}</span> <span>Qty: {order.quantity}</span></div>
            {order.limitPrice && <div className="flex justify-between"><span>Limit: ₹{order.limitPrice.toFixed(2)}</span></div>}
            <div className="flex justify-between">
            <span>Status: <span className={cn("font-medium", order.status === 'Active' ? 'text-primary' : 'text-muted-foreground')}>{order.status}</span></span>
            <span>Created: {new Date(order.createdDate).toLocaleDateString()}</span>
            </div>
        </div>
        <div className="px-3 pb-2 flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => toast({ title: `Modify GTT: ${order.symbol}`})}>
            <Edit3 className="mr-1 h-3 w-3" /> Modify
            </Button>
            <Button variant="destructive" size="sm" onClick={() => toast({ title: `Cancel GTT: ${order.symbol}`, variant: "destructive"})}>
            <XCircle className="mr-1 h-3 w-3" /> Cancel
            </Button>
        </div>
    </div>
  );
};

export function LimitOrdersDisplay({ isRealMode = false }: { isRealMode?: boolean }) {
  const orders = isRealMode ? mockRealGttOrders : mockGttOrders;

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No Limit orders found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] p-1">
      {orders.map((order) => (
        <LimitOrderItem key={order.id} order={order} />
      ))}
    </ScrollArea>
  );
}
