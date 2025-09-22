
"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PortfolioHolding } from '@/types';
import { QrCode, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface SendDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  assets: PortfolioHolding[];
  onConfirm: (address: string, amount: string, assetSymbol: string) => void;
}

export function SendDialog({ isOpen, onOpenChange, assets, onConfirm }: SendDialogProps) {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string>(assets[0]?.symbol || '');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSend = () => {
    setError('');
    if (!address || !amount || !selectedAsset) {
      setError('Please fill in all fields.');
      return;
    }
    const asset = assets.find(a => a.symbol === selectedAsset);
    if (!asset || parseFloat(amount) > asset.quantity) {
        setError(`Insufficient balance. You have ${asset?.quantity} ${asset?.symbol}.`);
        return;
    }
    onConfirm(address, amount, selectedAsset);
  };
  
  const handleScan = () => {
    toast({
        title: "Scan QR (Mock)",
        description: "In a real app, this would open the camera to scan a QR code.",
    });
    // Mock setting an address after scan
    setTimeout(() => setAddress("0x1234567890abcdef1234567890abcdef12345678"), 1000);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Crypto</DialogTitle>
          <DialogDescription>
            Enter the recipient's address and amount to send.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
           <div className="space-y-2">
            <Label htmlFor="asset-select">Asset</Label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger id="asset-select">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map(asset => (
                  <SelectItem key={asset.id} value={asset.symbol}>
                    {asset.name} ({asset.symbol}) - Bal: {asset.quantity.toFixed(4)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient-address">Recipient's Address</Label>
            <div className="flex items-center gap-2">
                <Input
                id="recipient-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                />
                <Button variant="outline" size="icon" onClick={handleScan}><QrCode className="h-4 w-4"/></Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="send-amount">Amount</Label>
            <Input
              id="send-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
           {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSend} disabled={!address || !amount || !selectedAsset}>
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
