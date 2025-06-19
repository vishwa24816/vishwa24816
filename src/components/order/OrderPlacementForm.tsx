
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Stock } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCcw,ChevronDown, BarChartHorizontal, ShoppingBasket, BellPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { AddToBasketDialog } from './AddToBasketDialog'; // Import the new dialog

interface OrderPlacementFormProps {
  asset: Stock;
  assetType: "stock" | "future" | "option" | "crypto" | "mutual-fund" | "bond";
  productType: string;
  onProductTypeChange: (value: string) => void;
}

export function OrderPlacementForm({ asset, assetType, productType, onProductTypeChange }: OrderPlacementFormProps) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1); // For stocks/crypto: units; For futures/options: lots
  const [price, setPrice] = useState(asset.price);
  const [triggerPrice, setTriggerPrice] = useState(0);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState<string>('');


  const [selectedExchange, setSelectedExchange] = useState<'BSE' | 'NSE'>('NSE');
  const [orderMode, setOrderMode] = useState('Regular');
  const [orderType, setOrderType] = useState('Limit'); // Market, Limit, SL, SL-M

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [enableStopLoss, setEnableStopLoss] = useState(false);
  const [stopLossInputValue, setStopLossInputValue] = useState('');
  const [stopLossType, setStopLossType] = useState<'price' | 'percentage'>('price');
  const [enableTakeProfit, setEnableTakeProfit] = useState(false);
  const [takeProfitInputValue, setTakeProfitInputValue] = useState('');
  const [takeProfitType, setTakeProfitType] = useState<'price' | 'percentage'>('price');

  const [mtfLeverage, setMtfLeverage] = useState('1x');
  const [displayedMargin, setDisplayedMargin] = useState(0);
  const [isAddToBasketDialogOpen, setIsAddToBasketDialogOpen] = useState(false);


  const marketDepthData = useMemo(() => {
    if (assetType !== "stock") return null;
    
    const basePrice = selectedExchange === 'NSE' ? asset.price : asset.price * 0.995;

    const buy = Array.from({ length: 5 }, (_, i) => ({
      quantity: Math.floor(Math.random() * 200 + 50),
      price: parseFloat((basePrice - (0.05 * (i + 1) * (Math.random() * 0.1 + 0.95))).toFixed(2)),
    }));
    const sell = Array.from({ length: 5 }, (_, i) => ({
      price: parseFloat((basePrice + (0.05 * (i + 1) * (Math.random() * 0.1 + 0.95))).toFixed(2)),
      quantity: Math.floor(Math.random() * 200 + 50),
    }));
    return {
      buy,
      sell,
      totalBuyQty: buy.reduce((sum, order) => sum + order.quantity, 0),
      totalSellQty: sell.reduce((sum, order) => sum + order.quantity, 0),
    };
  }, [asset.price, assetType, selectedExchange]);


  useEffect(() => {
    let currentPrice = asset.price;
    if (assetType === 'stock' && selectedExchange === 'BSE') {
      currentPrice = asset.price * 0.995;
    }

    if (orderType === 'Market') {
      setPrice(currentPrice);
    } else {
      // If not market, keep the user-set price or initialize with current market price
      // This ensures that if user was typing a limit price, it's not overwritten
      // unless it's the initial load or exchange change for market order type
      if (price === asset.price || (assetType === 'stock' && price === asset.price * 0.995) || price === 0 ) {
         setPrice(currentPrice);
      }
    }

    if (assetType === 'future' && asset.availableExpiries && asset.availableExpiries.length > 0) {
      setSelectedExpiryDate(asset.availableExpiries[0]);
    } else {
      setSelectedExpiryDate('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, assetType, selectedExchange, orderType]); // price removed from deps to avoid overriding user input

  useEffect(() => {
    let priceForCalc = 0;
    let currentAssetPrice = asset.price;
    if (assetType === 'stock' && selectedExchange === 'BSE') {
        currentAssetPrice = asset.price * 0.995;
    }

    if (orderType === 'Market') {
      priceForCalc = currentAssetPrice;
    } else {
      priceForCalc = price; 
    }

    let baseMargin = 0;

    if (assetType === 'future') {
      const lotSize = asset.lotSize || 1;
      const marginFactor = asset.marginFactor || 0.1; // Default margin factor if not provided
      baseMargin = quantity * priceForCalc * lotSize * marginFactor;
    } else { // For stocks, crypto, mutual funds, bonds
      baseMargin = quantity * priceForCalc;
    }


    if (orderMode === 'MTF' && assetType === 'stock') {
      const leverageFactor = parseInt(mtfLeverage.replace('x', ''), 10) || 1;
      if (leverageFactor > 0) {
        baseMargin = baseMargin / leverageFactor;
      }
    }

    setDisplayedMargin(baseMargin);
  }, [quantity, price, orderType, asset.price, asset.lotSize, asset.marginFactor, orderMode, mtfLeverage, productType, selectedExchange, assetType]);


  const handleOrderAction = (action: 'BUY' | 'SELL') => {
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
    if (orderMode === 'MTF' && assetType === 'stock') {
        leverageInfo = `Leverage: ${mtfLeverage}`;
    }
    const expiryInfo = assetType === 'future' && selectedExpiryDate ? `Expiry: ${selectedExpiryDate}` : '';

    const quantityLabel = assetType === 'future' ? 'Lots' : 'Qty.';
    const priceDisplay = orderType === 'Market' ? 'Market' : `₹${price}`;

    toast({
      title: `Order Action (Mock - ${orderMode})`,
      description: `${action} ${quantity} ${quantityLabel} x ${asset.symbol} ${expiryInfo} @ ${priceDisplay} (${productType}) ${advancedOptions ? `(${advancedOptions})` : ''} ${leverageInfo}`,
    });
  };

  const handleMarketDepthPriceClick = (clickedPrice: number) => {
    setPrice(clickedPrice);
    setOrderType('Limit'); 
  };

  const orderModeTabs = assetType === 'stock' ? ['Regular', 'MTF', 'SIP'] : ['Regular', 'SIP'];
  const quantityInputLabel = (assetType === 'future' || assetType === 'option') ? 'Lots' : 'Qty.';

  const renderOrderFields = (currentOrderMode: string) => (
    <>
      {(assetType === 'future' || assetType === 'option') && asset.availableExpiries && asset.availableExpiries.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor={`expiry-${currentOrderMode}`}>Expiry Date</Label>
          <Select value={selectedExpiryDate} onValueChange={setSelectedExpiryDate}>
            <SelectTrigger id={`expiry-${currentOrderMode}`} className="w-full">
              <SelectValue placeholder="Select expiry" />
            </SelectTrigger>
            <SelectContent>
              {asset.availableExpiries.map(expiry => (
                <SelectItem key={expiry} value={expiry}>{expiry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <RadioGroup
        value={productType}
        onValueChange={onProductTypeChange}
        className="flex space-x-6"
      >
        {(assetType === 'stock' || assetType === 'future' || assetType === 'option') && (
            <div className="flex items-center space-x-2">
            <RadioGroupItem value="Intraday" id={`intraday-${currentOrderMode}`} />
            <Label htmlFor={`intraday-${currentOrderMode}`} className="font-normal">Intraday <span className="text-muted-foreground text-xs">MIS</span></Label>
            </div>
        )}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Longterm" id={`longterm-${currentOrderMode}`} />
          <Label htmlFor={`longterm-${currentOrderMode}`} className="font-normal">Longterm <span className="text-muted-foreground text-xs">{(assetType === 'future' || assetType === 'option') ? 'NRML' : 'CNC'}</span></Label>
        </div>
      </RadioGroup>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-end">
        <div>
          <Label htmlFor={`qty-${currentOrderMode}`}>{quantityInputLabel}</Label>
          <Input
            id={`qty-${currentOrderMode}`}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
          />
           {(assetType === 'future' || assetType === 'option') && asset.lotSize && (
            <p className="text-xs text-muted-foreground mt-1">Lot Size: {asset.lotSize}</p>
          )}
        </div>
        <div>
          <Label htmlFor={`price-${currentOrderMode}`}>Price</Label>
          <Input
            id={`price-${currentOrderMode}`}
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            disabled={orderType === 'Market' && assetType !== 'mutual-fund'}
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
          if (value === 'Market') {
             const marketPrice = assetType === 'stock'
                ? (selectedExchange === 'NSE' ? asset.price : (asset.price * 0.995))
                : asset.price;
             setPrice(marketPrice);
          }
          if (value !== 'SL' && value !== 'SL-M') setTriggerPrice(0);
        }}
        className="flex flex-wrap gap-x-4 gap-y-2"
      >
        {(['Market', 'Limit', 'SL', 'SL-M'] as const).map(type => {
            if ((assetType === 'mutual-fund' || assetType === 'bond') && (type === 'SL' || type === 'SL-M')) return null;
            if (assetType === 'mutual-fund' && type === 'Limit') return null;

           return (
            <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={`orderType-${type}-${currentOrderMode}`} />
                <Label htmlFor={`orderType-${type}-${currentOrderMode}`} className="font-normal">{type}</Label>
            </div>
           );
        })}
      </RadioGroup>

      {(currentOrderMode === 'MTF' && assetType === 'stock') && (
        <div className="space-y-2 pt-2">
            <Label>Leverage</Label>
            <RadioGroup
                value={mtfLeverage}
                onValueChange={setMtfLeverage}
                className="flex flex-wrap gap-x-4 gap-y-2"
            >
            {['1x', '2x', '3x', '4x'].map(val => (
                <div key={val} className="flex items-center space-x-2">
                <RadioGroupItem value={val} id={`leverage-${val}-${currentOrderMode}`} />
                <Label htmlFor={`leverage-${val}-${currentOrderMode}`} className="font-normal">{val}</Label>
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
       <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Margin required: <span className="font-semibold text-foreground">₹{displayedMargin.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </p>
          {(currentOrderMode === 'MTF' && assetType === 'stock' && parseInt(mtfLeverage.replace('x','')) > 1) && (
              <p className="text-xs text-muted-foreground mt-1">
                  (Leverage of {mtfLeverage} applied)
              </p>
          )}
        </div>

        {assetType === 'stock' && marketDepthData && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <BarChartHorizontal className="h-5 w-5 mr-2 text-primary" />
              Market Depth
            </h3>
            <div className="grid grid-cols-2 gap-x-4 text-sm">
              <div>
                <div className="flex justify-between font-semibold mb-2 text-green-600">
                  <span>Buy Orders</span>
                  <span>Total: {marketDepthData.totalBuyQty.toLocaleString()}</span>
                </div>
                <div className="space-y-1.5">
                  {marketDepthData.buy.map((order, index) => (
                    <div 
                        key={`buy-${index}`} 
                        className="flex justify-between p-2 rounded bg-green-500/10 cursor-pointer hover:bg-green-500/20 transition-colors"
                        onClick={() => handleMarketDepthPriceClick(order.price)}
                    >
                      <span className="text-green-700 dark:text-green-400">{order.quantity.toLocaleString()}</span>
                      <span className="font-medium text-foreground">@{order.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between font-semibold mb-2 text-red-600">
                  <span>Sell Orders</span>
                  <span>Total: {marketDepthData.totalSellQty.toLocaleString()}</span>
                </div>
                <div className="space-y-1.5">
                  {marketDepthData.sell.map((order, index) => (
                     <div 
                        key={`sell-${index}`} 
                        className="flex justify-between p-2 rounded bg-red-500/10 cursor-pointer hover:bg-red-500/20 transition-colors"
                        onClick={() => handleMarketDepthPriceClick(order.price)}
                    >
                       <span className="font-medium text-foreground">@{order.price.toFixed(2)}</span>
                       <span className="text-red-700 dark:text-red-400">{order.quantity.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-2">
                <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setIsAddToBasketDialogOpen(true)}
                >
                    <ShoppingBasket className="mr-2 h-4 w-4" /> Add to Basket
                </Button>
                <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => toast({ title: "Add Alert (Feature Coming Soon)", description: `You can set price alerts for ${asset.symbol}.`})}
                >
                    <BellPlus className="mr-2 h-4 w-4" /> Add Alert
                </Button>
            </div>
          </div>
        )}
    </>
  );

  return (
    <>
    <div className="bg-card shadow-md rounded-lg mt-4">
      {assetType === 'stock' && (
        <div className="bg-card text-card-foreground p-3 rounded-t-lg border-b">
            <RadioGroup
            value={selectedExchange}
            onValueChange={(value) => {
              const newExchange = value as 'BSE' | 'NSE';
              setSelectedExchange(newExchange);
              if (orderType === 'Market' && assetType === 'stock') {
                const marketPrice = newExchange === 'NSE' ? asset.price : (asset.price * 0.995); // Mock BSE price
                setPrice(marketPrice);
              }
            }}
            className="flex space-x-4"
            >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="BSE" id="BSE" className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="BSE" className="text-sm text-card-foreground">BSE: ₹{(asset.price * 0.995).toFixed(2)}</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="NSE" id="NSE" className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="NSE" className="text-sm text-card-foreground">NSE: ₹{asset.price.toFixed(2)}</Label>
            </div>
            </RadioGroup>
        </div>
      )}

      {assetType !== 'future' ? (
        <Tabs value={orderMode} onValueChange={setOrderMode} className="w-full">
          <div className="flex justify-between items-center border-b px-1">
              <TabsList className="bg-transparent p-0 justify-start">
              {orderModeTabs.map((mode) => (
                  <TabsTrigger
                  key={mode}
                  value={mode}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-2.5 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none text-muted-foreground hover:text-primary"
                  disabled={mode === 'MTF' && assetType !== 'stock'}
                  >
                  {mode}
                  </TabsTrigger>
              ))}
              </TabsList>
          </div>

          <TabsContent value="Regular" className="p-4 space-y-4 mt-0">
            {renderOrderFields("Regular")}
          </TabsContent>

          {assetType === 'stock' && (
          <TabsContent value="MTF" className="p-4 space-y-4 mt-0">
              {renderOrderFields("MTF")}
          </TabsContent>
          )}

          <TabsContent value="SIP" className="p-4 mt-0 text-center text-muted-foreground">
              <p className="mb-4 pt-4">SIP order options will be shown here.</p>
              {assetType === 'mutual-fund' && (
                  <Button>Start SIP</Button>
              )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="p-4 space-y-4 mt-0">
          {renderOrderFields("Regular")}
        </div>
      )}
    </div>
    <AddToBasketDialog 
        isOpen={isAddToBasketDialogOpen}
        onOpenChange={setIsAddToBasketDialogOpen}
        asset={asset}
        assetType={assetType}
    />
    </>
  );
}

