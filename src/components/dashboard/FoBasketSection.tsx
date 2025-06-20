
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { mockFoBaskets } from '@/lib/mockData';
import type { FoBasket } from '@/types';
import { cn } from '@/lib/utils';
import { ShoppingBasket, CalendarDays, Layers, ChevronDown, ChevronUp, Edit3, Copy, PlayCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};

const getStatusBadgeVariant = (status: FoBasket['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Active':
      return 'default'; // Using default for green-like appearance based on theme
    case 'Pending Execution':
      return 'secondary'; // Yellowish/Grayish
    case 'Executed':
      return 'outline'; // Neutral
    case 'Cancelled':
      return 'destructive';
    case 'Archived':
      return 'secondary';
    default:
      return 'outline';
  }
};


export function FoBasketSection() {
  const baskets = mockFoBaskets;
  const [expandedBasketId, setExpandedBasketId] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleExpand = (basketId: string) => {
    setExpandedBasketId(prevId => (prevId === basketId ? null : basketId));
  };

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
            <div onClick={() => toggleExpand(basket.id)} className="cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">{basket.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusBadgeVariant(basket.status)} className={cn("text-xs capitalize", 
                         basket.status === 'Active' ? 'bg-green-500/80 text-white dark:bg-green-600/80' :
                         basket.status === 'Pending Execution' ? 'bg-yellow-500/80 text-black dark:bg-yellow-600/80' :
                         basket.status === 'Executed' ? 'bg-blue-500/80 text-white dark:bg-blue-600/80' :
                         ''
                    )}>
                      {basket.status.toLowerCase()}
                    </Badge>
                    {expandedBasketId === basket.id ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm flex-grow">
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
              </CardContent>
            </div>
            
            {expandedBasketId === basket.id && (
              <div className="border-t mt-2 p-4"> {/* Removed animate-accordion-down */}
                <h4 className="text-sm font-semibold mb-2 text-foreground">Basket Instrument Details:</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {/* Placeholder for actual instrument details */}
                  <li>- BUY NIFTY 25JUL24 22000 CE @ 150.50 (1 Lot)</li>
                  <li>- SELL NIFTY 25JUL24 22200 CE @ 80.25 (1 Lot)</li>
                  {basket.instrumentsCount > 2 && <li>- ... and {basket.instrumentsCount - 2} more instruments.</li>}
                </ul>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  Full instrument breakdown will appear here. Click Edit to modify.
                </p>
              </div>
            )}
             <div className="border-t mt-auto p-3 flex justify-end space-x-2">
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
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

