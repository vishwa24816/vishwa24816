
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ArrowRightLeft } from 'lucide-react';

interface FundTransferDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  transferDirection: 'toCrypto' | 'fromCrypto';
  mainPortfolioCashBalance: number;
  cryptoCashBalance: number;
  onTransferConfirm: (amount: number, direction: 'toCrypto' | 'fromCrypto') => void;
}

export function FundTransferDialog({
  isOpen,
  onOpenChange,
  transferDirection,
  mainPortfolioCashBalance,
  cryptoCashBalance,
  onTransferConfirm,
}: FundTransferDialogProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset form when dialog opens or direction changes
    if (isOpen) {
      setAmount('');
      setError('');
    }
  }, [isOpen, transferDirection]);

  const sourceAccountName = transferDirection === 'toCrypto' ? "Main Portfolio" : "Crypto Wallet";
  const destinationAccountName = transferDirection === 'toCrypto' ? "Crypto Wallet" : "Main Portfolio";
  const sourceBalance = transferDirection === 'toCrypto' ? mainPortfolioCashBalance : cryptoCashBalance;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleTransfer = () => {
    setError('');
    const transferAmount = parseFloat(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    if (transferAmount > sourceBalance) {
      setError(`Insufficient funds in ${sourceAccountName}. Available: ${formatCurrency(sourceBalance)}`);
      return;
    }

    onTransferConfirm(transferAmount, transferDirection);
    onOpenChange(false); // Close dialog on successful mock transfer
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ArrowRightLeft className="mr-2 h-5 w-5 text-primary" />
            Transfer Funds
          </DialogTitle>
          <DialogDescription>
            Transfer funds between your {sourceAccountName.toLowerCase()} and {destinationAccountName.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              From: <span className="font-medium text-foreground">{sourceAccountName}</span>
            </p>
            <p className="text-sm">
              Available Balance: <span className="font-semibold text-primary">{formatCurrency(sourceBalance)}</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              To: <span className="font-medium text-foreground">{destinationAccountName}</span>
            </p>
            <p className="text-sm">
              Current Balance: <span className="font-semibold text-primary">{formatCurrency(transferDirection === 'toCrypto' ? cryptoCashBalance : mainPortfolioCashBalance)}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transfer-amount" className="text-right">
              Amount to Transfer (₹)
            </Label>
            <Input
              id="transfer-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 1000"
              className={cn(error && "border-destructive focus-visible:ring-destructive")}
            />
            {error && <p className="text-xs text-destructive pt-1">{error}</p>}
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleTransfer}>
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
