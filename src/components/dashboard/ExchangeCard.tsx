"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Repeat, PlusCircle, XCircle } from 'lucide-react';
import { allAssets } from '@/lib/mockData';
import type { Stock, PortfolioHolding } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


type AssetType = 'Fiat' | 'Crypto' | 'Wealth';

interface AssetRowState {
    id: number;
    assetType: AssetType;
    asset: Stock | null;
    amount: string;
    error?: string;
}

const AssetRow = ({
    rowState,
    onUpdate,
    onRemove,
    portfolioHoldings,
    isFromRow,
}: {
    rowState: AssetRowState,
    onUpdate: (updatedRow: AssetRowState) => void,
    onRemove: () => void,
    portfolioHoldings?: PortfolioHolding[],
    isFromRow: boolean,
}) => {
    const [searchOpen, setSearchOpen] = useState(false);
    
    const assetsForType = useMemo(() => {
        const baseAssets = allAssets.filter(a => {
            switch (rowState.assetType) {
                case 'Fiat': return a.exchange === 'NSE' || a.exchange === 'BSE' || a.exchange === 'NFO';
                case 'Crypto': return a.exchange === 'Crypto' || a.exchange === 'Crypto Futures';
                case 'Wealth': return a.exchange === 'MF' || a.exchange === 'BOND';
                default: return false;
            }
        });

        if (isFromRow && portfolioHoldings) {
            const holdingSymbols = new Set(portfolioHoldings.map(h => h.symbol));
            return baseAssets.filter(a => holdingSymbols.has(a.symbol));
        }
        return baseAssets;
    }, [rowState.assetType, isFromRow, portfolioHoldings]);

    const handleAssetChange = (assetSymbol: string) => {
        const asset = assetsForType.find(a => a.symbol === assetSymbol) || null;
        onUpdate({ ...rowState, asset });
        setSearchOpen(false);
    }
    
    const handleAmountChange = (amount: string) => {
        let error;
        if (isFromRow && portfolioHoldings && rowState.asset) {
            const holding = portfolioHoldings.find(h => h.symbol === rowState.asset?.symbol);
            if (parseFloat(amount) > (holding?.quantity || 0)) {
                error = `Insufficient balance.`;
            }
        }
        onUpdate({ ...rowState, amount, error });
    }

    const currentHolding = isFromRow && portfolioHoldings && rowState.asset ? portfolioHoldings.find(h => h.symbol === rowState.asset?.symbol) : null;

    return (
        <div className="p-4 rounded-lg bg-muted/50 border space-y-3 relative">
            <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive" onClick={onRemove}>
                <XCircle className="h-4 w-4" />
            </Button>

            {isFromRow && currentHolding && (
                 <p className="text-xs font-medium text-muted-foreground text-right -mb-2">
                    Balance: {currentHolding.quantity.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                 </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={rowState.assetType} onValueChange={(v) => onUpdate({ ...rowState, assetType: v as AssetType, asset: null })}>
                        <SelectTrigger><SelectValue placeholder="Asset Type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Fiat">Fiat (Stocks, F&O)</SelectItem>
                            <SelectItem value="Crypto">Crypto (Spot, Futures)</SelectItem>
                            <SelectItem value="Wealth">Wealth (MF, Bonds)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label>Asset</Label>
                     <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" aria-expanded={searchOpen} className="w-full justify-between font-normal">
                                {rowState.asset ? rowState.asset.name : "Select Asset"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search asset..." />
                                <CommandList>
                                    <CommandEmpty>No asset found.</CommandEmpty>
                                    <CommandGroup>
                                        {assetsForType.map((asset) => (
                                            <CommandItem key={asset.id} value={asset.symbol} onSelect={(currentValue) => handleAssetChange(currentValue.toUpperCase())}>
                                                {asset.name} ({asset.symbol})
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
             <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                    type="number"
                    value={rowState.amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0.00"
                />
                 {rowState.error && <p className="text-xs text-destructive">{rowState.error}</p>}
            </div>
        </div>
    );
}

export function ExchangeCard({ portfolioHoldings }: { portfolioHoldings: PortfolioHolding[] }) {
    const { toast } = useToast();
    const [fromRows, setFromRows] = useState<AssetRowState[]>([{ id: 1, assetType: 'Fiat', asset: null, amount: '' }]);
    const [toRows, setToRows] = useState<AssetRowState[]>([{ id: 1, assetType: 'Crypto', asset: null, amount: '' }]);

    const handleAddRow = (type: 'from' | 'to') => {
        const setter = type === 'from' ? setFromRows : setToRows;
        setter(prev => [...prev, { id: Date.now(), assetType: 'Fiat', asset: null, amount: '' }]);
    };

    const handleUpdateRow = (type: 'from' | 'to', id: number, updatedRow: AssetRowState) => {
        const setter = type === 'from' ? setFromRows : setToRows;
        setter(prev => prev.map(row => row.id === id ? updatedRow : row));
    };

    const handleRemoveRow = (type: 'from' | 'to', id: number) => {
        const setter = type === 'from' ? setFromRows : setToRows;
        setter(prev => prev.filter(row => row.id !== id));
    };

    const handleSwap = () => {
        const hasError = fromRows.some(row => row.error);
        if (hasError) {
            toast({
                title: 'Cannot Swap',
                description: 'Please fix the errors before swapping.',
                variant: 'destructive',
            });
            return;
        }
        
        toast({
            title: 'Swap Initiated (Mock)',
            description: `Your multi-asset swap has been initiated.`,
        });
    }

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
                    <Repeat className="mr-2 h-6 w-6" />
                    Exchange
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-muted-foreground">From</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" onClick={() => handleAddRow('from')}>
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                    </div>
                    {fromRows.map((row, index) => (
                        <AssetRow
                            key={row.id}
                            rowState={row}
                            onUpdate={(updatedRow) => handleUpdateRow('from', row.id, updatedRow)}
                            onRemove={() => handleRemoveRow('from', row.id)}
                            portfolioHoldings={portfolioHoldings}
                            isFromRow={true}
                        />
                    ))}
               </div>
               
               <div className="space-y-2">
                   <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-muted-foreground">To</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" onClick={() => handleAddRow('to')}>
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                    </div>
                    {toRows.map((row, index) => (
                        <AssetRow
                            key={row.id}
                            rowState={row}
                            onUpdate={(updatedRow) => handleUpdateRow('to', row.id, updatedRow)}
                            onRemove={() => handleRemoveRow('to', row.id)}
                            isFromRow={false}
                        />
                    ))}
                </div>
                
                <div className="pt-4">
                    <Button onClick={handleSwap} className="w-full">
                        Swap
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
