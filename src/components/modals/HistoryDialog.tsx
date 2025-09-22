
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Transaction } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface HistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  transactions: Transaction[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};


export function HistoryDialog({ isOpen, onOpenChange, transactions }: HistoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
          <DialogDescription>Your recent personal wallet transactions.</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-80 -mx-6 px-6">
            <div className="space-y-4 py-4">
                {transactions.map(tx => {
                    const isCredit = tx.type === 'CREDIT';
                    return (
                        <div key={tx.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-full", isCredit ? "bg-green-100 dark:bg-green-900/50" : "bg-red-100 dark:bg-red-900/50")}>
                                    {isCredit ? <ArrowDownLeft className="h-4 w-4 text-green-600" /> : <ArrowUpRight className="h-4 w-4 text-red-600" />}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{tx.description}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className={cn("text-sm font-semibold", isCredit ? 'text-green-600' : 'text-red-600')}>
                                {isCredit ? '+' : '-'} {formatCurrency(Math.abs(tx.amount))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

