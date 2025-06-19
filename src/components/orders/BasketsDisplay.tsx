
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FoBasket } from '@/types'; // Using FoBasket for now, can be made generic later
import { mockFoBaskets } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBasket, PlayCircle, Edit3, Copy } from 'lucide-react';

interface BasketItemProps {
  basket: FoBasket;
}

const BasketItem: React.FC<BasketItemProps> = ({ basket }) => {
  const { toast } = useToast();
  return (
    <Card className="mb-3 shadow-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-md font-semibold flex justify-between items-center">
          <span>{basket.name}</span>
           <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize",
            basket.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' :
            basket.status === 'Pending Execution' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300' :
            basket.status === 'Executed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300' :
             'bg-muted text-muted-foreground'
          )}>{basket.status.toLowerCase()}</span>
        </CardTitle>
        <CardDescription className="text-xs">
          {basket.instrumentsCount} instruments | Margin: ₹{basket.requiredMargin.toFixed(2)}
          {basket.pnl !== undefined && ` | P&L: ₹${basket.pnl.toFixed(2)}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-xs px-4 pb-3">
        Created: {new Date(basket.createdDate).toLocaleDateString()}
      </CardContent>
       <CardFooter className="px-4 py-2 border-t flex justify-end space-x-2">
        {basket.status === 'Pending Execution' && (
          <Button variant="default" size="xs" className="bg-primary" onClick={() => toast({ title: `Execute Basket: ${basket.name}`})}>
            <PlayCircle className="mr-1 h-3 w-3" /> Execute
          </Button>
        )}
        <Button variant="outline" size="xs" onClick={() => toast({ title: `Edit Basket: ${basket.name}`})}>
            <Edit3 className="mr-1 h-3 w-3" /> Edit
        </Button>
         <Button variant="outline" size="xs" onClick={() => toast({ title: `Duplicate Basket: ${basket.name}`})}>
            <Copy className="mr-1 h-3 w-3" /> Duplicate
        </Button>
      </CardFooter>
    </Card>
  );
};

export function BasketsDisplay() {
  const baskets = mockFoBaskets; // Using F&O baskets as example

  if (baskets.length === 0) {
    return (
      <div className="text-center py-10">
        <ShoppingBasket className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No basket orders found.</p>
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
