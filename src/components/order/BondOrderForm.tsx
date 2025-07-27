
"use client";

import React, { useState } from 'react';
import type { Stock } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { SwipeButton } from '@/components/ui/swipe-button';

interface BondOrderFormProps {
  asset: Stock;
}

export function BondOrderForm({ asset }: BondOrderFormProps) {
    const { toast } = useToast();
    const [bidType, setBidType] = useState<'price' | 'yield'>('price');
    const [bidValue, setBidValue] = useState(asset.price.toFixed(2));
    const [quantity, setQuantity] = useState('1');

    const handlePlaceBid = () => {
        if (!bidValue || !quantity) {
            toast({ title: "Invalid Input", description: "Please enter a valid bid and quantity.", variant: "destructive"});
            return;
        }
        const bidValueDisplay = bidType === 'price' ? `₹${bidValue}` : `${bidValue}% yield`;
        toast({
            title: "Bid Placed (Mock)",
            description: `Bid placed for ${quantity} unit(s) of ${asset.name} at ${bidValueDisplay}.`,
        });
    };
    
    const currencySymbol = '₹';
    const totalValue = (parseFloat(bidValue) || 0) * (parseInt(quantity, 10) || 0);

    return (
        <div className="w-full space-y-4">
            <div className="flex w-full bg-muted p-1 rounded-md">
                <button 
                    onClick={() => setBidType('price')}
                    className={cn("flex-1 text-center text-sm font-medium py-2 rounded-md transition-colors",
                    bidType === 'price' ? 'bg-background shadow' : 'text-muted-foreground'
                )}>
                    Bid by Price
                </button>
                 <button 
                    onClick={() => setBidType('yield')}
                    className={cn("flex-1 text-center text-sm font-medium py-2 rounded-md transition-colors",
                    bidType === 'yield' ? 'bg-background shadow' : 'text-muted-foreground'
                )}>
                    Bid by Yield
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 items-end">
                 <div>
                    <Label htmlFor="bid-value">{bidType === 'price' ? 'Price per unit' : 'Expected Yield (%)'}</Label>
                    <Input id="bid-value" type="number" value={bidValue} onChange={(e) => setBidValue(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" />
                </div>
            </div>

            {bidType === 'price' && (
                <div className="text-sm text-muted-foreground pt-2 border-t">
                    Total investment: <span className="font-semibold text-foreground">
                        {currencySymbol}{totalValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                </div>
            )}
            
            <div className="pt-2">
                <SwipeButton onConfirm={handlePlaceBid} text="Swipe to place Bid" />
            </div>
        </div>
    );
};
