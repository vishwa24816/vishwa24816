
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, Repeat } from 'lucide-react';
import { allAssets } from '@/lib/mockData';
import type { Stock, PortfolioHolding } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


type AssetType = 'Fiat' | 'Crypto' | 'Wealth';

const AssetRow = ({
    label,
    assetType,
    setAssetType,
    selectedAsset,
    setSelectedAsset,
    amount,
    setAmount,
    isReadOnly = false,
    balance
}: {
    label: string,
    assetType: AssetType,
    setAssetType: (type: AssetType) => void,
    selectedAsset: Stock | null,
    setSelectedAsset: (asset: Stock | null) => void,
    amount: string,
    setAmount: (amount: string) => void,
    isReadOnly?: boolean,
    balance?: number | null;
}) => {
    const assetsForType = useMemo(() => {
        switch (assetType) {
            case 'Fiat':
                return allAssets.filter(a => a.exchange === 'NSE' || a.exchange === 'BSE' || a.exchange === 'NFO');
            case 'Crypto':
                return allAssets.filter(a => a.exchange === 'Crypto' || a.exchange === 'Crypto Futures');
            case 'Wealth':
                 return allAssets.filter(a => a.exchange === 'MF' || a.exchange === 'BOND');
            default:
                return [];
        }
    }, [assetType]);
    
    const handleAssetChange = (symbol: string) => {
        const asset = assetsForType.find(a => a.symbol === symbol) || null;
        setSelectedAsset(asset);
    }

    return (
        <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
            <div className="flex justify-between items-center">
                 <p className="text-sm font-medium text-muted-foreground">{label}</p>
                 {balance !== undefined && balance !== null && (
                    <p className="text-xs font-medium text-muted-foreground">Balance: {balance.toLocaleString()}</p>
                 )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${label}-type`}>Type</Label>
                    <Select value={assetType} onValueChange={(v) => {
                        setAssetType(v as AssetType);
                        setSelectedAsset(null);
                    }}>
                        <SelectTrigger id={`${label}-type`}>
                            <SelectValue placeholder="Asset Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Fiat">Fiat (Stocks, F&O)</SelectItem>
                            <SelectItem value="Crypto">Crypto (Spot, Futures)</SelectItem>
                            <SelectItem value="Wealth">Wealth (MF, Bonds)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor={`${label}-asset`}>Asset</Label>
                    <Select value={selectedAsset?.symbol || ''} onValueChange={handleAssetChange}>
                         <SelectTrigger id={`${label}-asset`}>
                            <SelectValue placeholder="Select Asset" />
                        </SelectTrigger>
                        <SelectContent>
                             {assetsForType.map(asset => (
                                <SelectItem key={asset.id} value={asset.symbol}>
                                    {asset.name} ({asset.symbol})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor={`${label}-amount`}>Quantity</Label>
                <Input
                    id={`${label}-amount`}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    readOnly={isReadOnly}
                    placeholder="0.00"
                />
            </div>
        </div>
    );
}


export function ExchangeCard({ portfolioHoldings }: { portfolioHoldings: PortfolioHolding[] }) {
    const { toast } = useToast();
    const [fromAssetType, setFromAssetType] = useState<AssetType>('Fiat');
    const [toAssetType, setToAssetType] = useState<AssetType>('Crypto');
    const [fromAsset, setFromAsset] = useState<Stock | null>(null);
    const [toAsset, setToAsset] = useState<Stock | null>(null);
    const [fromAmount, setFromAmount] = useState('');
    const [error, setError] = useState<string | null>(null);

    const fromAssetHolding = useMemo(() => {
        if (!fromAsset) return null;
        return portfolioHoldings.find(h => h.symbol === fromAsset.symbol);
    }, [fromAsset, portfolioHoldings]);

    useEffect(() => {
        if (!fromAsset || !fromAmount) {
            setError(null);
            return;
        }

        const holdingQty = fromAssetHolding?.quantity || 0;
        const enteredQty = parseFloat(fromAmount);

        if (enteredQty > holdingQty) {
            setError(`Insufficient balance. You only have ${holdingQty.toLocaleString()} ${fromAsset.symbol}.`);
        } else {
            setError(null);
        }

    }, [fromAmount, fromAsset, fromAssetHolding]);
    
    const exchangeRate = useMemo(() => {
        if (!fromAsset || !toAsset) return null;
        // Mock exchange rate
        return fromAsset.price / toAsset.price;
    }, [fromAsset, toAsset]);

    const toAmount = useMemo(() => {
        if (!exchangeRate || !fromAmount) return '';
        return (parseFloat(fromAmount) * exchangeRate).toFixed(6);
    }, [exchangeRate, fromAmount]);

    const handleSwap = () => {
        if (error) {
            toast({
                title: 'Cannot Swap',
                description: error,
                variant: 'destructive',
            });
            return;
        }
        
        if (!fromAsset || !toAsset || !fromAmount || !toAmount) {
            toast({
                title: 'Incomplete Details',
                description: 'Please select both assets and enter an amount.',
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: 'Swap Initiated (Mock)',
            description: `Swapping ${fromAmount} ${fromAsset.symbol} for an estimated ${toAmount} ${toAsset.symbol}.`,
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
               <AssetRow 
                    label="From"
                    assetType={fromAssetType}
                    setAssetType={setFromAssetType}
                    selectedAsset={fromAsset}
                    setSelectedAsset={setFromAsset}
                    amount={fromAmount}
                    setAmount={setFromAmount}
                    balance={fromAssetHolding?.quantity}
               />
               
               <AssetRow
                    label="To"
                    assetType={toAssetType}
                    setAssetType={setToAssetType}
                    selectedAsset={toAsset}
                    setSelectedAsset={setToAsset}
                    amount={toAmount}
                    setAmount={() => {}} // This is calculated, so empty setter
                    isReadOnly={true}
                />
                
                {exchangeRate && (
                    <div className="text-center text-sm text-muted-foreground pt-2">
                        <p>Rate: 1 {fromAsset?.symbol} ≈ {exchangeRate.toFixed(4)} {toAsset?.symbol}</p>
                    </div>
                )}
                
                {error && (
                    <p className="text-sm text-center text-destructive pt-2">{error}</p>
                )}
                
                <div className="pt-4">
                    <Button onClick={handleSwap} className="w-full" disabled={!!error || !fromAsset || !toAsset || !fromAmount}>
                        Swap
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

    