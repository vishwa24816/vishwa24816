
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockFoBaskets } from '@/lib/mockData';
import type { FoBasket, FoInstrumentInBasket } from '@/types';
import { cn } from '@/lib/utils';
import { ShoppingBasket, CalendarDays, Layers, Edit3, Copy, PlayCircle, TrendingUp, TrendingDown, Minus, DollarSign, AlertTriangle, Sigma, Maximize, Minimize, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (value?: number, precision = 2) => {
  if (value === undefined || value === null || isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: precision, maximumFractionDigits: precision }).format(value);
};

const getStatusBadgeVariant = (status: FoBasket['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Active':
      return 'default'; 
    case 'Pending Execution':
      return 'secondary'; 
    case 'Executed':
      return 'outline'; 
    case 'Cancelled':
      return 'destructive';
    case 'Archived':
      return 'secondary';
    default:
      return 'outline';
  }
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


export function FoBasketSection() {
  const baskets = mockFoBaskets;
  const { toast } = useToast();

  if (baskets.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold font-headline text-primary flex items-center">
          <ShoppingBasket className="h-6 w-6 mr-2" /> F&O Basket
        </h2>
        <p className="text-muted-foreground text-center py-4">You have no F&O baskets.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold font-headline text-primary flex items-center">
        <ShoppingBasket className="h-6 w-6 mr-2" /> F&O Basket
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {baskets.map((basket) => (
          <Card key={basket.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">{basket.name}</CardTitle>
                <Badge variant={getStatusBadgeVariant(basket.status)} className={cn("text-xs capitalize", 
                       basket.status === 'Active' ? 'bg-green-500/80 text-white dark:bg-green-600/80' :
                       basket.status === 'Pending Execution' ? 'bg-yellow-500/80 text-black dark:bg-yellow-600/80' :
                       basket.status === 'Executed' ? 'bg-blue-500/80 text-white dark:bg-blue-600/80' :
                       ''
                  )}>
                    {basket.status.toLowerCase()}
                  </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm flex-grow">
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Layers className="h-4 w-4 mr-2 text-primary/70" />
                  <span>{basket.instrumentsCount} Instrument{basket.instrumentsCount > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <CalendarDays className="h-4 w-4 mr-2 text-primary/70" />
                  <span>Created: {new Date(basket.createdDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</span>
                </div>
                
                <div className="flex items-center justify-between pt-1">
                  <div>
                      <p className="text-xs text-muted-foreground">Req. Margin</p>
                      <p className="font-semibold text-foreground">{formatCurrency(basket.requiredMargin)}</p>
                  </div>
                  {basket.pnl !== undefined && (
                     <div className="text-right">
                      <p className="text-xs text-muted-foreground">P&L</p>
                      <p className={cn("font-semibold", basket.pnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(basket.pnl)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            
              <div className="border-t pt-3 space-y-3">
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
                <div>
                    <h4 className="text-sm font-semibold mb-1.5 text-foreground">Strategy Metrics:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <MetricDisplay label="Prob. of Profit" value={basket.probabilityOfProfit} unit="%" icon={TrendingUp} />
                        <MetricDisplay label="Max Profit" value={basket.maxProfit !== undefined ? formatCurrency(basket.maxProfit) : 'Unlimited'} icon={Maximize} className={basket.maxProfit === undefined ? 'text-green-600' : ''} />
                        <MetricDisplay label="Max Loss" value={basket.maxLoss !== undefined ? formatCurrency(basket.maxLoss) : 'Unlimited'} icon={Minimize} className={cn(basket.maxLoss === undefined ? 'text-red-600' : (basket.maxLoss >= 0 ? 'text-red-600' : 'text-green-600'))} />
                        <MetricDisplay label="Risk/Reward" value={basket.riskRewardRatio} icon={Sigma} />
                        <MetricDisplay label="Breakeven(s)" value={basket.breakEvenPoints} icon={Info} className="col-span-2 sm:col-span-1"/>
                        <MetricDisplay label="Actual P&L" value={formatCurrency(basket.pnl)} icon={DollarSign} className={cn("font-bold", basket.pnl !== undefined && basket.pnl >=0 ? 'text-green-600' : 'text-red-600')} />
                        <MetricDisplay label="Total Margin" value={formatCurrency(basket.totalMargin || basket.requiredMargin)} icon={DollarSign} />
                        <MetricDisplay label="Margin Benefits" value={formatCurrency(basket.marginBenefits)} icon={AlertTriangle} />
                    </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t mt-auto p-3 flex justify-end space-x-2">
                {basket.status === 'Pending Execution' && (
                  <Button variant="default" size="sm" className="bg-primary" onClick={(e) => {e.stopPropagation(); toast({ title: `Execute Basket: ${basket.name}`})}}>
                    <PlayCircle className="mr-1 h-4 w-4" /> Execute
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation(); toast({ title: `Edit Basket (Mock): ${basket.name}`, description: "Full edit functionality coming soon."})}}>
                    <Edit3 className="mr-1 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation(); toast({ title: `Duplicate Basket: ${basket.name}`})}}>
                    <Copy className="mr-1 h-4 w-4" /> Duplicate
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

