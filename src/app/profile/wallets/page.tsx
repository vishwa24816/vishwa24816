
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wallet, Plus, Eye, EyeOff, Trash2, Copy, CheckCircle, Lock } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { mockWallets as initialMockWallets } from '@/lib/mockData/wallets';
import { useAuth } from '@/contexts/AuthContext';


const WalletCard = ({ wallet, onRemove, isPrimary, onSetPrimary }: { wallet: typeof initialMockWallets[0], onRemove: (id: string) => void, isPrimary: boolean, onSetPrimary: (id: string) => void }) => {
  const [showPhrase, setShowPhrase] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.phrase);
    toast({ title: 'Copied Recovery Phrase' });
  };

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                {wallet.name}
            </CardTitle>
            <div className="flex items-center gap-1">
                {isPrimary && <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1"/>Primary</Badge>}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your wallet and remove its data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onRemove(wallet.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Recovery Phrase</p>
          <Button variant="ghost" size="icon" onClick={() => setShowPhrase(!showPhrase)} className="h-8 w-8">
            {showPhrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {showPhrase && (
          <div className="mt-2 p-3 bg-muted rounded-md flex items-center justify-between animate-accordion-down">
            <p className="text-sm font-mono break-all">{wallet.phrase}</p>
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 shrink-0">
                <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        {!isPrimary && (
            <div className="mt-3 pt-3 border-t">
                <Button variant="secondary" size="sm" onClick={() => onSetPrimary(wallet.id)}>Make Primary</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function WalletManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { primaryWalletId, setPrimaryWalletId } = useAuth();
  // We'll manage wallets in state so we can add/remove them
  const [wallets, setWallets] = useState(initialMockWallets);
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletPhrase, setNewWalletPhrase] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createPassword, setCreatePassword] = useState('');

  const handleAddWallet = () => {
    if (!newWalletName.trim() || !newWalletPhrase.trim()) {
        toast({
            title: "Incomplete information",
            description: "Please provide both a wallet name and a recovery phrase.",
            variant: "destructive"
        });
        return;
    }

    const wordCount = newWalletPhrase.trim().split(/\s+/).length;
    if (wordCount < 12 || wordCount > 24) {
      toast({
        title: "Invalid Recovery Phrase",
        description: "Recovery phrase must be between 12 and 24 words.",
        variant: "destructive"
      });
      return;
    }
    
    const newWallet = {
      id: `wallet${Date.now()}`,
      name: newWalletName,
      phrase: newWalletPhrase.trim(),
    };
    setWallets(prev => [...prev, newWallet]);
    setNewWalletName('');
    setNewWalletPhrase('');
    setIsAddDialogOpen(false);
    toast({
      title: 'New Wallet Added (Mock)',
      description: `${newWallet.name} has been created.`,
    });
  };

  const handleRemoveWallet = (id: string) => {
    const walletToRemove = wallets.find(w => w.id === id);
    setWallets(prev => prev.filter(w => w.id !== id));
     if (walletToRemove) {
        toast({
            title: "Wallet Removed (Mock)",
            description: `${walletToRemove.name} has been removed.`,
            variant: "destructive"
        });
    }
    if (primaryWalletId === id) {
        setPrimaryWalletId('');
    }
  }

  const handleSetPrimary = (id: string) => {
    setPrimaryWalletId(id);
    const wallet = wallets.find(w => w.id === id);
    toast({
        title: "Primary Wallet Set",
        description: `${wallet?.name} is now your primary wallet.`,
    });
  }

  const handleMailRecovery = () => {
    if(!createPassword) {
        toast({
            title: "Password Required",
            description: "Please enter your password to proceed.",
            variant: "destructive"
        });
        return;
    }
    toast({
      title: "Recovery Phrase Requested",
      description: "Within 1 hour, a crypto wallet Recovery Phrase will be sent to your registered email.",
    });
    setIsCreateDialogOpen(false);
    setCreatePassword('');
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-muted/20">
        <header className="flex items-center p-4 border-b bg-background sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-4">Wallet Management</h1>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Create Crypto Wallet
                  </Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Create New Crypto Wallet</DialogTitle>
                      <DialogDescription>
                          Enter your account password to confirm your identity. A new wallet will be created and the recovery phrase will be mailed to you.
                      </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                       <div className="space-y-2">
                            <Label htmlFor="create-wallet-password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="create-wallet-password"
                                    type="password"
                                    value={createPassword}
                                    onChange={(e) => setCreatePassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                  </div>
                  <DialogFooter>
                      <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleMailRecovery}>Mail Me</Button>
                  </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Import Existing Wallet
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Existing Wallet</DialogTitle>
                        <DialogDescription>
                            Enter a name for your wallet and its recovery phrase to import it.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="wallet-name">Wallet Name</Label>
                            <Input
                                id="wallet-name"
                                value={newWalletName}
                                onChange={(e) => setNewWalletName(e.target.value)}
                                placeholder="e.g., My DeFi Wallet"
                            />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="recovery-phrase">Recovery Phrase (12-24 words)</Label>
                            <Textarea
                                id="recovery-phrase"
                                value={newWalletPhrase}
                                onChange={(e) => setNewWalletPhrase(e.target.value)}
                                placeholder="Enter your secret recovery phrase separated by spaces"
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleAddWallet}>Save Wallet</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="space-y-4">
                {wallets.map((wallet) => (
                    <WalletCard 
                        key={wallet.id} 
                        wallet={wallet} 
                        onRemove={handleRemoveWallet}
                        isPrimary={primaryWalletId === wallet.id}
                        onSetPrimary={handleSetPrimary}
                    />
                ))}
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
