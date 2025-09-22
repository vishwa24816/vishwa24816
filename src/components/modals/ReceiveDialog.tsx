
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { PortfolioHolding } from '@/types';
import { Copy } from 'lucide-react';
import Image from 'next/image';

interface ReceiveDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  asset: PortfolioHolding;
  walletAddress: string;
}

export function ReceiveDialog({ isOpen, onOpenChange, asset, walletAddress }: ReceiveDialogProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({ title: 'Address Copied!', description: 'Your wallet address has been copied to the clipboard.' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receive {asset?.name} ({asset?.symbol})</DialogTitle>
          <DialogDescription>
            Share your address or QR code to receive {asset?.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 flex flex-col items-center justify-center gap-4">
            <div className="p-2 bg-white rounded-lg border">
                 <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`}
                    alt="Wallet QR Code"
                    width={200}
                    height={200}
                    data-ai-hint="qr code"
                />
            </div>
           
            <p className="text-sm text-muted-foreground text-center break-all">
                {walletAddress}
            </p>
        </div>
        
        <DialogFooter>
          <Button type="button" onClick={handleCopy} className="w-full">
            <Copy className="mr-2 h-4 w-4" /> Copy Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
