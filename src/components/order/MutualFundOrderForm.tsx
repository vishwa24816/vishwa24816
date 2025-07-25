
"use client";

import React, { useState, useEffect } from 'react';
import type { Stock } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SipForm } from './SipForm';

interface MutualFundOrderFormProps {
  asset: Stock;
  assetType: "mutual-fund";
}

export function MutualFundOrderForm({ asset, assetType }: MutualFundOrderFormProps) {
    const { toast } = useToast();
    const [oneTimeAmount, setOneTimeAmount] = useState('');
    const [hodlAmount, setHodlAmount] = useState('');
    const [activeTab, setActiveTab] = useState("one-time");

    const isCrypto = asset.exchange?.toLowerCase().includes('crypto');
    const currencySymbol = isCrypto ? '₹' : '₹'; // Always INR now

    const handleOneTimeBuy = () => {
        if (!oneTimeAmount || parseFloat(oneTimeAmount) <= 0) {
            toast({ title: "Invalid Amount", description: "Please enter a valid amount.", variant: "destructive"});
            return;
        }
        toast({
            title: "One-Time Investment (Mock)",
            description: `Investing ${currencySymbol}${oneTimeAmount} in ${asset.name}.`,
        });
    };
    
    const handleHodlBuy = () => {
        if (!hodlAmount || parseFloat(hodlAmount) <= 0) {
            toast({ title: "Invalid Amount", description: "Please enter a valid amount.", variant: "destructive"});
            return;
        }
        toast({
            title: "HODL Investment (Mock)",
            description: `Investing ${currencySymbol}${hodlAmount} in ${asset.name} for the long term.`,
        });
    };

    const handleStartSip = () => {
        // This is a placeholder for the logic inside SipForm
        toast({
            title: "Systematic Plan Initiated (Mock)",
            description: `Systematic Plan for ${asset.name} has been set up.`,
        });
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex w-full space-x-3">
                <TabsList className="grid grid-cols-3 flex-1 h-auto p-0 bg-transparent">
                    <TabsTrigger value="one-time" className="data-[state=active]:bg-muted data-[state=active]:text-foreground h-12 rounded-lg text-base">One-time</TabsTrigger>
                    <TabsTrigger value="hodl" className="data-[state=active]:bg-muted data-[state=active]:text-foreground h-12 rounded-lg text-base">HODL</TabsTrigger>
                    <TabsTrigger value="start-sp" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-12 rounded-lg text-base">Start SP</TabsTrigger>
                </TabsList>
            </div>
            
            <TabsContent value="one-time" className="mt-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="one-time-amount">Investment Amount ({currencySymbol})</Label>
                        <Input id="one-time-amount" type="number" value={oneTimeAmount} onChange={(e) => setOneTimeAmount(e.target.value)} placeholder="e.g., 5000" />
                    </div>
                    <Button onClick={handleOneTimeBuy} className="w-full text-base py-3 h-12">Invest Now</Button>
                </div>
            </TabsContent>
            <TabsContent value="hodl" className="mt-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="hodl-amount">Investment Amount ({currencySymbol})</Label>
                        <Input id="hodl-amount" type="number" value={hodlAmount} onChange={(e) => setHodlAmount(e.target.value)} placeholder="e.g., 50000" />
                    </div>
                    <Button onClick={handleHodlBuy} className="w-full text-base py-3 h-12">Invest for Long Term</Button>
                </div>
            </TabsContent>
            <TabsContent value="start-sp" className="mt-4">
                <SipForm asset={asset} assetType={assetType} onSipStart={handleStartSip} />
            </TabsContent>
        </Tabs>
    );
};
