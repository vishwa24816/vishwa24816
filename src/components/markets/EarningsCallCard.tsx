
"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EarningsCall } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EarningsCallCardProps {
  call: EarningsCall;
}

export const EarningsCallCard: React.FC<EarningsCallCardProps> = ({ call }) => {
    const { toast } = useToast();
    const isPositive = call.stockData.change >= 0;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs text-muted-foreground">{call.date}, {call.time} • BSE India</p>
                <h3 className="font-semibold text-foreground text-base mt-1">{call.title}</h3>
            </div>
            <Badge variant="outline" className="text-xs shrink-0">Earnings Call</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{call.description}</p>
        
        <div className="mt-3 pt-3 border-t flex justify-between items-center">
            <div>
                <p className="font-semibold text-primary">{call.companyName}</p>
                <div className="flex items-center space-x-2 text-sm">
                    <span className="font-semibold">₹{call.stockData.price.toFixed(2)}</span>
                    <span className={cn(isPositive ? "text-green-600" : "text-red-500")}>
                        {isPositive ? '▲' : '▼'} {call.stockData.changePercent.toFixed(2)}%
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => toast({title: "Downloading Transcript (Mock)"})}>
                    <FileText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => toast({title: "Added to Watchlist (Mock)"})}>
                    <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => toast({title: "Alert Created (Mock)"})}>
                    <Bell className="h-4 w-4" />
                </Button>
            </div>
        </div>

      </CardContent>
    </Card>
  );
};
