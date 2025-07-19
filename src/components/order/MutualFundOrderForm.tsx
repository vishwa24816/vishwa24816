
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

    const handleStartSip = () => {
        // This is a placeholder for the logic inside SipForm
        toast({
            title: "Start SIP (Mock)",
            description: `Starting SIP for ${asset.name}.`,
        });
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex w-full space-x-3">
                <TabsList className="grid grid-cols-2 flex-1 h-auto p-0 bg-transparent">
                    <TabsTrigger value="one-time" className="data-[state=active]:bg-muted data-[state=active]:text-foreground h-12 rounded-lg text-base">One-time</TabsTrigger>
                    <TabsTrigger value="start-sip" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-12 rounded-lg text-base">Start SIP</TabsTrigger>
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
            <TabsContent value="start-sip" className="mt-4">
                <SipForm asset={asset} assetType={assetType} onSipStart={handleStartSip} />
            </TabsContent>
        </Tabs>
    );
};
