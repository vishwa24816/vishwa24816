
"use client";

import React, { useState, useMemo } from 'react';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FoBasket, Stock } from '@/types';
import { mockFoBaskets } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AddToBasketDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  asset: Stock;
  assetType: "stock" | "future" | "option" | "crypto" | "mutual-fund" | "bond";
}

export function AddToBasketDialog({ isOpen, onOpenChange, asset, assetType }: AddToBasketDialogProps) {
  const { toast } = useToast();
  const [selectedBasketId, setSelectedBasketId] = useState<string | undefined>(undefined);

  const availableBaskets = useMemo(() => {
    const nonExecutedBaskets = mockFoBaskets.filter(
      (basket) => !['Executed', 'Cancelled', 'Archived'].includes(basket.status)
    );

    // Simple heuristic to filter baskets by type based on name
    if (assetType === 'stock') {
      return nonExecutedBaskets.filter(basket => 
        basket.name.toLowerCase().includes('stock') || basket.name.toLowerCase().includes('equity') || basket.name.toLowerCase().includes('bluechip')
      );
    } else if (assetType === 'crypto') {
      return nonExecutedBaskets.filter(basket => 
        basket.name.toLowerCase().includes('crypto') || basket.name.toLowerCase().includes('defi')
      );
    } else if (assetType === 'mutual-fund') {
      return nonExecutedBaskets.filter(basket => 
        basket.name.toLowerCase().includes('mf') || basket.name.toLowerCase().includes('mutual fund')
      );
    }
    // For F&O or other types, show all non-executed baskets or those that don't explicitly mention other types
    return nonExecutedBaskets.filter(basket => 
        !basket.name.toLowerCase().includes('stock') &&
        !basket.name.toLowerCase().includes('crypto') &&
        !basket.name.toLowerCase().includes('mf')
    );
  }, [assetType]);

  const handleAddToBasket = () => {
    if (!selectedBasketId) {
      toast({ title: "Error", description: "Please select a basket.", variant: "destructive" });
      return;
    }
    const selectedBasket = availableBaskets.find(b => b.id === selectedBasketId);
    if (selectedBasket) {
      toast({
        title: "Added to Basket (Mock)",
        description: `${asset.name} would be added to basket: ${selectedBasket.name}.`,
      });
      onOpenChange(false);
      setSelectedBasketId(undefined);
    }
  };

  const handleCreateNewBasket = () => {
    toast({
        title: "Create New Basket (Coming Soon)",
        description: "Functionality to create a new basket will be available soon."
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Basket</DialogTitle>
          <DialogDescription>
            Select an existing basket to add <span className="font-semibold">{asset.name} ({asset.symbol})</span> to, or create a new one.
          </DialogDescription>
        </DialogHeader>
        
        {availableBaskets.length > 0 ? (
          <ScrollArea className="max-h-[300px] pr-4">
            <RadioGroup value={selectedBasketId} onValueChange={setSelectedBasketId} className="space-y-2 py-2">
              {availableBaskets.map((basket) => (
                <Label
                  key={basket.id}
                  htmlFor={`basket-${basket.id}`}
                  className={cn(
                    "flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                    selectedBasketId === basket.id && "bg-primary/10 border-primary ring-1 ring-primary"
                  )}
                >
                  <div>
                    <p className="font-medium">{basket.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {basket.instrumentsCount} instrument(s) | Margin: ₹{basket.requiredMargin.toLocaleString()}
                    </p>
                  </div>
                  <RadioGroupItem value={basket.id} id={`basket-${basket.id}`} className="ml-2" />
                </Label>
              ))}
            </RadioGroup>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No suitable active baskets found for <span className="font-semibold">{assetType}</span>. You can create a new one.
          </p>
        )}

        <DialogFooter className="sm:justify-between pt-4">
            <Button variant="outline" onClick={handleCreateNewBasket}>
                Create New Basket
            </Button>
            <div className="flex gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleAddToBasket} disabled={!selectedBasketId || availableBaskets.length === 0}>
                    Add to Selected Basket
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
