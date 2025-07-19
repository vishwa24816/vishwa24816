
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
import { Landmark } from 'lucide-react';
import { Slider } from '../ui/slider';

interface PledgeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  holding: PortfolioHolding | null;
  onConfirmPledge: (holding: PortfolioHolding, quantity: number) => void;
  currency?: 'INR' | 'USD';
}

const INTEREST_RATE = 8.5; 
const HAIRCUT_PERCENTAGE = 10; 

export function PledgeDialog({
  isOpen,
  onOpenChange,
  holding,
  onConfirmPledge,
  currency = 'INR'
}: PledgeDialogProps) {
  const [pledgeQuantity, setPledgeQuantity] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && holding) {
      setPledgeQuantity(holding.quantity);
      setError('');
    }
  }, [isOpen, holding]);

  const { collateralValue, haircutAmount, finalMargin } = useMemo(() => {
    if (!holding) return { collateralValue: 0, haircutAmount: 0, finalMargin: 0 };
    
    const value = pledgeQuantity * holding.ltp;
    const haircut = value * (HAIRCUT_PERCENTAGE / 100);
    const margin = value - haircut;
    
    return {
      collateralValue: value,
      haircutAmount: haircut,
      finalMargin: margin,
    };
  }, [pledgeQuantity, holding]);

  const handlePledge = () => {
    setError('');
    if (!holding) return;
    if (pledgeQuantity <= 0 || pledgeQuantity > holding.quantity) {
      setError(`Quantity must be between 1 and ${holding.quantity}`);
      return;
    }
    onConfirmPledge(holding, pledgeQuantity);
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Landmark className="mr-2 h-5 w-5 text-primary" />
            Pledge Holdings
          </DialogTitle>
          <DialogDescription>
            Pledge <span className="font-semibold">{holding.name}</span> to get collateral margin.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pledge-quantity">Quantity to Pledge</Label>
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Collateral Value</span>
              <span className="font-medium">{formatCurrency(collateralValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Haircut ({HAIRCUT_PERCENTAGE}%)</span>
              <span className="font-medium text-red-600">- {formatCurrency(haircutAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
              <span className="text-foreground">Collateral Margin</span>
              <span className="text-primary">{formatCurrency(finalMargin)}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Interest at {INTEREST_RATE}% p.a. will be applicable on the margin used.
          </p>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handlePledge}>
            Confirm Pledge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
