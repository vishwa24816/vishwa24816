
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

interface AddFundsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentBalance: number;
  onConfirm: (amount: number, type: 'add' | 'withdraw') => void;
}

export function AddFundsDialog({
  isOpen,
  onOpenChange,
  currentBalance,
  onConfirm,
}: AddFundsDialogProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'withdraw'>('add');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError('');
    }
  }, [isOpen]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleConfirmAction = () => {
    setError('');
    const typedAmount = parseFloat(amount);

    if (isNaN(typedAmount) || typedAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    
    if (activeTab === 'withdraw' && typedAmount > currentBalance) {
      setError(`Insufficient funds. Available balance: ${formatCurrency(currentBalance)}`);
      return;
    }

    onConfirm(typedAmount, activeTab);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {activeTab === 'add' ? <ArrowDownToLine className="mr-2 h-5 w-5 text-primary" /> : <ArrowUpFromLine className="mr-2 h-5 w-5 text-primary" />}
            {activeTab === 'add' ? 'Add Funds' : 'Withdraw Funds'}
          </DialogTitle>
           <DialogDescription>
            Your current available balance is {formatCurrency(currentBalance)}.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full pt-2">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="add">Add Funds</TabsTrigger>
                <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            </TabsList>
            <TabsContent value="add" className="mt-4">
                 <div className="space-y-2">
                    <Label htmlFor="add-amount">Amount to Add (₹)</Label>
                    <Input id="add-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 10000" />
                 </div>
            </TabsContent>
            <TabsContent value="withdraw" className="mt-4">
                 <div className="space-y-2">
                    <Label htmlFor="withdraw-amount">Amount to Withdraw (₹)</Label>
                    <Input id="withdraw-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 5000" />
                 </div>
            </TabsContent>
        </Tabs>

        {error && <p className="text-xs text-destructive pt-1">{error}</p>}
        
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleConfirmAction}>
            Confirm {activeTab === 'add' ? 'Addition' : 'Withdrawal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
