
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Stock } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface SipFormProps {
    asset: Stock;
    assetType: string;
    onSipStart?: () => void; // Optional callback
}

export const SipForm = ({ asset, assetType, onSipStart }: SipFormProps) => {
    const { toast } = useToast();
    const [scheme, setScheme] = useState<'SIP' | 'SWP'>('SIP');

    // SIP State
    const [sipInvestmentType, setSipInvestmentType] = useState<'amount' | 'quantity'>('amount');
    const [sipAmount, setSipAmount] = useState('');
    const [sipQuantity, setSipQuantity] = useState('1');
    const [sipFrequency, setSipFrequency] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Annually'>('Monthly');
    const [sipStartDate, setSipStartDate] = useState<Date | undefined>(new Date());
    const [sipInstallments, setSipInstallments] = useState('');

    // SWP State
    const [swpLumpsum, setSwpLumpsum] = useState('');
    const [swpWithdrawalType, setSwpWithdrawalType] = useState<'amount' | 'quantity'>('amount');
    const [swpWithdrawalAmount, setSwpWithdrawalAmount] = useState('');
    const [swpWithdrawalQuantity, setSwpWithdrawalQuantity] = useState('');

    const currencySymbol = '₹';

    useEffect(() => {
        if (assetType === 'mutual-fund' || assetType === 'bond') {
            setSipInvestmentType('amount');
        }
    }, [assetType]);

    const isSipAmountBased = useMemo(() => {
        if (assetType === 'mutual-fund' || assetType === 'bond') return true;
        return sipInvestmentType === 'amount';
    }, [assetType, sipInvestmentType]);

    const handleStartSip = () => {
        const investmentValue = isSipAmountBased ? `${currencySymbol}${sipAmount}` : `${sipQuantity} Qty`;
        const startDateFormatted = sipStartDate ? format(sipStartDate, "PPP") : "Not set";
        const installmentsInfo = sipInstallments ? `${sipInstallments} installments` : "Ongoing";
        toast({
            title: "SIP Placed (Mock)",
            description: `SIP for ${asset.name} of ${investmentValue} ${sipFrequency.toLowerCase()} starting ${startDateFormatted}, ${installmentsInfo}.`,
        });
        if (onSipStart) {
            onSipStart();
        }
    };
    
    const handleStartSwp = () => {
        const withdrawalValue = swpWithdrawalType === 'amount' ? `${currencySymbol}${swpWithdrawalAmount}` : `${swpWithdrawalQuantity} Qty`;
        const startDateFormatted = sipStartDate ? format(sipStartDate, "PPP") : "Not set";
        const lumpsumInfo = swpLumpsum ? `from a lumpsum investment of ${currencySymbol}${swpLumpsum}` : "";
        
        toast({
            title: "SWP Placed (Mock)",
            description: `SWP for ${asset.name} to withdraw ${withdrawalValue} ${sipFrequency.toLowerCase()} starting ${startDateFormatted} ${lumpsumInfo}.`,
        });
         if (onSipStart) {
            onSipStart();
        }
    };

    return (
        <div className="p-1 space-y-4">
            <div className="space-y-2">
                <Label>Investment Scheme</Label>
                <RadioGroup value={scheme} onValueChange={(v) => setScheme(v as 'SIP' | 'SWP')} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="SIP" id="scheme-sip" />
                        <Label htmlFor="scheme-sip" className="font-normal">SIP</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="SWP" id="scheme-swp" />
                        <Label htmlFor="scheme-swp" className="font-normal">SWP</Label>
                    </div>
                </RadioGroup>
            </div>

            {scheme === 'SIP' && (
                <>
                    {(assetType === 'stock' || assetType === 'crypto') && (
                        <div className="space-y-2">
                            <Label>Investment Type</Label>
                            <RadioGroup value={isSipAmountBased ? 'amount' : 'quantity'} onValueChange={(value) => setSipInvestmentType(value as 'amount' | 'quantity')} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="amount" id="sip-amount-type" />
                                    <Label htmlFor="sip-amount-type" className="font-normal">Amount</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="quantity" id="sip-quantity-type" />
                                    <Label htmlFor="sip-quantity-type" className="font-normal">Quantity</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}
                    {isSipAmountBased ? (
                        <div className="space-y-2">
                            <Label htmlFor="sip-amount">Investment Amount ({currencySymbol})</Label>
                            <Input id="sip-amount" type="number" value={sipAmount} onChange={(e) => setSipAmount(e.target.value)} placeholder="e.g., 5000" />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="sip-quantity">Investment Quantity</Label>
                            <Input id="sip-quantity" type="number" value={sipQuantity} onChange={(e) => setSipQuantity(e.target.value)} placeholder="e.g., 10" min="1" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>Frequency</Label>
                        <RadioGroup value={sipFrequency} onValueChange={(value) => setSipFrequency(value as any)} className="flex flex-wrap gap-x-4 gap-y-2">
                            {(['Daily', 'Weekly', 'Monthly', 'Annually'] as const).map(freq => (
                                <div key={freq} className="flex items-center space-x-2">
                                    <RadioGroupItem value={freq} id={`sip-freq-${freq}`} />
                                    <Label htmlFor={`sip-freq-${freq}`} className="font-normal">{freq}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sip-start-date">Start Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button id="sip-start-date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !sipStartDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {sipStartDate ? format(sipStartDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={sipStartDate} onSelect={setSipStartDate} initialFocus disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sip-installments">Number of Installments (Optional)</Label>
                        <Input id="sip-installments" type="number" value={sipInstallments} onChange={(e) => setSipInstallments(e.target.value)} placeholder="Leave blank for ongoing" />
                    </div>
                    <Button onClick={handleStartSip} className="w-full sm:w-auto text-base py-3 h-12" disabled={(isSipAmountBased ? !sipAmount : !sipQuantity)}>
                        Start SIP
                    </Button>
                </>
            )}

            {scheme === 'SWP' && (
                 <>
                    <div className="space-y-2">
                        <Label htmlFor="swp-lumpsum">Lumpsum Investment ({currencySymbol})</Label>
                        <Input id="swp-lumpsum" type="number" value={swpLumpsum} onChange={(e) => setSwpLumpsum(e.target.value)} placeholder="e.g., 100000" />
                    </div>
                     <div className="space-y-2">
                        <Label>Withdrawal Type</Label>
                        <RadioGroup value={swpWithdrawalType} onValueChange={(value) => setSwpWithdrawalType(value as 'amount' | 'quantity')} className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="amount" id="swp-amount-type" />
                                <Label htmlFor="swp-amount-type" className="font-normal">Amount</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="quantity" id="swp-quantity-type" />
                                <Label htmlFor="swp-quantity-type" className="font-normal">Quantity</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {swpWithdrawalType === 'amount' ? (
                        <div className="space-y-2">
                            <Label htmlFor="swp-withdrawal-amount">Withdrawal Amount ({currencySymbol})</Label>
                            <Input id="swp-withdrawal-amount" type="number" value={swpWithdrawalAmount} onChange={(e) => setSwpWithdrawalAmount(e.target.value)} placeholder="e.g., 1000" />
                        </div>
                    ) : (
                         <div className="space-y-2">
                            <Label htmlFor="swp-withdrawal-quantity">Withdrawal Quantity</Label>
                            <Input id="swp-withdrawal-quantity" type="number" value={swpWithdrawalQuantity} onChange={(e) => setSwpWithdrawalQuantity(e.target.value)} placeholder="e.g., 5" />
                        </div>
                    )}
                     <div className="space-y-2">
                        <Label>Frequency</Label>
                        <RadioGroup value={sipFrequency} onValueChange={(value) => setSipFrequency(value as any)} className="flex flex-wrap gap-x-4 gap-y-2">
                            {(['Weekly', 'Monthly', 'Quarterly', 'Annually'] as const).map(freq => (
                                <div key={freq} className="flex items-center space-x-2">
                                    <RadioGroupItem value={freq} id={`swp-freq-${freq}`} />
                                    <Label htmlFor={`swp-freq-${freq}`} className="font-normal">{freq}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="swp-start-date">Start Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button id="swp-start-date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !sipStartDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {sipStartDate ? format(sipStartDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={sipStartDate} onSelect={setSipStartDate} initialFocus disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button onClick={handleStartSwp} className="w-full sm:w-auto text-base py-3 h-12" disabled={!swpLumpsum || (swpWithdrawalType === 'amount' ? !swpWithdrawalAmount : !swpWithdrawalQuantity)}>
                        Start SWP
                    </Button>
                </>
            )}
        </div>
    );
};
