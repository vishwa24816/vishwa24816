
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { PortfolioHolding } from '@/types';
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
import { Landmark, PlusCircle, MinusCircle } from 'lucide-react';
import { Slider } from '../ui/slider';

interface PledgeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  holding: PortfolioHolding | null;
  onConfirmPledge: (holding: PortfolioHolding, quantity: number, mode: 'pledge' | 'payback') => void;
  currency?: 'INR' | 'USD';
  mode?: 'pledge' | 'payback';
}

const INTEREST_RATE = 8.5; 
const HAIRCUT_PERCENTAGE = 10; 

export function PledgeDialog({
  isOpen,
  onOpenChange,
  holding,
  onConfirmPledge,
  currency = 'INR',
  mode = 'pledge',
}: PledgeDialogProps) {
  const [pledgeQuantity, setPledgeQuantity] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && holding) {
      setPledgeQuantity(holding.quantity);
      setError('');
    }
  }, [isOpen, holding]);

  const { collateralValue, haircutAmount, resultingMargin, interestLevied, totalPaybackAmount } = useMemo(() => {
    if (!holding) return { collateralValue: 0, haircutAmount: 0, resultingMargin: 0, interestLevied: 0, totalPaybackAmount: 0 };
    
    const value = pledgeQuantity * holding.ltp;
    const haircut = value * (HAIRCUT_PERCENTAGE / 100);
    const margin = value - haircut;
    
    // Mock interest for payback calculation (e.g., interest for 30 days)
    const interest = margin * (INTEREST_RATE / 100 / 365) * 30; 
    const payback = value + interest;

    return {
      collateralValue: value,
      haircutAmount: haircut,
      resultingMargin: margin,
      interestLevied: interest,
      totalPaybackAmount: payback,
    };
  }, [pledgeQuantity, holding]);


  const handleConfirm = () => {
    setError('');
    if (!holding) return;
    if (pledgeQuantity <= 0 || pledgeQuantity > holding.quantity) {
      setError(`Quantity must be between 1 and ${holding.quantity}`);
      return;
    }
    onConfirmPledge(holding, pledgeQuantity, mode);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (!holding) return null;

  const title = mode === 'pledge' ? 'Pledge Holdings' : 'Payback and Unpledge';
  const description = mode === 'pledge' 
    ? `Pledge ${holding.name} to get collateral margin.`
    : `Payback funds to release your pledged ${holding.name}.`;
  const buttonText = mode === 'pledge' ? 'Confirm Pledge' : 'Confirm Payback';
  const Icon = mode === 'pledge' ? PlusCircle : MinusCircle;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Icon className="mr-2 h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pledge-quantity">Quantity to {mode}</Label>
            <div className="flex items-center gap-4">
                <Input
                    id="pledge-quantity"
                    type="number"
                    value={pledgeQuantity}
                    onChange={(e) => setPledgeQuantity(Number(e.target.value))}
                    max={holding.quantity}
                    min="1"
                    className="w-24"
                />
                <Slider
                    value={[pledgeQuantity]}
                    onValueChange={(value) => setPledgeQuantity(value[0])}
                    max={holding.quantity}
                    step={1}
                    min={1}
                />
            </div>
            <p className="text-xs text-muted-foreground">Available: {holding.quantity} units</p>
            {error && <p className="text-xs text-destructive pt-1">{error}</p>}
          </div>

          <div className="space-y-3 text-sm p-4 border rounded-lg bg-muted/50">
            {mode === 'pledge' ? (
                <>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Collateral Value</span>
                        <span className="font-medium">{formatCurrency(collateralValue)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Haircut ({HAIRCUT_PERCENTAGE}%)</span>
                        <span className="font-medium text-red-600">- {formatCurrency(haircutAmount)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
                        <span className="text-foreground">Resulting Margin (You Get)</span>
                        <span className="text-primary">{formatCurrency(resultingMargin)}</span>
                    </div>
                </>
            ) : ( // Payback mode
                 <>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Collateral Value</span>
                        <span className="font-medium">{formatCurrency(collateralValue)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. Interest Levied</span>
                        <span className="font-medium text-red-600">+ {formatCurrency(interestLevied)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
                        <span className="text-foreground">Payback Amount (You Pay)</span>
                        <span className="text-destructive">{formatCurrency(totalPaybackAmount)}</span>
                    </div>
                </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Interest at {INTEREST_RATE}% p.a. will be applicable on the margin used.
          </p>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleConfirm}>
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
