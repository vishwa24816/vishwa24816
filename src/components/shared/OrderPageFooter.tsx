
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import type { Stock } from '@/types';
import { SimbotInputBar } from '@/components/simbot/SimbotInputBar';
import type { InitialOrderDetails } from '@/app/page';

interface OrderPageFooterProps {
  asset: Stock | null;
  productType: string;
  onNavigateRequest: (asset: Stock, details?: InitialOrderDetails) => void;
}

export function OrderPageFooter({ asset, productType, onNavigateRequest }: OrderPageFooterProps) {
  const { toast } = useToast();

  const handleBuyAction = () => {
    toast({ title: "Buy Action (Mock)", description: `Initiating BUY for ${asset?.symbol} with product type: ${productType}` });
  };

  const handleSellAction = () => {
    toast({ title: "Sell Action (Mock)", description: `Initiating SELL for ${asset?.symbol} with product type: ${productType}` });
  };

  const isSellDisabled = productType === 'Delivery' || productType === 'HODL';

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border rounded-t-2xl shadow-lg">
      <div className="p-3 flex space-x-3">
        <Button
          onClick={handleSellAction}
          variant="destructive"
          className="flex-1 text-base py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:bg-red-800"
          disabled={isSellDisabled}
        >
          Sell
        </Button>
        <Button
          onClick={handleBuyAction}
          className="flex-1 text-base py-3 bg-green-600 hover:bg-green-700 text-white"
        >
          Buy
        </Button>
      </div>
       <div className="border-t p-2">
            <SimbotInputBar onNavigateRequest={onNavigateRequest} />
      </div>
    </footer>
  );
}
