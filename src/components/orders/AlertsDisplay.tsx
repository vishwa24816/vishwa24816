
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PriceAlert } from '@/types';
import { mockPriceAlerts } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { BellRing, Edit3, XCircle } from 'lucide-react';

interface AlertItemProps {
  alert: PriceAlert;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  const { toast } = useToast();
  const conditionText = `${alert.condition} ₹${alert.targetPrice.toFixed(2)}`;
  return (
    <div className="border-b">
      <div className="p-3">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-foreground">{alert.instrumentName} ({alert.symbol})</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{alert.assetType}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Alert: {conditionText} {alert.currentPrice && `(Current: ₹${alert.currentPrice.toFixed(2)})`}
        </p>
      </div>
      <div className="text-xs px-3 pb-2 space-y-1">
         <div className="flex justify-between">
            <span>Status: <span className={cn("font-medium",
                alert.status === 'Active' ? 'text-primary' :
                alert.status === 'Triggered' ? 'text-green-600' : 'text-muted-foreground'
            )}>{alert.status}</span></span>
            <span>Created: {new Date(alert.createdDate).toLocaleDateString()}</span>
        </div>
        {alert.notes && <p className="text-muted-foreground italic">Notes: {alert.notes}</p>}
      </div>
       <div className="px-3 pb-2 flex justify-end space-x-2">
        {alert.status === 'Active' && (
          <Button variant="outline" size="sm" onClick={() => toast({ title: `Modify Alert: ${alert.symbol}`})}>
            <Edit3 className="mr-1 h-3 w-3" /> Modify
          </Button>
        )}
        {alert.status !== 'Triggered' && ( // Cannot cancel a triggered alert, maybe delete
          <Button variant="destructive" size="sm" onClick={() => toast({ title: `Cancel Alert: ${alert.symbol}`, variant: "destructive"})}>
            <XCircle className="mr-1 h-3 w-3" /> {alert.status === 'Triggered' ? 'Delete' : 'Cancel'}
          </Button>
        )}
      </div>
    </div>
  );
};

export function AlertsDisplay() {
  const alerts = mockPriceAlerts;

  if (alerts.length === 0) {
    return (
      <div className="text-center py-10">
        <BellRing className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          No price alerts set.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] p-1">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </ScrollArea>
  );
}
