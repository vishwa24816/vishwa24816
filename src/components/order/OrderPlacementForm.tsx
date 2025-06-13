
"use client";

import React, { useState, useEffect } from 'react';
import type { Stock } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCcw,ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface OrderPlacementFormProps {
  stock: Stock;
  productType: string;
  onProductTypeChange: (value: string) => void;
}

export function OrderPlacementForm({ stock, productType, onProductTypeChange }: OrderPlacementFormProps) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(stock.price);
  const [triggerPrice, setTriggerPrice] = useState(0);

  const [selectedExchange, setSelectedExchange] = useState<'BSE' | 'NSE'>('NSE');
  const [orderMode, setOrderMode] = useState('Regular'); 
  // productType is now a prop
  const [orderType, setOrderType] = useState('Limit'); // Market, Limit, SL, SL-M

  // State for "More Options"
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [enableStopLoss, setEnableStopLoss] = useState(false);
  const [stopLossInputValue, setStopLossInputValue] = useState('');
  const [stopLossType, setStopLossType] = useState<'price' | 'percentage'>('price');
  const [enableTakeProfit, setEnableTakeProfit] = useState(false);
  const [takeProfitInputValue, setTakeProfitInputValue] = useState('');
  const [takeProfitType, setTakeProfitType] = useState<'price' | 'percentage'>('price');
  
  const [mtfLeverage, setMtfLeverage] = useState('1x');


  useEffect(() => {
    setPrice(stock.price);
  }, [stock.price]);

  const calculatedMargin = quantity * price; // This might need adjustment for MTF leverage later

  const handleOrderAction = (action: 'BUY' | 'SELL') => { // General handler for toast
    let slInfo = '';
    if (enableStopLoss && stopLossInputValue) {
      slInfo = `SL: ${stopLossInputValue}${stopLossType === 'percentage' ? '%' : ''}`;
    }
    let tpInfo = '';
    if (enableTakeProfit && takeProfitInputValue) {
      tpInfo = `TP: ${takeProfitInputValue}${takeProfitType === 'percentage' ? '%' : ''}`;
    }
    const advancedOptions = [slInfo, tpInfo].filter(Boolean).join(', ');
    let leverageInfo = '';
    if (orderMode === 'MTF') {
        leverageInfo = `Leverage: ${mtfLeverage}`;
    }

    toast({
      title: `Order Placed (Mock - ${orderMode})`,
      description: `${action} ${quantity} x ${stock.symbol} @ ${orderType === 'Market' ? 'Market' : `₹${price}`} (${productType}) ${advancedOptions ? `(${advancedOptions})` : ''} ${leverageInfo}`,
    });
  };


  const exchangePrice = selectedExchange === 'NSE' ? stock.price : (stock.price * 0.995); // Mock BSE price
  const orderModeTabs = ['Regular', 'AMO', 'MTF', 'SIP'];

  const renderOrderFields = (currentOrderMode: string) => (
    <>
      <RadioGroup
        value={productType}
        onValueChange={onProductTypeChange} // Use prop setter
        className="flex space-x-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Intraday" id={`intraday-${currentOrderMode}`} />
          <Label htmlFor={`intraday-${currentOrderMode}`} className="font-normal">Intraday <span className="text-muted-foreground text-xs">MIS</span></Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Longterm" id={`longterm-${currentOrderMode}`} />
          <Label htmlFor={`longterm-${currentOrderMode}`} className="font-normal">Longterm <span className="text-muted-foreground text-xs">CNC</span></Label>
        </div>
      </RadioGroup>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-end">
        <div>
          <Label htmlFor={`qty-${currentOrderMode}`}>Qty.</Label>
          <Input
            id={`qty-${currentOrderMode}`}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
          />
        </div>
        <div>
          <Label htmlFor={`price-${currentOrderMode}`}>Price</Label>
          <Input
            id={`price-${currentOrderMode}`}
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            disabled={orderType === 'Market'}
            step="0.05"
          />
        </div>
        <div className="hidden sm:block">
          <Label htmlFor={`trigger_price-${currentOrderMode}`} className={cn(orderType !== 'SL' && orderType !== 'SL-M' && "text-muted-foreground/50")}>Trigger price</Label>
          <Input
            id={`trigger_price-${currentOrderMode}`}
            type="number"
            value={triggerPrice}
            onChange={(e) => setTriggerPrice(parseFloat(e.target.value) || 0)}
            disabled={orderType !== 'SL' && orderType !== 'SL-M'}
            className={cn(orderType !== 'SL' && orderType !== 'SL-M' && "bg-muted/30 border-dashed placeholder:text-muted-foreground/30")}
            placeholder="0"
          />
        </div>
      </div>
       <div className="sm:hidden mt-4">
          <Label htmlFor={`trigger_price_sm-${currentOrderMode}`} className={cn(orderType !== 'SL' && orderType !== 'SL-M' && "text-muted-foreground/50")}>Trigger price</Label>
          <Input
            id={`trigger_price_sm-${currentOrderMode}`}
            type="number"
            value={triggerPrice}
            onChange={(e) => setTriggerPrice(parseFloat(e.target.value) || 0)}
            disabled={orderType !== 'SL' && orderType !== 'SL-M'}
            className={cn(orderType !== 'SL' && orderType !== 'SL-M' && "bg-muted/30 border-dashed placeholder:text-muted-foreground/30")}
            placeholder="0"
          />
        </div>

      <RadioGroup
        value={orderType}
        onValueChange={(value) => {
          setOrderType(value);
          if (value === 'Market') setPrice(exchangePrice); 
          if (value !== 'SL' && value !== 'SL-M') setTriggerPrice(0);
        }}
        className="flex flex-wrap gap-x-4 gap-y-2"
      >
        {(['Market', 'Limit', 'SL', 'SL-M'] as const).map(type => (
          <div key={type} className="flex items-center space-x-2">
            <RadioGroupItem value={type} id={`orderType-${type}-${currentOrderMode}`} />
            <Label htmlFor={`orderType-${type}-${currentOrderMode}`} className="font-normal">{type}</Label>
          </div>
        ))}
      </RadioGroup>

      {currentOrderMode === 'MTF' && (
        <div className="space-y-2 pt-2">
            <Label>Leverage</Label>
            <RadioGroup 
                value={mtfLeverage} 
                onValueChange={setMtfLeverage} 
                className="flex flex-wrap gap-x-4 gap-y-2"
            >
            {['1x', '2x', '3x', '4x'].map(val => (
                <div key={val} className="flex items-center space-x-2">
                <RadioGroupItem value={val} id={`leverage-${val}-mtf`} />
                <Label htmlFor={`leverage-${val}-mtf`} className="font-normal">{val}</Label>
                </div>
            ))}
            </RadioGroup>
        </div>
      )}

      <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs flex items-center" onClick={() => setShowMoreOptions(!showMoreOptions)}>
        More options <ChevronDown className={cn("h-3 w-3 ml-0.5 transition-transform duration-200", showMoreOptions && "rotate-180")} />
      </Button>
      
      {showMoreOptions && (
        <div className="mt-1 p-3 border rounded-md bg-muted/30 space-y-4 animate-accordion-down">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`enableStopLoss-${currentOrderMode}`} className="flex items-center font-normal text-sm">
                <Checkbox 
                  id={`enableStopLoss-${currentOrderMode}`} 
                  className="mr-2" 
                  checked={enableStopLoss} 
                  onCheckedChange={(checked) => setEnableStopLoss(Boolean(checked))}
                /> 
                Stop loss
              </Label>
              <RadioGroup 
                value={stopLossType} 
                onValueChange={(value) => setStopLossType(value as 'price' | 'percentage')} 
                className="flex"
                disabled={!enableStopLoss}
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="price" id={`slPrice-${currentOrderMode}`} disabled={!enableStopLoss} />
                  <Label htmlFor={`slPrice-${currentOrderMode}`} className={cn("text-xs font-normal", !enableStopLoss && "text-muted-foreground/50")}>Price</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="percentage" id={`slPercentage-${currentOrderMode}`} disabled={!enableStopLoss} />
                  <Label htmlFor={`slPercentage-${currentOrderMode}`} className={cn("text-xs font-normal", !enableStopLoss && "text-muted-foreground/50")}>%</Label>
                </div>
              </RadioGroup>
            </div>
            <Input 
              id={`stopLossValue-${currentOrderMode}`} 
              type="number" 
              placeholder="0" 
              value={stopLossInputValue}
              onChange={(e) => setStopLossInputValue(e.target.value)}
              disabled={!enableStopLoss}
              className={cn(!enableStopLoss && "bg-muted/50 border-dashed")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`enableTakeProfit-${currentOrderMode}`} className="flex items-center font-normal text-sm">
                <Checkbox 
                  id={`enableTakeProfit-${currentOrderMode}`} 
                  className="mr-2" 
                  checked={enableTakeProfit}
                  onCheckedChange={(checked) => setEnableTakeProfit(Boolean(checked))}
                /> 
                Take profit
              </Label>
              <RadioGroup 
                value={takeProfitType} 
                onValueChange={(value) => setTakeProfitType(value as 'price' | 'percentage')} 
                className="flex"
                disabled={!enableTakeProfit}
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="price" id={`tpPrice-${currentOrderMode}`} disabled={!enableTakeProfit}/>
                  <Label htmlFor={`tpPrice-${currentOrderMode}`} className={cn("text-xs font-normal", !enableTakeProfit && "text-muted-foreground/50")}>Price</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="percentage" id={`tpPercentage-${currentOrderMode}`} disabled={!enableTakeProfit}/>
                  <Label htmlFor={`tpPercentage-${currentOrderMode}`} className={cn("text-xs font-normal", !enableTakeProfit && "text-muted-foreground/50")}>%</Label>
                </div>
              </RadioGroup>
            </div>
            <Input 
              id={`takeProfitValue-${currentOrderMode}`} 
              type="number" 
              placeholder="0" 
              value={takeProfitInputValue}
              onChange={(e) => setTakeProfitInputValue(e.target.value)}
              disabled={!enableTakeProfit}
              className={cn(!enableTakeProfit && "bg-muted/50 border-dashed")}
            />
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="bg-card shadow-md rounded-lg mt-4">
      <div className="bg-card text-card-foreground p-3 rounded-t-lg border-b">
        <div className="flex justify-between items-center mb-2">
          {/* h2 title removed */}
        </div>
        <RadioGroup
          defaultValue="NSE"
          value={selectedExchange}
          onValueChange={(value) => setSelectedExchange(value as 'BSE' | 'NSE')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="BSE" id="BSE" className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
            <Label htmlFor="BSE" className="text-sm text-card-foreground">BSE: ₹{(stock.price * 0.995).toFixed(2)}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="NSE" id="NSE" className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
            <Label htmlFor="NSE" className="text-sm text-card-foreground">NSE: ₹{stock.price.toFixed(2)}</Label>
          </div>
        </RadioGroup>
      </div>

      <Tabs value={orderMode} onValueChange={setOrderMode} className="w-full">
        <div className="flex justify-between items-center border-b px-1">
            <TabsList className="bg-transparent p-0 justify-start">
            {orderModeTabs.map((mode) => (
                <TabsTrigger
                key={mode}
                value={mode}
                className="text-xs sm:text-sm px-2 sm:px-3 py-2.5 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none text-muted-foreground hover:text-primary"
                >
                {mode}
                </TabsTrigger>
            ))}
            </TabsList>
        </div>

        <TabsContent value="Regular" className="p-4 space-y-4 mt-0">
          {renderOrderFields("Regular")}
        </TabsContent>
        
        <TabsContent value="AMO" className="p-4 space-y-4 mt-0">
           {renderOrderFields("AMO")}
        </TabsContent>

        <TabsContent value="MTF" className="p-4 space-y-4 mt-0">
            {renderOrderFields("MTF")}
        </TabsContent>

        <TabsContent value="SIP" className="p-4 mt-0 text-center text-muted-foreground">
            <p className="mb-4 pt-4">SIP order options will be shown here.</p>
            {/* Margin and buttons removed from here */}
        </TabsContent>

      </Tabs>
    </div>
  );
}
