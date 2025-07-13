
"use client";

import React, { useState, useMemo } from 'react';
import type { SelectedOptionLeg } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BarChartHorizontal } from 'lucide-react';

// Mocked MarketDepth component for demonstration
const MarketDepth = ({ basePrice, onPriceClick }: { basePrice: number, onPriceClick: (price: number) => void }) => {
    const marketDepthData = useMemo(() => {
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
    }, [basePrice]);

    return (
        <div className="p-4 border-t mt-4">
            <h3 className="text-md font-semibold mb-3 flex items-center">
                <BarChartHorizontal className="h-4 w-4 mr-2 text-primary" />
                Market Depth
            </h3>
            <div className="grid grid-cols-2 gap-x-4 text-xs">
                <div>
                    <div className="flex justify-between font-semibold mb-2 text-green-600">
                        <span>Buy Orders</span>
                        <span>Qty: {marketDepthData.totalBuyQty.toLocaleString()}</span>
                    </div>
                    <div className="space-y-1">
                        {marketDepthData.buy.map((order, index) => (
                            <div
                                key={`buy-${index}`}
                                className="flex justify-between p-1.5 rounded bg-green-500/10 cursor-pointer hover:bg-green-500/20 transition-colors"
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
                        <span>Qty: {marketDepthData.totalSellQty.toLocaleString()}</span>
                    </div>
                    <div className="space-y-1">
                        {marketDepthData.sell.map((order, index) => (
                            <div
                                key={`sell-${index}`}
                                className="flex justify-between p-1.5 rounded bg-red-500/10 cursor-pointer hover:bg-red-500/20 transition-colors"
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


interface EditLegFormProps {
  leg: SelectedOptionLeg;
  onUpdate: (leg: SelectedOptionLeg) => void;
  onCancel: () => void;
}

export function EditLegForm({ leg, onUpdate, onCancel }: EditLegFormProps) {
  const [quantity, setQuantity] = useState(leg.quantity.toString());
  const [price, setPrice] = useState(leg.ltp.toString());
  const [orderType, setOrderType] = useState('Limit');
  const lotSize = 50; // Assuming a fixed lot size for this example

  const handleUpdate = () => {
    onUpdate({
      ...leg,
      quantity: parseInt(quantity, 10),
      ltp: parseFloat(price),
    });
  };
  
  const handleMarketDepthPriceClick = (clickedPrice: number) => {
      setPrice(clickedPrice.toFixed(2));
      setOrderType('Limit');
  };

  return (
    <div className="bg-muted/50 p-4 rounded-md border border-dashed animate-accordion-down">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor={`lots-${leg.id}`}>Lots</Label>
            <Input 
                id={`lots-${leg.id}`}
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                min="1"
            />
            <p className="text-xs text-muted-foreground">Total Qty: {(parseInt(quantity, 10) || 0) * lotSize}</p>
        </div>
         <div className="space-y-2">
            <Label htmlFor={`price-${leg.id}`}>Price</Label>
            <Input 
                id={`price-${leg.id}`}
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                disabled={orderType === 'Market'}
            />
        </div>
      </div>
      <RadioGroup value={orderType} onValueChange={(value) => setOrderType(value)} className="flex gap-x-4 gap-y-2 mt-4">
          {(['Market', 'Limit'] as const).map(type => (
              <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={`orderType-${type}-${leg.id}`} />
                  <Label htmlFor={`orderType-${type}-${leg.id}`} className="font-normal">{type}</Label>
              </div>
          ))}
      </RadioGroup>

      <MarketDepth basePrice={leg.ltp} onPriceClick={handleMarketDepthPriceClick} />
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleUpdate}>Update Leg</Button>
      </div>
    </div>
  );
}

