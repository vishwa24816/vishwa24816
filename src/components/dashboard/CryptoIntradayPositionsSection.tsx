
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { IntradayPosition } from '@/types';
import { cn } from '@/lib/utils';
import { TrendingUp, XCircle, Settings2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CryptoIntradayPositionsSectionProps {
  positions: IntradayPosition[];
}

export function CryptoIntradayPositionsSection({ positions }: CryptoIntradayPositionsSectionProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleRowClick = (positionId: string) => {
    setExpandedRowId(prevId => (prevId === positionId ? null : prevId));
  };
  
  const handleAdjustPosition = (e: React.MouseEvent, pos: IntradayPosition) => {
      e.stopPropagation();
      router.push(`/order/crypto/${encodeURIComponent(pos.symbol)}`);
  };

  const handleExitPosition = (e: React.MouseEvent, pos: IntradayPosition) => {
    e.stopPropagation();
    toast({
      title: `Exiting Position (Mock): ${pos.symbol}`,
      description: `A market order would be placed to close this position.`,
      variant: "destructive"
    });
  };

  const totalPandL = positions.reduce((acc, pos) => acc + pos.pAndL, 0);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center mb-2 sm:mb-0">
            <TrendingUp className="h-6 w-6 mr-2" /> Crypto Intraday Positions
          </CardTitle>
          <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <p className={cn("text-lg font-semibold", totalPandL >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(totalPandL)}
              </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {positions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 px-6">You have no open crypto intraday positions.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Instrument / LTP</TableHead>
                <TableHead className="w-[30%]">Qty. / Type</TableHead>
                <TableHead className="text-right w-[30%]">P&L (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((pos) => (
                <React.Fragment key={pos.id}>
                  <TableRow
                    onClick={() => handleRowClick(pos.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">
                        <div>{pos.name} ({pos.symbol})</div>
                        <div className="text-xs text-muted-foreground">LTP: {formatCurrency(pos.ltp)}</div>
                    </TableCell>
                     <TableCell>
                      <div>{pos.quantity.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})}</div>
                      <div
                        className={cn(
                          "text-xs",
                          pos.transactionType === 'BUY' ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {pos.transactionType}
                      </div>
                    </TableCell>
                    <TableCell className={cn("text-right whitespace-nowrap", pos.pAndL >= 0 ? 'text-green-600' : 'text-red-600')}>
                        <div>{formatCurrency(pos.pAndL)}</div>
                        <div className="text-xs">({pos.pAndLPercent.toFixed(2)}%)</div>
                    </TableCell>
                  </TableRow>
                  {expandedRowId === pos.id && (
                    <TableRow className="bg-muted/50 hover:bg-muted/60">
                      <TableCell colSpan={3} className="p-0">
                        <div className="p-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 justify-center" 
                              onClick={(e) => handleAdjustPosition(e, pos)}
                            >
                              <Settings2 className="mr-2 h-4 w-4" /> Adjust Position
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="flex-1 justify-center"
                              onClick={(e) => handleExitPosition(e, pos)}
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Exit Position
                            </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
