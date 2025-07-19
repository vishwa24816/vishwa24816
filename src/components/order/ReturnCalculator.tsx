
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Calculator } from 'lucide-react';

interface CalculationResult {
  investedAmount: number;
  estReturns: number;
  totalValue: number;
}

interface ReturnCalculatorProps {
  defaultReturnRate: number;
  currency?: 'INR' | 'USD';
}

export function ReturnCalculator({ defaultReturnRate, currency = 'INR' }: ReturnCalculatorProps) {
  const [investmentMode, setInvestmentMode] = useState<'lumpsum' | 'sip'>('lumpsum');

  // Lumpsum state
  const [lumpsumAmount, setLumpsumAmount] = useState('10000');
  
  // SIP state
  const [sipAmount, setSipAmount] = useState('1000'); // Updated default for INR

  // Common state
  const [timePeriod, setTimePeriod] = useState(10);
  
  const [result, setResult] = useState<CalculationResult | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const currencySymbol = '₹';

  const handleCalculate = () => {
    const rate = defaultReturnRate / 100;
    const years = timePeriod;
    
    let investedAmount = 0;
    let totalValue = 0;

    if (investmentMode === 'lumpsum') {
      const principal = parseFloat(lumpsumAmount);
      if (isNaN(principal) || principal <= 0) return;
      investedAmount = principal;
      totalValue = principal * Math.pow((1 + rate), years);
    } else { // SIP
      const monthlyInvestment = parseFloat(sipAmount);
      if (isNaN(monthlyInvestment) || monthlyInvestment <= 0) return;
      const monthlyRate = rate / 12;
      const numberOfMonths = years * 12;
      investedAmount = monthlyInvestment * numberOfMonths;
      totalValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, numberOfMonths) - 1) / monthlyRate));
    }
    
    const estReturns = totalValue - investedAmount;

    setResult({
      investedAmount: parseFloat(investedAmount.toFixed(0)),
      estReturns: parseFloat(estReturns.toFixed(0)),
      totalValue: parseFloat(totalValue.toFixed(0)),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            Returns Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={investmentMode} onValueChange={(v) => {
            setInvestmentMode(v as any);
            setResult(null);
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lumpsum">Lumpsum</TabsTrigger>
            <TabsTrigger value="sip">SIP</TabsTrigger>
          </TabsList>
          <TabsContent value="lumpsum" className="mt-4 space-y-6">
             <div className="space-y-2">
                <Label htmlFor="lumpsum-amount">Total Investment ({currencySymbol})</Label>
                <Input id="lumpsum-amount" type="text" value={lumpsumAmount} onChange={(e) => setLumpsumAmount(e.target.value.replace(/,/g, ''))} />
              </div>
          </TabsContent>
          <TabsContent value="sip" className="mt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sip-amount">Monthly Investment ({currencySymbol})</Label>
                <Input id="sip-amount" type="text" value={sipAmount} onChange={(e) => setSipAmount(e.target.value.replace(/,/g, ''))} />
              </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-6 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Annual Return Rate (p.a.)</Label>
                <span className="font-semibold text-primary">{defaultReturnRate.toFixed(2)}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Based on the fund's historical performance. Not guaranteed.</p>
            </div>
            
            <div className="space-y-2">
               <div className="flex justify-between">
                <Label htmlFor="time-period">Time period (Years)</Label>
                <span className="font-semibold">{timePeriod} Yr</span>
              </div>
              <Slider id="time-period" min={1} max={40} step={1} value={[timePeriod]} onValueChange={([val]) => setTimePeriod(val)} />
            </div>
        </div>

        <Button onClick={handleCalculate} className="w-full mt-6">Calculate</Button>

        {result && (
          <div className="mt-6 space-y-3 pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground">Invested amount</p>
                <p className="font-medium text-foreground">{formatCurrency(result.investedAmount)}</p>
            </div>
             <div className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground">Est. returns</p>
                <p className="font-medium text-foreground">{formatCurrency(result.estReturns)}</p>
            </div>
             <div className="flex justify-between items-center text-lg">
                <p className="text-muted-foreground font-semibold">Total value</p>
                <p className="font-bold text-primary">{formatCurrency(result.totalValue)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
