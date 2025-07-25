
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDown, BarChartHorizontal, ShoppingBasket, BellPlus } from 'lucide-react';
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { AddToBasketDialog } from './AddToBasketDialog';
import { SipForm } from './SipForm';

// #region Helper Components

const AdvancedOptionInput = ({
  label,
  id,
  isEnabled,
  onToggle,
  value,
  onValueChange,
  unit,
  onUnitChange,
}: {
  label: string;
  id: string;
  isEnabled: boolean;
  onToggle: (checked: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
  unit: 'price' | 'percent';
  onUnitChange: (unit: 'price' | 'percent') => void;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id={`${id}-check`} checked={isEnabled} onCheckedChange={onToggle} />
        <Label htmlFor={`${id}-check`} className="font-normal">{label}</Label>
      </div>
      {isEnabled && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 items-center">
          <Input
            id={id}
            type="number"
            placeholder="0"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            className="w-full"
          />
          <div className="flex">
            <Button
              type="button"
              variant={unit === 'price' ? 'secondary' : 'ghost'}
              onClick={() => onUnitChange('price')}
              className="h-9 rounded-r-none flex-1 text-xs px-2"
            >
              ₹
            </Button>
            <Button
              type="button"
              variant={unit === 'percent' ? 'secondary' : 'ghost'}
              onClick={() => onUnitChange('percent')}
              className="h-9 rounded-l-none flex-1 text-xs px-2"
            >
              %
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const MarketDepth = ({ asset, selectedExchange, onPriceClick }: { asset: Stock; selectedExchange?: 'BSE' | 'NSE' | 'NASDAQ' | 'NYSE'; onPriceClick: (price: number) => void; }) => {
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
    }, [asset.price, selectedExchange]);

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


// #endregion Helper Components

// #region Common Logic Hooks and Functions

const CommonOrderFields = ({
    orderProps,
    orderMode,
}: {
    orderProps: any,
    orderMode: string,
}) => {
    const {
        asset, assetType, productType, onProductTypeChange, quantity, setQuantity,
        price, setPrice, orderType, setOrderType,
        showMoreOptions, setShowMoreOptions,
        isStopLossEnabled, setIsStopLossEnabled, stopLossValue, setStopLossValue, stopLossUnit, setStopLossUnit,
        isTrailingSlEnabled, setIsTrailingSlEnabled, trailingSlValue, setTrailingSlValue, trailingSlUnit, setTrailingSlUnit,
        isTargetProfitEnabled, setIsTargetProfitEnabled, targetProfitValue, setTargetProfitValue, targetProfitUnit, setTargetProfitUnit,
        lockInMonths, setLockInMonths, lockInYears, setLockInYears
    } = orderProps;

    const quantityInputLabel = (assetType === 'future' || assetType === 'crypto-future' || assetType === 'option') ? 'Lots' : 'Qty.';
    const isCrypto = assetType === 'crypto' || assetType === 'crypto-future';
    const isDerivatives = assetType === 'future' || assetType === 'option' || assetType === 'crypto-future';

    return (
        <div className="space-y-4">
             <RadioGroup value={productType} onValueChange={onProductTypeChange} className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
                {(assetType === 'stock' || isDerivatives) && (
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Intraday" id={`intraday-common`} />
                        <Label htmlFor={`intraday-common`} className="font-normal">Intraday</Label>
                    </div>
                )}
                {assetType !== 'option' && (
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Delivery" id={`delivery-common`} />
                      <Label htmlFor={`delivery-common`} className="font-normal">{isDerivatives ? 'Overnight' : 'Delivery'}</Label>
                  </div>
                )}
                {(assetType === 'stock' || assetType === 'crypto') && orderMode === 'Regular' && (
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="HODL" id="hodl-common" />
                        <Label htmlFor="hodl-common" className="font-normal">HODL</Label>
                    </div>
                )}
            </RadioGroup>

            <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                    <Label htmlFor={`qty-common`}>{quantityInputLabel}</Label>
                    <Input
                        id={`qty-common`}
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        onBlur={(e) => {
                             const numValue = parseFloat(e.target.value);
                             if (isCrypto) {
                                if (isNaN(numValue) || numValue < 0) setQuantity('0');
                                else setQuantity(String(numValue));
                             } else {
                                if (isNaN(numValue) || numValue < 1) setQuantity('1');
                                else setQuantity(String(Math.round(numValue)));
                             }
                        }}
                    />
                    {(assetType === 'future' || assetType === 'crypto-future' || assetType === 'option') && asset.lotSize && (
                        <p className="text-xs text-muted-foreground mt-1">Lot Size: {asset.lotSize}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor={`price-common`}>Price</Label>
                    <Input id={`price-common`} type="text" value={price} onChange={(e) => setPrice(e.target.value)} disabled={orderType === 'Market'} />
                </div>
            </div>

            {productType === 'HODL' && (
                <div className="space-y-2 pt-2 animate-accordion-down">
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
            )}

            <RadioGroup value={orderType} onValueChange={(value) => setOrderType(value)} className="flex flex-wrap gap-x-4 gap-y-2">
                {(['Market', 'Limit'] as const).map(type => (
                    <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={`orderType-${type}-common`} />
                        <Label htmlFor={`orderType-${type}-common`} className="font-normal">{type}</Label>
                    </div>
                ))}
            </RadioGroup>

            <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs flex items-center" onClick={() => setShowMoreOptions(!showMoreOptions)}>
                More options <ChevronDown className={cn("h-3 w-3 ml-0.5 transition-transform duration-200", showMoreOptions && "rotate-180")} />
            </Button>
            
            {showMoreOptions && (
              <div className="space-y-4 pt-4 border-t border-dashed animate-accordion-down">
                <AdvancedOptionInput
                  label="Stop Loss"
                  id="stop-loss"
                  isEnabled={isStopLossEnabled}
                  onToggle={setIsStopLossEnabled}
                  value={stopLossValue}
                  onValueChange={setStopLossValue}
                  unit={stopLossUnit}
                  onUnitChange={setStopLossUnit}
                />
                <AdvancedOptionInput
                  label="Trailing Stop Loss"
                  id="trailing-sl"
                  isEnabled={isTrailingSlEnabled}
                  onToggle={setIsTrailingSlEnabled}
                  value={trailingSlValue}
                  onValueChange={setTrailingSlValue}
                  unit={trailingSlUnit}
                  onUnitChange={setTrailingSlUnit}
                />
                <AdvancedOptionInput
                  label="Target Profit"
                  id="target-profit"
                  isEnabled={isTargetProfitEnabled}
                  onToggle={setIsTargetProfitEnabled}
                  value={targetProfitValue}
                  onValueChange={setTargetProfitValue}
                  unit={targetProfitUnit}
                  onUnitChange={setTargetProfitUnit}
                />
              </div>
            )}
        </div>
    );
};


// #endregion

// #region Specialized Form Components

const StockOrderForm = ({ asset, assetType, productType, onProductTypeChange }: any) => {
    const { toast } = useToast();
    const [quantity, setQuantity] = useState<number | string>(1);
    const [price, setPrice] = useState<number | string>(asset.price.toFixed(2));
    const isUsStock = asset.exchange === 'NASDAQ' || asset.exchange === 'NYSE';
    const [selectedExchange, setSelectedExchange] = useState<'BSE' | 'NSE' | 'NASDAQ' | 'NYSE'>(isUsStock ? (asset.exchange || 'NASDAQ') : 'NSE');
    const [orderMode, setOrderMode] = useState('Regular');
    const [orderType, setOrderType] = useState('Limit');
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [mtfLeverage, setMtfLeverage] = useState('1x');
    const [displayedMargin, setDisplayedMargin] = useState(0);
    const [isAddToBasketDialogOpen, setIsAddToBasketDialogOpen] = useState(false);

    // HODL state
    const [lockInYears, setLockInYears] = useState('');
    const [lockInMonths, setLockInMonths] = useState('');

    // Advanced options state
    const [isStopLossEnabled, setIsStopLossEnabled] = useState(false);
    const [stopLossValue, setStopLossValue] = useState('');
    const [stopLossUnit, setStopLossUnit] = useState<'price' | 'percent'>('price');
    const [isTrailingSlEnabled, setIsTrailingSlEnabled] = useState(false);
    const [trailingSlValue, setTrailingSlValue] = useState('');
    const [trailingSlUnit, setTrailingSlUnit] = useState<'price' | 'percent'>('price');
    const [isTargetProfitEnabled, setIsTargetProfitEnabled] = useState(false);
    const [targetProfitValue, setTargetProfitValue] = useState('');
    const [targetProfitUnit, setTargetProfitUnit] = useState<'price' | 'percent'>('price');

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
    }, [quantity, price, orderType, asset, orderMode, mtfLeverage, productType, selectedExchange]);
    
    const handleMarketDepthPriceClick = (clickedPrice: number) => {
        setPrice(clickedPrice.toFixed(2));
        setOrderType('Limit');
    };

    const commonOrderProps = {
        asset, assetType, productType, onProductTypeChange, quantity, setQuantity,
        price, setPrice, orderType, setOrderType,
        showMoreOptions, setShowMoreOptions,
        isStopLossEnabled, setIsStopLossEnabled, stopLossValue, setStopLossValue, stopLossUnit, setStopLossUnit,
        isTrailingSlEnabled, setIsTrailingSlEnabled, trailingSlValue, setTrailingSlValue, trailingSlUnit, setTrailingSlUnit,
        isTargetProfitEnabled, setIsTargetProfitEnabled, targetProfitValue, setTargetProfitValue, targetProfitUnit, setTargetProfitUnit,
        lockInMonths, setLockInMonths, lockInYears, setLockInYears,
    };

    return (
        <div className="bg-card shadow-md rounded-lg mt-4">
            <div className="bg-card text-card-foreground p-3 rounded-t-lg border-b">
                <RadioGroup value={selectedExchange} onValueChange={(v) => setSelectedExchange(v as any)} className="flex space-x-4">
                    {isUsStock ? (
                        <>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="NASDAQ" id="NASDAQ" />
                                <Label htmlFor="NASDAQ" className="text-sm">NASDAQ: ₹{asset.price.toFixed(2)}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="NYSE" id="NYSE" />
                                <Label htmlFor="NYSE" className="text-sm">NYSE: ₹{asset.price.toFixed(2)}</Label>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="BSE" id="BSE" />
                                <Label htmlFor="BSE" className="text-sm">BSE: ₹{asset.price.toFixed(2)}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="NSE" id="NSE" />
                                <Label htmlFor="NSE" className="text-sm">NSE: ₹{asset.price.toFixed(2)}</Label>
                            </div>
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
                    <CommonOrderFields orderProps={commonOrderProps} orderMode="Regular" />
                     <div className="mt-4 pt-4 border-t"><p className="text-sm text-muted-foreground">Margin required: <span className="font-semibold text-foreground">₹{displayedMargin.toLocaleString('en-IN')}</span></p></div>
                </TabsContent>
                <TabsContent value="MTF" className="p-4 mt-0 space-y-4">
                    <CommonOrderFields orderProps={commonOrderProps} orderMode="MTF" />
                    <div className="space-y-2 pt-2">
                         <Label>Leverage</Label>
                         <RadioGroup value={mtfLeverage} onValueChange={setMtfLeverage} className="flex flex-wrap gap-x-4 gap-y-2">
                             {['1x', '2x', '3x', '4x'].map(val => (
                                 <div key={val} className="flex items-center space-x-2">
                                     <RadioGroupItem value={val} id={`leverage-${val}-stock`} />
                                     <Label htmlFor={`leverage-${val}-stock`} className="font-normal">{val}</Label>
                                 </div>
                             ))}
                         </RadioGroup>
                     </div>
                     <div className="mt-4 pt-4 border-t"><p className="text-sm text-muted-foreground">Margin required: <span className="font-semibold text-foreground">₹{displayedMargin.toLocaleString('en-IN')}</span></p></div>
                </TabsContent>
                <TabsContent value="SP" className="p-0 mt-0"><SipForm asset={asset} assetType="stock" /></TabsContent>
            </Tabs>
            <MarketDepth asset={asset} selectedExchange={selectedExchange} onPriceClick={handleMarketDepthPriceClick} />
            <div className="p-4 border-t flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsAddToBasketDialogOpen(true)}><ShoppingBasket className="mr-2 h-4 w-4" /> Add to Basket</Button>
                <Button variant="outline" className="flex-1" onClick={() => toast({ title: "Add Alert (WIP)" })}><BellPlus className="mr-2 h-4 w-4" /> Add Alert</Button>
            </div>
             <AddToBasketDialog isOpen={isAddToBasketDialogOpen} onOpenChange={setIsAddToBasketDialogOpen} asset={asset} assetType={assetType} />
        </div>
    );
};

const CryptoOrderForm = ({ asset, assetType, productType, onProductTypeChange }: any) => {
    const { toast } = useToast();
    const [quantity, setQuantity] = useState<number | string>('1');
    const [price, setPrice] = useState<number | string>(asset.price.toFixed(2));
    const [orderMode, setOrderMode] = useState('Regular');
    const [orderType, setOrderType] = useState('Limit');
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [displayedMargin, setDisplayedMargin] = useState(0);
    const [isAddToBasketDialogOpen, setIsAddToBasketDialogOpen] = useState(false);
    const [lockInYears, setLockInYears] = useState('');
    const [lockInMonths, setLockInMonths] = useState('');


    const [isStopLossEnabled, setIsStopLossEnabled] = useState(false);
    const [stopLossValue, setStopLossValue] = useState('');
    const [stopLossUnit, setStopLossUnit] = useState<'price' | 'percent'>('price');
    const [isTrailingSlEnabled, setIsTrailingSlEnabled] = useState(false);
    const [trailingSlValue, setTrailingSlValue] = useState('');
    const [trailingSlUnit, setTrailingSlUnit] = useState<'price' | 'percent'>('price');
    const [isTargetProfitEnabled, setIsTargetProfitEnabled] = useState(false);
    const [targetProfitValue, setTargetProfitValue] = useState('');
    const [targetProfitUnit, setTargetProfitUnit] = useState<'price' | 'percent'>('price');

    useEffect(() => {
        const numQty = parseFloat(String(quantity)) || 0;
        const numPrice = parseFloat(String(price)) || 0;
        setDisplayedMargin(numQty * numPrice);
    }, [quantity, price]);

    const handleMarketDepthPriceClick = (clickedPrice: number) => {
        setPrice(clickedPrice.toFixed(2));
        setOrderType('Limit');
    };

    const commonOrderProps = {
        asset, assetType, productType, onProductTypeChange, quantity, setQuantity,
        price, setPrice, orderType, setOrderType,
        showMoreOptions, setShowMoreOptions,
        isStopLossEnabled, setIsStopLossEnabled, stopLossValue, setStopLossValue, stopLossUnit, setStopLossUnit,
        isTrailingSlEnabled, setIsTrailingSlEnabled, trailingSlValue, setTrailingSlValue, trailingSlUnit, setTrailingSlUnit,
        isTargetProfitEnabled, setIsTargetProfitEnabled, targetProfitValue, setTargetProfitValue, targetProfitUnit, setTargetProfitUnit,
        lockInMonths, setLockInMonths, lockInYears, setLockInYears
    };

    return (
        <div className="bg-card shadow-md rounded-lg mt-4">
            <Tabs value={orderMode} onValueChange={setOrderMode} className="w-full">
                <TabsList className="w-full justify-start rounded-none bg-transparent border-b p-0">
                    <TabsTrigger value="Regular" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Regular</TabsTrigger>
                    <TabsTrigger value="SP" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">SP</TabsTrigger>
                </TabsList>
                <TabsContent value="Regular" className="p-4 mt-0">
                     <CommonOrderFields orderProps={commonOrderProps} orderMode="Regular" />
                     <div className="mt-4 pt-4 border-t"><p className="text-sm text-muted-foreground">Margin required: <span className="font-semibold text-foreground">₹{displayedMargin.toLocaleString('en-IN')}</span></p></div>
                </TabsContent>
                <TabsContent value="SP" className="p-0 mt-0"><SipForm asset={asset} assetType="crypto" /></TabsContent>
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

const FutureOrderForm = ({ asset, assetType, productType, onProductTypeChange }: any) => {
    const { toast } = useToast();
    const [quantity, setQuantity] = useState<number | string>(1);
    const [price, setPrice] = useState<number | string>(asset.price.toFixed(2));
    const [orderType, setOrderType] = useState('Limit');
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [selectedExpiryDate, setSelectedExpiryDate] = useState<string>('');
    const [displayedMargin, setDisplayedMargin] = useState(0);
    const [isAddToBasketDialogOpen, setIsAddToBasketDialogOpen] = useState(false);

    const [isStopLossEnabled, setIsStopLossEnabled] = useState(false);
    const [stopLossValue, setStopLossValue] = useState('');
    const [stopLossUnit, setStopLossUnit] = useState<'price' | 'percent'>('price');
    const [isTrailingSlEnabled, setIsTrailingSlEnabled] = useState(false);
    const [trailingSlValue, setTrailingSlValue] = useState('');
    const [trailingSlUnit, setTrailingSlUnit] = useState<'price' | 'percent'>('price');
    const [isTargetProfitEnabled, setIsTargetProfitEnabled] = useState(false);
    const [targetProfitValue, setTargetProfitValue] = useState('');
    const [targetProfitUnit, setTargetProfitUnit] = useState<'price' | 'percent'>('price');

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

     const commonOrderProps = {
        asset, assetType, productType, onProductTypeChange, quantity, setQuantity,
        price, setPrice, orderType, setOrderType,
        showMoreOptions, setShowMoreOptions,
        isStopLossEnabled, setIsStopLossEnabled, stopLossValue, setStopLossValue, stopLossUnit, setStopLossUnit,
        isTrailingSlEnabled, setIsTrailingSlEnabled, trailingSlValue, setTrailingSlValue, trailingSlUnit, setTrailingSlUnit,
        isTargetProfitEnabled, setIsTargetProfitEnabled, targetProfitValue, setTargetProfitValue, targetProfitUnit, setTargetProfitUnit
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
                 <CommonOrderFields orderProps={commonOrderProps} orderMode="Regular" />
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

const CryptoFutureOrderForm = ({ asset, assetType, productType, onProductTypeChange }: any) => {
    const { toast } = useToast();
    const [quantity, setQuantity] = useState<number | string>('1');
    const [price, setPrice] = useState<number | string>(asset.price.toFixed(2));
    const [orderMode, setOrderMode] = useState('MTF');
    const [orderType, setOrderType] = useState('Limit');
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [mtfLeverage, setMtfLeverage] = useState('1x');
    const [displayedMargin, setDisplayedMargin] = useState(0);
    const [isAddToBasketDialogOpen, setIsAddToBasketDialogOpen] = useState(false);

    const [isStopLossEnabled, setIsStopLossEnabled] = useState(false);
    const [stopLossValue, setStopLossValue] = useState('');
    const [stopLossUnit, setStopLossUnit] = useState<'price' | 'percent'>('price');
    const [isTrailingSlEnabled, setIsTrailingSlEnabled] = useState(false);
    const [trailingSlValue, setTrailingSlValue] = useState('');
    const [trailingSlUnit, setTrailingSlUnit] = useState<'price' | 'percent'>('price');
    const [isTargetProfitEnabled, setIsTargetProfitEnabled] = useState(false);
    const [targetProfitValue, setTargetProfitValue] = useState('');
    const [targetProfitUnit, setTargetProfitUnit] = useState<'price' | 'percent'>('price');

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
    
     const commonOrderProps = {
        asset, assetType, productType, onProductTypeChange, quantity, setQuantity,
        price, setPrice, orderType, setOrderType,
        showMoreOptions, setShowMoreOptions,
        isStopLossEnabled, setIsStopLossEnabled, stopLossValue, setStopLossValue, stopLossUnit, setStopLossUnit,
        isTrailingSlEnabled, setIsTrailingSlEnabled, trailingSlValue, setTrailingSlValue, trailingSlUnit, setTrailingSlUnit,
        isTargetProfitEnabled, setIsTargetProfitEnabled, targetProfitValue, setTargetProfitValue, targetProfitUnit, setTargetProfitUnit
    };

    return (
         <div className="bg-card shadow-md rounded-lg mt-4">
            <Tabs value={orderMode} onValueChange={setOrderMode} className="w-full">
                 <TabsList className="w-full justify-start rounded-none bg-transparent border-b p-0">
                    <TabsTrigger value="MTF" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Trade</TabsTrigger>
                    <TabsTrigger value="SP" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">SP</TabsTrigger>
                </TabsList>
                 <TabsContent value="MTF" className="p-4 mt-0 space-y-4">
                     <CommonOrderFields orderProps={commonOrderProps} orderMode="MTF" />
                     <div className="space-y-2 pt-2">
                        <Label htmlFor={`leverage-cf`}>Leverage</Label>
                        <Select value={mtfLeverage} onValueChange={setMtfLeverage}>
                            <SelectTrigger id={`leverage-cf`} className="w-full sm:w-[180px]"><SelectValue placeholder="Select leverage" /></SelectTrigger>
                            <SelectContent>{leverageOptions.map(val => <SelectItem key={val} value={val}>{val}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div className="mt-4 pt-4 border-t"><p className="text-sm text-muted-foreground">Margin required: <span className="font-semibold text-foreground">₹{displayedMargin.toLocaleString('en-IN')}</span></p></div>
                 </TabsContent>
                 <TabsContent value="SP" className="p-0 mt-0"><SipForm asset={asset} assetType="crypto" /></TabsContent>
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
  assetType: "stock" | "future" | "option" | "crypto" | "mutual-fund" | "bond" | "crypto-future";
  productType: string;
  onProductTypeChange: (value: string) => void;
}

export function OrderPlacementForm({ assetType, ...props }: OrderPlacementFormProps) {
  switch (assetType) {
    case 'stock':
      return <StockOrderForm assetType={assetType} {...props} />;
    case 'crypto':
      return <CryptoOrderForm assetType={assetType} {...props} />;
    case 'future':
    case 'option': // Options use the same form as futures for this mock
      return <FutureOrderForm assetType={assetType} {...props} />;
    case 'crypto-future':
        return <CryptoFutureOrderForm assetType={assetType} {...props} />;
    // Basic forms for these asset types could be added here
    case 'mutual-fund':
    case 'bond':
        // For now, let's use a simplified version of the crypto form which is also simple
        return <CryptoOrderForm assetType={assetType} {...props} />;
    default:
      return <div className="p-4 text-center text-muted-foreground">Order placement not available for this asset type.</div>;
  }
}

// #endregion
