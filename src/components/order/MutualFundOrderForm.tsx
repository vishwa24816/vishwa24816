
"use client";

import React, { useState, useEffect } from 'react';
import type { Stock } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SipForm } from './SipForm';
import type { InitialOrderDetails } from '@/app/page';
import { SwipeButton } from '@/components/ui/swipe-button';

interface MutualFundOrderFormProps {
  asset: Stock;
  assetType: "mutual-fund";
  initialDetails: InitialOrderDetails | null;
}

export function MutualFundOrderForm({ asset, assetType, initialDetails }: MutualFundOrderFormProps) {
    const { toast } = useToast();
    const [oneTimeAmount, setOneTimeAmount] = useState('');
    const [hodlAmount, setHodlAmount] = useState('');
    const [activeTab, setActiveTab] = useState(initialDetails?.orderType === 'SIP' ? "start-sp" : "one-time");

    const [lockInYears, setLockInYears] = useState('');
    const [lockInMonths, setLockInMonths] = useState('');

    const isCrypto = asset.exchange?.toLowerCase().includes('crypto');
    const currencySymbol = '₹';

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
        let lockInPeriod = '';
        if (lockInYears || lockInMonths) {
            lockInPeriod = ` for a lock-in period of ${lockInYears || 0} years and ${lockInMonths || 0} months`;
        }
        toast({
            title: "HODL Investment (Mock)",
            description: `Investing ${currencySymbol}${hodlAmount} in ${asset.name} for the long term${lockInPeriod}.`,
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
                    <div className="pt-2">
                      <SwipeButton onConfirm={handleOneTimeBuy} text="Swipe to Invest" />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="hodl" className="mt-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="hodl-amount">Investment Amount ({currencySymbol})</Label>
                        <Input id="hodl-amount" type="number" value={hodlAmount} onChange={(e) => setHodlAmount(e.target.value)} placeholder="e.g., 50000" />
                    </div>

                    <div className="space-y-2 pt-2">
                        <Label>Lock-in Period</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="lock-in-years" className="text-xs text-muted-foreground">Years</Label>
                                <Input id="lock-in-years" type="number" placeholder="Years" value={lockInYears} onChange={e => setLockInYears(e.target.value)} min="0" />
                            </div>
                            <div>
                                <Label htmlFor="lock-in-months" className="text-xs text-muted-foreground">Months</Label>
                                <Input id="lock-in-months" type="number" placeholder="Months" value={lockInMonths} onChange={e => setLockInMonths(e.target.value)} min="0" max="11"/>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <SwipeButton onConfirm={handleHodlBuy} text="Swipe to HODL" />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="start-sp" className="mt-4">
                <SipForm asset={asset} assetType={assetType} onSipStart={handleStartSip} initialDetails={initialDetails} />
            </TabsContent>
        </Tabs>
    );
};
