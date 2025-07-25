
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FoBasket, FoInstrumentInBasket } from '@/types';
import { mockFoBaskets } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBasket, PlayCircle, Edit3, Copy, ChevronDown, DollarSign, TrendingUp, Maximize, Minimize, Sigma, Info } from 'lucide-react';

// Helper functions and components for detailed view
const formatCurrency = (value?: number, precision = 2) => {
  if (value === undefined || value === null || isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: precision, maximumFractionDigits: precision }).format(value);
};

const MetricDisplay: React.FC<{ label: string; value: string | number | undefined; icon?: React.ElementType; unit?: string; className?: string }> = ({ label, value, icon: Icon, unit, className }) => (
  <div className={cn("flex flex-col p-2 bg-muted/50 rounded-md", className)}>
    <div className="text-xs text-muted-foreground flex items-center">
      {Icon && <Icon className="h-3.5 w-3.5 mr-1.5" />}
      {label}
    </div>
    <p className="text-sm font-semibold text-foreground">
      {typeof value === 'number' ? (unit === '₹' ? formatCurrency(value) : `${value}${unit || ''}`) : (value || 'N/A')}
    </p>
  </div>
);

const InstrumentListItem: React.FC<{ instrument: FoInstrumentInBasket }> = ({ instrument }) => (
  <li className="flex justify-between items-center py-1.5 px-2 even:bg-muted/30 rounded-sm text-xs">
    <div className="flex-1">
      <span className={cn("font-semibold", instrument.action === 'BUY' ? 'text-green-600' : 'text-red-600')}>{instrument.action}</span>
      <span className="ml-1.5 text-foreground">{instrument.name}</span>
    </div>
    <div className="flex-shrink-0 text-right min-w-[100px]">
      <span>{instrument.lots} Lot{instrument.lots > 1 ? 's' : ''}</span>
      <span className="ml-2 text-muted-foreground">@ {formatCurrency(instrument.price)}</span>
    </div>
  </li>
);


interface BasketItemProps {
  basket: FoBasket;
}

const BasketItem: React.FC<BasketItemProps> = ({ basket }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
        <div 
            className="p-3 cursor-pointer hover:bg-muted/50"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex justify-between items-center">
                <p className="font-semibold text-sm text-foreground">{basket.name}</p>
                 <div className='flex items-center gap-2'>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize",
                    basket.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' :
                    basket.status === 'Pending Execution' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300' :
                    basket.status === 'Executed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300' :
                    'bg-muted text-muted-foreground'
                    )}>{basket.status.toLowerCase()}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
                </div>
            </div>
            <p className="text-xs text-muted-foreground">
                {basket.instrumentsCount} instruments | Margin: {formatCurrency(basket.requiredMargin)}
                {basket.pnl !== undefined && ` | P&L: ${formatCurrency(basket.pnl)}`}
            </p>
        </div>
      
      {isOpen && (
        <div className="bg-muted/30 px-3 py-3 space-y-4 animate-accordion-down">
            <p className="text-xs">Created: {new Date(basket.createdDate).toLocaleDateString()}</p>
            <div>
              <h4 className="text-sm font-semibold mb-1.5 text-foreground">Instruments:</h4>
              {basket.instruments && basket.instruments.length > 0 ? (
                  <ScrollArea className="max-h-40 pr-2 border rounded-md p-1 bg-background">
                  <ul className="space-y-1">
                      {basket.instruments.map(instrument => (
                          <InstrumentListItem key={instrument.id} instrument={instrument} />
                      ))}
                  </ul>
                  </ScrollArea>
              ) : (
                  <p className="text-xs text-muted-foreground italic">No instrument details available.</p>
              )}
            </div>
             {basket.probabilityOfProfit !== undefined && (
                <div>
                    <h4 className="text-sm font-semibold mb-1.5 text-foreground">Strategy Metrics:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <MetricDisplay label="Prob. of Profit" value={basket.probabilityOfProfit} unit="%" icon={TrendingUp} />
                        <MetricDisplay label="Max Profit" value={basket.maxProfit !== undefined ? formatCurrency(basket.maxProfit) : 'Unlimited'} icon={Maximize} className={basket.maxProfit === undefined ? 'text-green-600' : ''} />
                        <MetricDisplay label="Max Loss" value={basket.maxLoss !== undefined ? formatCurrency(basket.maxLoss) : 'Unlimited'} icon={Minimize} className={cn(basket.maxLoss === undefined ? 'text-red-600' : (basket.maxLoss >= 0 ? 'text-red-600' : 'text-green-600'))} />
                        <MetricDisplay label="Risk/Reward" value={basket.riskRewardRatio} icon={Sigma} />
                        <MetricDisplay label="Breakeven(s)" value={basket.breakEvenPoints} icon={Info} className="col-span-2 sm:col-span-1"/>
                        <MetricDisplay label="Actual P&L" value={formatCurrency(basket.pnl)} icon={DollarSign} className={cn("font-bold", basket.pnl !== undefined && basket.pnl >=0 ? 'text-green-600' : 'text-red-600')} />
                    </div>
                </div>
             )}
            <div className="pt-2 flex justify-end space-x-2">
                {basket.status === 'Pending Execution' && (
                <Button variant="default" size="sm" className="bg-primary" onClick={() => toast({ title: `Execute Basket: ${basket.name}`})}>
                    <PlayCircle className="mr-1 h-3 w-3" /> Execute
                </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => toast({ title: `Edit Basket: ${basket.name}`})}>
                    <Edit3 className="mr-1 h-3 w-3" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast({ title: `Duplicate Basket: ${basket.name}`})}>
                    <Copy className="mr-1 h-3 w-3" /> Duplicate
                </Button>
            </div>
        </div>
      )}
    </div>
  );
};

export function BasketsDisplay() {
  const baskets = mockFoBaskets;

  if (baskets.length === 0) {
    return (
      <div className="text-center py-10">
        <ShoppingBasket className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          No basket orders found.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] p-1">
      {baskets.map((basket) => (
        <BasketItem key={basket.id} basket={basket} />
      ))}
    </ScrollArea>
  );
}
