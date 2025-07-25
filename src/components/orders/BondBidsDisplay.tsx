
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { BondBid } from '@/types';
import { mockBondBids } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { LandPlot, XCircle, Edit3 } from 'lucide-react'; // Using LandPlot as a generic icon for bonds/bids

interface BondBidItemProps {
  bid: BondBid;
}

const BondBidItem: React.FC<BondBidItemProps> = ({ bid }) => {
  const { toast } = useToast();
  return (
    <div className="border-b">
        <div className="p-3">
            <div className="flex justify-between items-center">
                <p className="font-semibold text-sm text-foreground">{bid.bondName}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{bid.platform}</span>
            </div>
            <p className="text-xs text-muted-foreground">ISIN: {bid.isin}</p>
        </div>
        <div className="text-xs px-3 pb-2 space-y-1">
            <div className="flex justify-between"><span>Bid Price: ₹{bid.bidPrice.toFixed(2)}</span> <span>Qty: {bid.quantity}</span></div>
            {bid.bidYield && <div className="flex justify-between"><span>Bid Yield: {bid.bidYield}</span></div>}
            <div className="flex justify-between">
            <span>Status: <span className={cn("font-medium", bid.status === 'Pending' ? 'text-primary' : bid.status === 'Filled' ? 'text-green-600' : 'text-muted-foreground')}>{bid.status}</span></span>
            <span>Date: {new Date(bid.bidDate).toLocaleDateString()}</span>
            </div>
        </div>
        <div className="px-3 pb-2 flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => toast({ title: `Modify Bid: ${bid.isin}`})}>
                <Edit3 className="mr-1 h-3 w-3" /> Modify
            </Button>
            <Button variant="destructive" size="sm" onClick={() => toast({ title: `Cancel Bid: ${bid.isin}`, variant: "destructive"})}>
                <XCircle className="mr-1 h-3 w-3" /> Cancel
            </Button>
        </div>
    </div>
  );
};

export function BondBidsDisplay() {
  const bids = mockBondBids;

  if (bids.length === 0) {
    return (
      <div className="text-center py-10">
        <LandPlot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No active bond bids found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] p-1">
      {bids.map((bid) => (
        <BondBidItem key={bid.id} bid={bid} />
      ))}
    </ScrollArea>
  );
}
