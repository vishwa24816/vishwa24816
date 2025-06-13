
"use client";

import React, { useState, useEffect } from 'react';
import type { Stock } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Tag, Gavel, RefreshCcw,ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface OrderPlacementFormProps {
  stock: Stock;
}

export function OrderPlacementForm({ stock }: OrderPlacementFormProps) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(stock.price);
  const [triggerPrice, setTriggerPrice] = useState(0);

  const [selectedExchange, setSelectedExchange] = useState<'BSE' | 'NSE'>('NSE');
  const [orderMode, setOrderMode] = useState('Regular'); // Regular, Cover, AMO, Iceberg
  const [productType, setProductType] = useState('Longterm'); // Intraday, Longterm
  const [orderType, setOrderType] = useState('Limit'); // Market, Limit, SL, SL-M

  const [isGttStoplossEnabled, setIsGttStoplossEnabled] = useState(false);
  const [gttStoplossValue, setGttStoplossValue] = useState('');
  const [isGttTargetEnabled, setIsGttTargetEnabled] = useState(false);
  const [gttTargetValue, setGttTargetValue] = useState('');

  const [isBseNseSwitchOn, setIsBseNseSwitchOn] = useState(false); // For the top right switch

  useEffect(() => {
    setPrice(stock.price);
  }, [stock.price]);

  const calculatedMargin = quantity * price;

  const handleBuy = ()_> {
    toast({
      title: "Order Placed (Mock)",
      description: `BUY ${quantity} x ${stock.symbol} @ ${orderType === 'Market' ? 'Market' : `₹${price}`} (${productType})`,
    });
  };

  const handleCancel = () => {
    toast({
      title: "Order Cancelled (Mock)",
      variant: "destructive"
    });
  };

  const exchangePrice = selectedExchange === 'NSE' ? stock.price : (stock.price * 0.995); // Mock BSE price

  return (
    <div className="bg-card shadow-md rounded-lg mt-4">
      {/* Header Section */}
      <div className="bg-primary text-primary-foreground p-3 rounded-t-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Buy {stock.symbol} <span className="text-sm">x {quantity} Qty</span></h2>
          <div className="flex items-center space-x-2">
            <Switch id="bse-nse-toggle-switch" checked={isBseNseSwitchOn} onCheckedChange={setIsBseNseSwitchOn} />
            <Info className="h-5 w-5 cursor-pointer" onClick={() => toast({title: "Info", description: "Toggle for advanced options or settings."})} />
          </div>
        </div>
        <RadioGroup
          defaultValue="NSE"
          value={selectedExchange}
          onValueChange={(value) => setSelectedExchange(value as 'BSE' | 'NSE')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="BSE" id="BSE" className="border-primary-foreground/50 data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary" />
            <Label htmlFor="BSE" className="text-sm">BSE: ₹{(stock.price * 0.995).toFixed(2)}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="NSE" id="NSE" className="border-primary-foreground/50 data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary" />
            <Label htmlFor="NSE" className="text-sm">NSE: ₹{stock.price.toFixed(2)}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Tabs for Order Modes */}
      <Tabs value={orderMode} onValueChange={setOrderMode} className="w-full">
        <div className="flex justify-between items-center border-b px-1">
            <TabsList className="bg-transparent p-0 justify-start">
            {['Regular', 'Cover', 'AMO', 'Iceberg'].map((mode) => (
                <TabsTrigger
                key={mode}
                value={mode}
                className="text-xs sm:text-sm px-2 sm:px-3 py-2.5 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none text-muted-foreground hover:text-primary"
                >
                {mode}
                </TabsTrigger>
            ))}
            </TabsList>
            <Button variant="link" size="sm" className="text-primary text-xs sm:text-sm pr-3" onClick={() => toast({title: "Tags Clicked", description: "Feature to add tags to your order."})}>
                <Tag className="h-3 w-3 mr-1" /> Tags
            </Button>
        </div>

        <TabsContent value="Regular" className="p-4 space-y-4 mt-0">
          {/* Product Type Radio */}
          <RadioGroup
            value={productType}
            onValueChange={setProductType}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Intraday" id="intraday" />
              <Label htmlFor="intraday" className="font-normal">Intraday <span className="text-muted-foreground text-xs">MIS</span></Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Longterm" id="longterm" />
              <Label htmlFor="longterm" className="font-normal">Longterm <span className="text-muted-foreground text-xs">CNC</span></Label>
            </div>
          </RadioGroup>

          {/* Qty, Price, Trigger Price Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="qty">Qty.</Label>
              <Input
                id="qty"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                disabled={orderType === 'Market'}
                step="0.05"
              />
            </div>
            <div className="hidden sm:block">
              <Label htmlFor="trigger_price" className={cn(orderType !== 'SL' && orderType !== 'SL-M' && "text-muted-foreground/50")}>Trigger price</Label>
              <Input
                id="trigger_price"
                type="number"
                value={triggerPrice}
                onChange={(e) => setTriggerPrice(parseFloat(e.target.value) || 0)}
                disabled={orderType !== 'SL' && orderType !== 'SL-M'}
                className={cn(orderType !== 'SL' && orderType !== 'SL-M' && "bg-muted/30 border-dashed placeholder:text-muted-foreground/30")}
                placeholder="0"
              />
            </div>
          </div>
           <div className="sm:hidden mt-4"> {/* Trigger price for small screens if SL/SL-M */}
              <Label htmlFor="trigger_price_sm" className={cn(orderType !== 'SL' && orderType !== 'SL-M' && "text-muted-foreground/50")}>Trigger price</Label>
              <Input
                id="trigger_price_sm"
                type="number"
                value={triggerPrice}
                onChange={(e) => setTriggerPrice(parseFloat(e.target.value) || 0)}
                disabled={orderType !== 'SL' && orderType !== 'SL-M'}
                className={cn(orderType !== 'SL' && orderType !== 'SL-M' && "bg-muted/30 border-dashed placeholder:text-muted-foreground/30")}
                placeholder="0"
              />
            </div>


          {/* Order Type Radio */}
          <RadioGroup
            value={orderType}
            onValueChange={(value) => {
              setOrderType(value);
              if (value === 'Market') setPrice(exchangePrice); // Use selected exchange price
              if (value !== 'SL' && value !== 'SL-M') setTriggerPrice(0);
            }}
            className="flex flex-wrap gap-x-4 gap-y-2"
          >
            {(['Market', 'Limit', 'SL', 'SL-M'] as const).map(type => (
              <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={`orderType-${type}`} />
                <Label htmlFor={`orderType-${type}`} className="font-normal">{type}</Label>
              </div>
            ))}
          </RadioGroup>

            <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs" onClick={() => toast({title: "More Options Clicked"})}>
                More options <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          

          {/* GTT Section */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center space-x-2">
                <Gavel className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">GTT Order</span>
                <span className="text-xs text-muted-foreground">(Good Till Triggered)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                <Checkbox
                    id="gtt_stoploss"
                    checked={isGttStoplossEnabled}
                    onCheckedChange={(checked) => setIsGttStoplossEnabled(!!checked)}
                />
                <Label htmlFor="gtt_stoploss" className="font-normal whitespace-nowrap">Stoploss</Label>
                <Input
                    type="text"
                    placeholder="%"
                    value={gttStoplossValue}
                    onChange={(e) => setGttStoplossValue(e.target.value)}
                    disabled={!isGttStoplossEnabled}
                    className={cn("w-20 h-8 text-xs", !isGttStoplossEnabled && "bg-muted/30 border-dashed")}
                />
                </div>
                <div className="flex items-center space-x-2">
                <Checkbox
                    id="gtt_target"
                    checked={isGttTargetEnabled}
                    onCheckedChange={(checked) => setIsGttTargetEnabled(!!checked)}
                />
                <Label htmlFor="gtt_target" className="font-normal whitespace-nowrap">Target</Label>
                 <Input
                    type="text"
                    placeholder="%"
                    value={gttTargetValue}
                    onChange={(e) => setGttTargetValue(e.target.value)}
                    disabled={!isGttTargetEnabled}
                    className={cn("w-20 h-8 text-xs", !isGttTargetEnabled && "bg-muted/30 border-dashed")}
                />
                </div>
            </div>
             <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs" onClick={() => toast({title: "Learn More GTT Clicked"})}>Learn more</Button>
          </div>

          {/* Footer: Margin & Buttons */}
          <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-sm">
              Margin required <span className="font-semibold text-foreground">₹{calculatedMargin.toFixed(2)}</span>
              <RefreshCcw className="inline h-3 w-3 ml-1 text-primary cursor-pointer" onClick={() => toast({description: "Margin refreshed (mock)"})} />
            </div>
            <div className="flex space-x-3 w-full sm:w-auto">
              <Button onClick={handleBuy} className="flex-1 bg-green-600 hover:bg-green-700 text-white">Buy</Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </TabsContent>
        {/* Placeholder content for other tabs */}
        {['Cover', 'AMO', 'Iceberg'].map(mode => (
            <TabsContent key={mode} value={mode} className="p-4 mt-0 text-center text-muted-foreground">
                <p>{mode} order options will be shown here.</p>
            </TabsContent>
        ))}

      </Tabs>
    </div>
  );
}
