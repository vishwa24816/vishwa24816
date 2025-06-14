
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockFoBaskets } from '@/lib/mockData';
import type { FoBasket } from '@/types';
import { cn } from '@/lib/utils';
import { ShoppingBasket, CalendarDays, BarChart2, TrendingUp, TrendingDown, Layers } from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};

const getStatusBadgeVariant = (status: FoBasket['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Active':
      return 'default'; // Primary color (blue)
    case 'Pending Execution':
      return 'secondary'; // Muted color
    case 'Executed':
      return 'outline'; // Green-like or distinct outline
    case 'Cancelled':
      return 'destructive'; // Red
    case 'Archived':
      return 'secondary';
    default:
      return 'outline';
  }
};


export function FoBasketSection() {
  const baskets = mockFoBaskets;

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
                <Badge variant={getStatusBadgeVariant(basket.status)} className="text-xs capitalize">
                  {basket.status.toLowerCase()}
                </Badge>
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
            {/* Future actions like Edit, Duplicate, Execute can be added in a CardFooter */}
          </Card>
        ))}
      </div>
    </section>
  );
}
