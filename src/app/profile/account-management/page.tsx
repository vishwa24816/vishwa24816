
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, ShieldAlert, Trash2, Power, EyeOff } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function AccountManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  // States for feature toggles
  const [tradingEnabled, setTradingEnabled] = useState(true);
  const [dematEnabled, setDematEnabled] = useState(true);
  const [cryptoEnabled, setCryptoEnabled] = useState(true);
  const [isAccountFrozen, setIsAccountFrozen] = useState(false);

  // States for unfreeze dialog
  const [isUnfreezeDialogOpen, setIsUnfreezeDialogOpen] = useState(false);
  const [pan, setPan] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleUnfreezeSubmit = () => {
    if (otp === '123456') { // Mock OTP check
        setIsAccountFrozen(false);
        setIsUnfreezeDialogOpen(false);
        setOtpSent(false);
        setPan('');
        setMobile('');
        setOtp('');
        toast({ title: 'Account Unfrozen', description: 'Your account has been successfully unfrozen.' });
    } else {
        toast({ title: 'Invalid OTP', description: 'The OTP you entered is incorrect.', variant: 'destructive' });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-muted/20">
        <header className="flex items-center p-4 border-b bg-background sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-4">Account Management</h1>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <EyeOff className="h-5 w-5 text-primary" />
                        Freeze Account
                    </CardTitle>
                    <CardDescription>Temporarily freeze all activities in your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <Label htmlFor="freeze-switch" className={cn("font-medium", isAccountFrozen && "text-destructive")}>
                            {isAccountFrozen ? "Account is Frozen" : "Freeze My Account"}
                        </Label>
                        <Dialog open={isAccountFrozen && !isUnfreezeDialogOpen} onOpenChange={() => {
                            if (!isAccountFrozen) {
                                setIsAccountFrozen(true);
                                toast({ title: 'Account Frozen', description: 'All activities have been temporarily suspended.', variant: 'destructive' });
                            } else {
                                setIsUnfreezeDialogOpen(true);
                            }
                        }}>
                             <Switch
                                id="freeze-switch"
                                checked={isAccountFrozen}
                                onCheckedChange={(checked) => {
                                    if(checked) {
                                         setIsAccountFrozen(true);
                                         toast({ title: 'Account Frozen', description: 'All activities have been temporarily suspended.', variant: 'destructive' });
                                    } else {
                                        setIsUnfreezeDialogOpen(true);
                                    }
                                }}
                            />
                        </Dialog>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Power className="h-5 w-5 text-primary" />
                        Feature Controls
                    </CardTitle>
                    <CardDescription>Enable or disable specific account features.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="trading-switch">Trading Account</Label>
                        <Switch id="trading-switch" checked={tradingEnabled} onCheckedChange={setTradingEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="demat-switch">Demat Account</Label>
                        <Switch id="demat-switch" checked={dematEnabled} onCheckedChange={setDematEnabled} />
                    </div>
                     <div className="flex items-center justify-between">
                        <Label htmlFor="crypto-switch">Crypto Account</Label>
                        <Switch id="crypto-switch" checked={cryptoEnabled} onCheckedChange={setCryptoEnabled} />
                    </div>
                </CardContent>
            </Card>
            
            <Card className="border-destructive">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                        <Trash2 className="h-5 w-5" />
                        Delete Account
                    </CardTitle>
                    <CardDescription>Permanently delete your account and all associated data. This action is irreversible.</CardDescription>
                </CardHeader>
                 <CardContent>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">Delete My Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => toast({ title: 'Account Deletion Initiated (Mock)', description: 'Your account is scheduled for deletion.', variant: 'destructive'})}
                            >
                                Continue
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                 </CardContent>
            </Card>
        </main>
         <Dialog open={isUnfreezeDialogOpen} onOpenChange={setIsUnfreezeDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Unfreeze Account</DialogTitle>
                    <DialogDescription>To unfreeze your account, please verify your identity.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {!otpSent ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="pan">PAN Number</Label>
                                <Input id="pan" placeholder="Enter your PAN" value={pan} onChange={e => setPan(e.target.value.toUpperCase())} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobile">Registered Mobile</Label>
                                <Input id="mobile" placeholder="Enter your mobile number" value={mobile} onChange={e => setMobile(e.target.value)} />
                            </div>
                             <Button className="w-full" onClick={() => {
                                 setOtpSent(true);
                                 toast({ title: 'OTP Sent', description: 'An OTP has been sent to your mobile number.' });
                             }} disabled={!pan || !mobile}>Generate OTP</Button>
                        </>
                    ) : (
                         <>
                            <p className="text-sm text-center text-muted-foreground">An OTP has been sent to +91 ******{mobile.slice(-4)}</p>
                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter OTP</Label>
                                <Input id="otp" placeholder="6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
                            </div>
                             <Button className="w-full" onClick={handleUnfreezeSubmit} disabled={!otp}>Verify & Unfreeze</Button>
                             <Button variant="link" className="text-xs" onClick={() => setOtpSent(false)}>Back</Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
