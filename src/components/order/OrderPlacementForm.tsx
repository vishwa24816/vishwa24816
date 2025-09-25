
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Stock, PortfolioHolding } from '@/types';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDown, BarChartHorizontal, ShoppingBasket, BellPlus, Percent, CircleDollarSign } from 'lucide-react';
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { AddToBasketDialog } from './AddToBasketDialog';
import { SipForm } from './SipForm';
import type { InitialOrderDetails } from '@/app/page';

// #region Helper Components
const MarketDepth = ({ asset, onPriceClick }: { asset: Stock; onPriceClick: (price: number) => void; }) => {
    const marketDepthData = useMemo(() => {
        const basePrice = asset.price;
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
    }, [asset.price]);

    return (
        <div className="p-4 border-t">
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
                                onClick={() => onPriceClick(order.price)}
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
                                onClick={() => onPriceClick(order.price)}
                            >
                                <span className="font-medium text-foreground">@{order.price.toFixed(2)}</span>
                                <span className="text-red-700 dark:text-red-400">{order.quantity.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StopLossTakeProfit = ({ idPrefix }: { idPrefix: string }) => {
    const [stopLossEnabled, setStopLossEnabled] = useState(false);
    const [stopLossType, setStopLossType] = useState<'price' | 'percent'>('price');
    const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);
    const [takeProfitType, setTakeProfitType] = useState<'price' | 'percent'>('price');

    return (
        <div className="space-y-4 pt-4 border-t">
            {/* Stop Loss */}
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Checkbox id={`${idPrefix}-sl-enable`} checked={stopLossEnabled} onCheckedChange={(checked) => setStopLossEnabled(!!checked)} />
                    <Label htmlFor={`${idPrefix}-sl-enable`} className="font-medium">Set Stop Loss</Label>
                </div>
                {stopLossEnabled && (
                    <div className="grid grid-cols-[1fr_auto] gap-2 items-center pl-6 animate-accordion-down">
                        <Input type="number" placeholder="Enter stop loss value" />
                        <div className="flex items-center rounded-md bg-muted p-1">
                            <Button variant={stopLossType === 'price' ? 'secondary' : 'ghost'} size="icon" className="h-6 w-6" onClick={() => setStopLossType('price')}><CircleDollarSign className="h-4 w-4" /></Button>
                            <Button variant={stopLossType === 'percent' ? 'secondary' : 'ghost'} size="icon" className="h-6 w-6" onClick={() => setStopLossType('percent')}><Percent className="h-4 w-4" /></Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Take Profit */}
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Checkbox id={`${idPrefix}-tp-enable`} checked={takeProfitEnabled} onCheckedChange={(checked) => setTakeProfitEnabled(!!checked)} />
                    <Label htmlFor={`${idPrefix}-tp-enable`} className="font-medium">Set Take Profit</Label>
                </div>
                {takeProfitEnabled && (
                    <div className="grid grid-cols-[1fr_auto] gap-2 items-center pl-6 animate-accordion-down">
                        <Input type="number" placeholder="Enter take profit value" />
                         <div className="flex items-center rounded-md bg-muted p-1">
                            <Button variant={takeProfitType === 'price' ? 'secondary' : 'ghost'} size="icon" className="h-6 w-6" onClick={() => setTakeProfitType('price')}><CircleDollarSign className="h-4 w-4" /></Button>
                            <Button variant={takeProfitType === 'percent' ? 'secondary' : 'ghost'} size="icon" className="h-6 w-6" onClick={() => setTakeProfitType('percent')}><Percent className="h-4 w-4" /></Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
// #endregion Helper Components


// #region Specialized Form Components
const StockOrderForm = ({ asset, assetType, productType, onProductTypeChange, initialDetails }: any) => {
    const { toast } = useToast();
    const [quantity, setQuantity] = useState<number | string>(initialDetails?.quantity || 1);
    const [price, setPrice] = useState<number | string>(asset?.price?.toFixed(2) || '');
    const [triggerPrice, setTriggerPrice] = useState('');
    const isUsStock = asset.exchange === 'NASDAQ' || asset.exchange === 'NYSE';
    const [selectedExchange, setSelectedExchange] = useState<'BSE' | 'NSE' | 'NASDAQ' | 'NYSE'>(isUsStock ? (asset.exchange || 'NASDAQ') : 'NSE');
    const [orderMode, setOrderMode] = useState('Regular');
    const [orderType, setOrderType] = useState('Limit');
    const [mtfLeverage, setMtfLeverage] = useState('1x');
    const [displayedMargin, setDisplayedMargin] = useState(0);
    const [isAddToBasketDialogOpen, setIsAddToBasketDialogOpen] = useState(false);

    const [lockInYears, setLockInYears] = useState('');
    const [lockInMonths, setLockInMonths] = useState('');

    useEffect(() => {
        const currentPrice = asset.price;
        if (orderType === 'Market') {
            setPrice(currentPrice.toFixed(2));
        } else {
            const currentPriceNum = parseFloat(String(price));
            if(isNaN(currentPriceNum) || currentPriceNum === 0){
                setPrice(currentPrice.toFixed(2));
            }
        }
    }, [selectedExchange, orderType, asset.price, price]);

    useEffect(() => {
        const numQty = parseFloat(String(quantity)) || 0;
        const priceForCalc = orderType === 'Market' ? asset.price : (parseFloat(String(price)) || 0);
        let baseMargin = numQty * priceForCalc;
        if (orderMode === 'MTF') {
            const leverageFactor = parseInt(mtfLeverage.replace('x', ''), 10) || 1;
            if (leverageFactor > 0) baseMargin /= leverageFactor;
        }
        setDisplayedMargin(baseMargin);
    }, [quantity, price, orderType, asset, orderMode, mtfLeverage]);
    
    const handleMarketDepthPriceClick = (clickedPrice: number) => {
        setPrice(clickedPrice.toFixed(2));
        setOrderType('Limit');
    };

    const regularOrderFields = (
      <div className="space-y-4">
            <RadioGroup value={productType} onValueChange={onProductTypeChange} className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
                <div className="flex items-center space-x-2"> <RadioGroupItem value="Intraday" id="intraday-stock" /> <Label htmlFor="intraday-stock" className="font-normal">Intraday</Label> </div>
                <div className="flex items-center space-x-2"> <RadioGroupItem value="Delivery" id="delivery-stock" /> <Label htmlFor="delivery-stock" className="font-normal">Delivery</Label> </div>
                <div className="flex items-center space-x-2"> <RadioGroupItem value="HODL" id="hodl-stock" /> <Label htmlFor="hodl-stock" className="font-normal">HODL</Label> </div>
            </RadioGroup>

            <div className="grid grid-cols-2 gap-4 items-end">
                <div> <Label htmlFor="qty-stock">Qty.</Label> <Input id="qty-stock" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" step="1"/> </div>
                 <div>
                    <Label htmlFor="price-stock">Price</Label>
                    <Input id="price-stock" type="text" value={price} onChange={(e) => setPrice(e.target.value)} disabled={orderType === 'Market'} />
                </div>
            </div>
            
            {productType === 'HODL' && (
                <div className="space-y-2 pt-2 animate-accordion-down">
                    <Label>Lock-in Period</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div> <Label htmlFor="lock-in-years-stock" className="text-xs text-muted-foreground">Years</Label> <Input id="lock-in-years-stock" type="number" placeholder="Years" value={lockInYears} onChange={e => setLockInYears(e.target.value)} min="0" /> </div>
                        <div> <Label htmlFor="lock-in-months-stock" className="text-xs text-muted-foreground">Months</Label> <Input id="lock-in-months-stock" type="number" placeholder="Months" value={lockInMonths} onChange={e => setLockInMonths(e.target.value)} min="0" max="11"/> </div>
                    </div>
                </div>
            )}
            
            <StopLossTakeProfit idPrefix="stock" />

            <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center space-x-2">
                    <Checkbox id="day-order-stock" />
                    <Label htmlFor="day-order-stock" className="font-normal">Day order</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="aon-order-stock" />
                    <Label htmlFor="aon-order-stock" className="font-normal">All or none order</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="ioc-order-stock" />
                    <Label htmlFor="ioc-order-stock" className="font-normal">IOC</Label>
                </div>
            </div>

            <RadioGroup value={orderType} onValueChange={(value) => setOrderType(value)} className="flex flex-wrap gap-x-4 gap-y-2">
                <div className="flex items-center space-x-2"><RadioGroupItem value="Market" id="orderType-market-stock" /><Label htmlFor="orderType-market-stock" className="font-normal">Market</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="Limit" id="orderType-limit-stock" /><Label htmlFor="orderType-limit-stock" className="font-normal">Limit</Label></div>
            </RadioGroup>
        </div>
    );

    return (
        <div className="bg-card shadow-md rounded-lg mt-4">
            <div className="bg-card text-card-foreground p-3 rounded-t-lg border-b">
                <RadioGroup value={selectedExchange} onValueChange={(v) => setSelectedExchange(v as any)} className="flex space-x-4">
                    {isUsStock ? (
                        <>
                            <div className="flex items-center space-x-2"> <RadioGroupItem value="NASDAQ" id="NASDAQ" /> <Label htmlFor="NASDAQ" className="text-sm">NASDAQ: ₹{asset.price.toFixed(2)}</Label> </div>
                            <div className="flex items-center space-x-2"> <RadioGroupItem value="NYSE" id="NYSE" /> <Label htmlFor="NYSE" className="text-sm">NYSE: ₹{asset.price.toFixed(2)}</Label> </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center space-x-2"> <RadioGroupItem value="BSE" id="BSE" /> <Label htmlFor="BSE" className="text-sm">BSE: ₹{asset.price.toFixed(2)}</Label> </div>
                            <div className="flex items-center space-x-2"> <RadioGroupItem value="NSE" id="NSE" /> <Label htmlFor="NSE" className="text-sm">NSE: ₹{asset.price.toFixed(2)}</Label> </div>
                        </>
                    )}
                </RadioGroup>
            </div>
            <Tabs value={orderMode} onValueChange={setOrderMode} className="w-full">
                <TabsList className="w-full justify-start rounded-none bg-transparent border-b p-0">
                    <TabsTrigger value="Regular" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Regular</TabsTrigger>
                    <TabsTrigger value="MTF" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">MTF</TabsTrigger>
                    <TabsTrigger value="SP" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">SP</TabsTrigger>
                </TabsList>
                <TabsContent value="Regular" className="p-4 mt-0">
                    {regularOrderFields}
                    <div className="mt-4 pt-4 border-t"><p className="text-sm text-muted-foreground">Margin required: <span className="font-semibold text-foreground">₹{displayedMargin.toLocaleString('en-IN')}</span></p></div>
                </TabsContent>
                <TabsContent value="MTF" className="p-4 mt-0 space-y-4">
                    {regularOrderFields}
                    <div className="space-y-2 pt-2">
                         <Label>Leverage</Label>
                         <RadioGroup value={mtfLeverage} onValueChange={setMtfLeverage} className="flex flex-wrap gap-x-4 gap-y-2">
                             {['1x', '2x', '3x', '4x'].map(val => ( <div key={val} className="flex items-center space-x-2"> <RadioGroupItem value={val} id={`leverage-${val}-stock`} /> <Label htmlFor={`leverage-${val}-stock`} className="font-normal">{val}</Label> </div> ))}
                         </RadioGroup>
                     </div>
                     <div className="mt-4 pt-4 border-t"><p className="text-sm text-muted-foreground">Margin required: <span className="font-semibold text-foreground">₹{displayedMargin.toLocaleString('en-IN')}</span></p></div>
                </TabsContent>
                <TabsContent value="SP" className="p-0 mt-0"><SipForm asset={asset} assetType="stock" initialDetails={initialDetails} /></TabsContent>
            </Tabs>
            <MarketDepth asset={asset} onPriceClick={handleMarketDepthPriceClick} />
            <div className="p-4 border-t flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsAddToBasketDialogOpen(true)}><ShoppingBasket className="mr-2 h-4 w-4" /> Add to Basket</Button>
                <Button variant="outline" className="flex-1" onClick={() => toast({ title: "Add Alert (WIP)" })}><BellPlus className="mr-2 h-4 w-4" /> Add Alert</Button>
            </div>
             <AddToBasketDialog isOpen={isAddToBasketDialogOpen} onOpenChange={setIsAddToBasketDialogOpen} asset={asset} assetType={assetType} />
        </div>
    );
};

const CryptoOrderForm = ({ asset, assetType, productType, onProductTypeChange, initialDetails, userHoldings }: any) => {
    const [quantity, setQuantity] = useState<number | string>('1');
    const [price, setPrice] = useState<number | string>(asset?.price?.toFixed(2) || '');
    const [orderMode, setOrderMode] = useState('Regular');
    const [orderType, setOrderType] = useState('Limit');
    const [isAddToBasketDialogOpen, setIsAddToBasketDialogOpen] = useState(false);
    const [lockInYears, setLockInYears] = useState('');
    const [lockInMonths, setLockInMonths] = useState('');
    const [baseCurrency, setBaseCurrency] = useState('INR');

    const displayedMargin = useMemo(() => {
        const numQty = parseFloat(String(quantity)) || 0;
        const numPrice = parseFloat(String(price)) || 0;
        
        if (baseCurrency === 'INR') {
            return `₹${(numQty * numPrice).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
        
        const baseAsset = userHoldings.find((h: PortfolioHolding) => h.symbol === baseCurrency);
        if (baseAsset) {
            const totalCostInQuote = numQty * numPrice;
            const margin = totalCostInQuote / baseAsset.ltp;
            return `${margin.toFixed(8)} ${baseCurrency}`;
        }

        return '₹0.00';

    }, [quantity, price, baseCurrency, userHoldings, asset.price]);

    const handleMarketDepthPriceClick = (clickedPrice: number) => {
        setPrice(clickedPrice.toFixed(2));
        setOrderType('Limit');
    };
    
    const availableCurrencies = ['INR', ...userHoldings.map((h: PortfolioHolding) => h.symbol)];

    return (
        <div className="bg-card shadow-md rounded-lg mt-4">
            <Tabs value={orderMode} onValueChange={setOrderMode} className="w-full">
                 <TabsList className="w-full justify-start rounded-none bg-transparent border-b p-0">
                    <TabsTrigger value="Regular" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Regular</TabsTrigger>
                    <TabsTrigger value="SP" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">SP</TabsTrigger>
                </TabsList>
                <TabsContent value="Regular" className="p-4 mt-0">
                    <div className="space-y-4">
                        <RadioGroup value={productType} onValueChange={onProductTypeChange} className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
                           <div className="flex items-center space-x-2"> <RadioGroupItem value="Delivery" id="delivery-crypto" /> <Label htmlFor="delivery-crypto" className="font-normal">Delivery</Label> </div>
                           <div className="flex items-center space-x-2"> <RadioGroupItem value="HODL" id="hodl-crypto" /> <Label htmlFor="hodl-crypto" className="font-normal">HODL</Label> </div>
                        </RadioGroup>
                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div><Label htmlFor="qty-crypto">Qty.</Label><Input id="qty-crypto" type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div>
                            <div><Label htmlFor="price-crypto">Price</Label><Input id="price-crypto" type="text" value={price} onChange={(e) => setPrice(e.target.value)} disabled={orderType === 'Market'} /></div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="base-currency">Pay with</Label>
                            <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                                <SelectTrigger id="base-currency"><SelectValue placeholder="Select currency" /></SelectTrigger>
                                <SelectContent>
                                    {availableCurrencies.map((c) => c && <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        {productType === 'HODL' && (
                            <div className="space-y-2 pt-2 animate-accordion-down">
                                <Label>Lock-in Period</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label htmlFor="lock-in-years-crypto" className="text-xs text-muted-foreground">Years</Label><Input id="lock-in-years-crypto" type="number" placeholder="Years" value={lockInYears} onChange={e => setLockInYears(e.target.value)} min="0" /></div>
                                    <div><Label htmlFor="lock-in-months-crypto" className="text-xs text-muted-foreground">Months</Label><Input id="lock-in-months-crypto" type="number" placeholder="Months" value={lockInMonths} onChange={e => setLockInMonths(e.target.value)} min="0" max="11"/></div>
                                </div>
                            </div>
                        )}
                        <StopLossTakeProfit idPrefix="crypto" />
                        <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="day-order-crypto" />
                                <Label htmlFor="day-order-crypto" className="font-normal">Day order</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="aon-order-crypto" />
                                <Label htmlFor="aon-order-crypto" className="font-normal">All or none order</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="ioc-order-crypto" />
                                <Label htmlFor="ioc-order-crypto" className="font-normal">IOC</Label>
                            </div>
                        </div>
                        <RadioGroup value={orderType} onValueChange={(value) => setOrderType(value)} className="flex flex-wrap gap-x-4 gap-y-2">
                           <div className="flex items-center space-x-2"><RadioGroupItem value="Market" id="orderType-market-crypto" /><Label htmlFor="orderType-market-crypto" className="font-normal">Market</Label></div>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="Limit" id="orderType-limit-crypto" /><Label htmlFor="orderType-limit-crypto" className="font-normal">Limit</Label></div>
                        </RadioGroup>
                    </div>
                    <div className="mt-4 pt-4 border-t"><p className="text-sm text-muted-foreground">Margin required: <span className="font-semibold text-foreground">{displayedMargin}</span></p></div>
                </TabsContent>
                <TabsContent value="SP" className="p-0 mt-0"><SipForm asset={asset} assetType="crypto" initialDetails={initialDetails} /></TabsContent>
            </Tabs>
            <MarketDepth asset={asset} onPriceClick={handleMarketDepthPriceClick} />
             <div className="p-4 border-t flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsAddToBasketDialogOpen(true)}><ShoppingBasket className="mr-2 h-4 w-4" /> Add to Basket</Button>
                <Button variant="outline" className="flex-1" onClick={() => {}}><BellPlus className="mr-2 h-4 w-4" /> Add Alert</Button>
            </div>
             <AddToBasketDialog isOpen={isAddToBasketDialogOpen} onOpenChange={setIsAddToBasketDialogOpen} asset={asset} assetType={assetType} />
        </div>
    );
};

const FutureOrderForm = ({ asset, assetType, productType, onProductTypeChange, initialDetails }: any) => {
    const { toast } = useToast();
    const [quantity, setQuantity] = useState<number | string>(1);
    const [price, setPrice] = useState<number | string>(asset?.price?.toFixed(2) || '');
    const [orderType, setOrderType] = useState('Limit');
    const [selectedExpiryDate, setSelectedExpiryDate] = useState<string>('');
    const [displayedMargin, setDisplayedMargin] = useState(0);
    const [isAddToBasketDialogOpen, setIsAddToBasketDialogOpen] = useState(false);

    useEffect(() => {
        if (asset.availableExpiries && asset.availableExpiries.length > 0) {
          setSelectedExpiryDate(asset.availableExpiries[0]);
        }
    }, [asset.availableExpiries]);

    useEffect(() => {
        const numQty = parseFloat(String(quantity)) || 0;
        const numPrice = parseFloat(String(price)) || 0;
        const margin = numQty * numPrice * (asset.lotSize || 1) * (asset.marginFactor || 0.1);
        setDisplayedMargin(margin);
    }, [quantity, price, asset]);

    const handleMarketDepthPriceClick = (clickedPrice: number) => {
        setPrice(clickedPrice.toFixed(2));
        setOrderType('Limit');
    };

    return (
        <div className="bg-card shadow-md rounded-lg mt-4">
            <div className="p-4 space-y-4">
                {asset.availableExpiries && asset.availableExpiries.length > 0 && (
                    <div className="space-y-2">
                        <Label htmlFor="expiry-future">Expiry Date</Label>
                        <Select value={selectedExpiryDate} onValueChange={setSelectedExpiryDate}>
                            <SelectTrigger id="expiry-future"><SelectValue placeholder="Select expiry" /></SelectTrigger>
                            <SelectContent>{asset.availableExpiries.map((e: string) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                )}
                 <RadioGroup value={productType} onValueChange={onProductTypeChange} className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
                    <div className="flex items-center space-x-2"> <RadioGroupItem value="Intraday" id="intraday-future" /><Label htmlFor="intraday-future" className="font-normal">Intraday</Label></div>
                    <div className="flex items-center space-x-2"> <RadioGroupItem value="Expiry" id="overnight-future" /><Label htmlFor="overnight-future" className="font-normal">Expiry</Label></div>
                </RadioGroup>

                <div className="grid grid-cols-2 gap-4 items-end">
                    <div><Label htmlFor="qty-future">Lots</Label><Input id="qty-future" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" step="1"/></div>
                    <div><Label htmlFor="price-future">Price</Label><Input id="price-future" type="text" value={price} onChange={e => setPrice(e.target.value)} disabled={orderType === 'Market'} /></div>
                </div>

                <StopLossTakeProfit idPrefix="future" />

                <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="day-order-future" />
                        <Label htmlFor="day-order-future" className="font-normal">Day order</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="aon-order-future" />
                        <Label htmlFor="aon-order-future" className="font-normal">All or none order</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="ioc-order-future" />
                        <Label htmlFor="ioc-order-future" className="font-normal">IOC</Label>
                    </div>
                </div>

                 <RadioGroup value={orderType} onValueChange={(value) => setOrderType(value)} className="flex flex-wrap gap-x-4 gap-y-2">
                   <div className="flex items-center space-x-2"><RadioGroupItem value="Market" id="orderType-market-future" /><Label htmlFor="orderType-market-future" className="font-normal">Market</Label></div>
                   <div className="flex items-center space-x-2"><RadioGroupItem value="Limit" id="orderType-limit-future" /><Label htmlFor="orderType-limit-future" className="font-normal">Limit</Label></div>
                </RadioGroup>
                
                 <div className="mt-4 pt-4 border-t"><p className="text-sm text-muted-foreground">Margin required: <span className="font-semibold text-foreground">₹{displayedMargin.toLocaleString('en-IN')}</span></p></div>
            </div>
            <MarketDepth asset={asset} onPriceClick={handleMarketDepthPriceClick} />
             <div className="p-4 border-t flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsAddToBasketDialogOpen(true)}><ShoppingBasket className="mr-2 h-4 w-4" /> Add to Basket</Button>
                <Button variant="outline" className="flex-1" onClick={() => toast({ title: "Add Alert (WIP)" })}><BellPlus className="mr-2 h-4 w-4" /> Add Alert</Button>
            </div>
            <AddToBasketDialog isOpen={isAddToBasketDialogOpen} onOpenChange={setIsAddToBasketDialogOpen} asset={asset} assetType={assetType} />
        </div>
    );
};

const CryptoFutureOrderForm = ({ asset, assetType, productType, onProductTypeChange, initialDetails }: any) => {
    const { toast } = useToast();
    const [quantity, setQuantity] = useState<number | string>('1');
    const [price, setPrice] = useState<number | string>(asset?.price?.toFixed(2) || '');
    const [orderMode, setOrderMode] = useState('MTF');
    const [orderType, setOrderType] = useState('Limit');
    const [mtfLeverage, setMtfLeverage] = useState('1x');
    const [displayedMargin, setDisplayedMargin] = useState(0);
    const [isAddToBasketDialogOpen, setIsAddToBasketDialogOpen] = useState(false);

    useEffect(() => {
        const leverageFactor = parseInt(mtfLeverage.replace('x', ''), 10) || 1;
        const numQty = parseFloat(String(quantity)) || 0;
        const numPrice = parseFloat(String(price)) || 0;
        const margin = (numQty * numPrice * (asset.lotSize || 1)) / leverageFactor;
        setDisplayedMargin(margin);
    }, [quantity, price, asset, mtfLeverage]);

    const handleMarketDepthPriceClick = (clickedPrice: number) => {
        setPrice(clickedPrice.toFixed(2));
        setOrderType('Limit');
    };

    const leverageOptions = ['1x', '2x', '3x', '4x', '5x', '10x', '20x', '25x', '50x', '100x', '200x'];

    return (
         <div className="bg-card shadow-md rounded-lg mt-4">
            <Tabs value={orderMode} onValueChange={setOrderMode} className="w-full">
                 <TabsList className="w-full justify-start rounded-none bg-transparent border-b p-0">
                    <TabsTrigger value="MTF" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Trade</TabsTrigger>
                    <TabsTrigger value="SP" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">SP</TabsTrigger>
                </TabsList>
                 <TabsContent value="MTF" className="p-4 mt-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4 items-end">
                        <div><Label htmlFor="qty-cf">Qty.</Label><Input id="qty-cf" type="text" value={quantity} onChange={e => setQuantity(e.target.value)}/></div>
                        <div><Label htmlFor="price-cf">Price</Label><Input id="price-cf" type="text" value={price} onChange={e => setPrice(e.target.value)} disabled={orderType === 'Market'} /></div>
                    </div>
                     <RadioGroup value={orderType} onValueChange={(value) => setOrderType(value)} className="flex flex-wrap gap-x-4 gap-y-2">
                       <div className="flex items-center space-x-2"><RadioGroupItem value="Market" id="orderType-market-cf" /><Label htmlFor="orderType-market-cf" className="font-normal">Market</Label></div>
                       <div className="flex items-center space-x-2"><RadioGroupItem value="Limit" id="orderType-limit-cf" /><Label htmlFor="orderType-limit-cf" className="font-normal">Limit</Label></div>
                    </RadioGroup>
                    <StopLossTakeProfit idPrefix="cf" />
                     <div className="space-y-2 pt-2">
                        <Label htmlFor="leverage-cf">Leverage</Label>
                        <Select value={mtfLeverage} onValueChange={setMtfLeverage}>
                            <SelectTrigger id="leverage-cf" className="w-full sm:w-[180px]"><SelectValue placeholder="Select leverage" /></SelectTrigger>
                            <SelectContent>{leverageOptions.map(val => <SelectItem key={val} value={val}>{val}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div className="mt-4 pt-4 border-t"><p className="text-sm text-muted-foreground">Margin required: <span className="font-semibold text-foreground">₹{displayedMargin.toLocaleString('en-IN')}</span></p></div>
                 </TabsContent>
                 <TabsContent value="SP" className="p-0 mt-0"><SipForm asset={asset} assetType="crypto-future" initialDetails={initialDetails} /></TabsContent>
            </Tabs>
            <MarketDepth asset={asset} onPriceClick={handleMarketDepthPriceClick} />
             <div className="p-4 border-t flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsAddToBasketDialogOpen(true)}><ShoppingBasket className="mr-2 h-4 w-4" /> Add to Basket</Button>
                <Button variant="outline" className="flex-1" onClick={() => toast({ title: "Add Alert (WIP)" })}><BellPlus className="mr-2 h-4 w-4" /> Add Alert</Button>
            </div>
            <AddToBasketDialog isOpen={isAddToBasketDialogOpen} onOpenChange={setIsAddToBasketDialogOpen} asset={asset} assetType={assetType} />
        </div>
    );
};
// #endregion

// #region Main Dispatcher Component

interface OrderPlacementFormProps {
  asset: Stock;
  assetType: "stock" | "future" | "option" | "crypto" | "mutual-fund" | "bond" | "crypto-future" | "crypto-option";
  productType: string;
  onProductTypeChange: (value: string) => void;
  initialDetails?: InitialOrderDetails | null;
  userHoldings?: PortfolioHolding[];
}

export function OrderPlacementForm({ assetType, ...props }: OrderPlacementFormProps) {
  switch (assetType) {
    case 'stock':
      return <StockOrderForm assetType={assetType} {...props} />;
    case 'crypto':
      return <CryptoOrderForm assetType={assetType} {...props} />;
    case 'future':
    case 'option':
      return <FutureOrderForm assetType={assetType} {...props} />;
    case 'crypto-future':
    case 'crypto-option':
        return <CryptoFutureOrderForm assetType={assetType} {...props} />;
    case 'mutual-fund':
    case 'bond':
        return <CryptoOrderForm assetType={assetType} {...props} />;
    default:
      return <div className="p-4 text-center text-muted-foreground">Order placement not available for this asset type.</div>;
  }
}

// #endregion

    