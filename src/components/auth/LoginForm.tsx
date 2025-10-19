
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, Loader2, Code } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const GoogleIcon = () => (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,34.464,44,28.864,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const AppleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.01,16.09c-1.6,0-1.89-1.02-3.43-1.02s-2,1-3.41,1c-1.54,0-2.88-1.09-3.79-2.61c-1.3-2.14-1.09-4.83,0.4-6.84 c0.77-1.04,1.86-1.7,3.06-1.7c1.48,0,2.1,0.91,3.48,0.91c1.33,0,1.94-0.91,3.43-0.91c1.11,0,2.15,0.59,2.88,1.52 c-1.7,1.06-2.73,2.7-2.73,4.52c0,2.02,1.31,3.21,2.95,4.19c-0.89,1.4-1.9,2.23-3.27,2.23C13.25,18.3,12.91,18.3,12.01,16.09z M14.65,4.01C14.07,3.06,13.06,2.5,11.95,2.5c-1.5,0-2.83,0.96-3.6,2.44C9,5.89,9.97,6.5,11.16,6.5c1.55,0,2.78-0.98,3.49-2.49z"/>
  </svg>
);

const DeveloperLoginDialog = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
    const { login } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('simulation');
    const [ucc, setUcc] = useState('DEMO123');
    const [pin, setPin] = useState('1234');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setUcc(value === 'simulation' ? 'DEMO123' : 'REAL456');
        setPin('1234');
    };

    const handleDevLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(ucc, pin);
            toast({
                title: "Developer Sign-In Successful",
                description: `You have successfully signed in as ${ucc}.`,
            });
            onLoginSuccess();
        } catch (error: any) {
             toast({
                title: "Sign-In Error",
                description: error.message || "Invalid UCC or PIN.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Developer Login</DialogTitle>
                <DialogDescription>
                    Use mock credentials to sign in to a simulation or real account.
                </DialogDescription>
            </DialogHeader>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="simulation">Simulation</TabsTrigger>
                    <TabsTrigger value="real">Real</TabsTrigger>
                </TabsList>
                <form onSubmit={handleDevLogin}>
                    <TabsContent value="simulation" className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="ucc-sim">UCC</Label>
                            <Input id="ucc-sim" type="text" placeholder="e.g. DEMO123" value={ucc} onChange={(e) => setUcc(e.target.value)} maxLength={7} />
                        </div>
                        <div>
                            <Label htmlFor="pin-sim">PIN</Label>
                            <Input id="pin-sim" type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} />
                        </div>
                    </TabsContent>
                    <TabsContent value="real" className="space-y-4 pt-4">
                       <div>
                            <Label htmlFor="ucc-real">UCC</Label>
                            <Input id="ucc-real" type="text" placeholder="e.g. REAL456" value={ucc} onChange={(e) => setUcc(e.target.value)} maxLength={7} />
                        </div>
                        <div>
                            <Label htmlFor="pin-real">PIN</Label>
                            <Input id="pin-real" type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} />
                        </div>
                    </TabsContent>
                    <DialogFooter className="pt-4">
                         <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Login
                        </Button>
                    </DialogFooter>
                </form>
            </Tabs>
        </DialogContent>
    );
};

export function LoginForm() {
  const { signInWithGoogle, signInWithApple, signInWithEmail, signInWithPhone } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<null | 'google' | 'apple' | 'email' | 'phone'>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDevLoginOpen, setIsDevLoginOpen] = useState(false);

  const handleFirebaseAuth = async (provider: 'google' | 'apple' | 'email' | 'phone') => {
    setIsLoading(provider);
    try {
      if (provider === 'google') await signInWithGoogle();
      else if (provider === 'apple') await signInWithApple();
      else if (provider === 'email') await signInWithEmail(email, password);
      else if (provider === 'phone') await signInWithPhone();
      
      toast({
        title: "Sign-In Successful",
        description: `You have successfully signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`,
      });
      // The redirect will be handled by the login page's useEffect
    } catch (error: any) {
      console.error(`${provider} Sign-In failed:`, error);
      toast({
        title: "Sign-In Error",
        description: error.message || `Failed to sign in with ${provider}. Please try again.`,
        variant: "destructive",
      });
    } finally {
        setIsLoading(null);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Please enter both email and password.', variant: 'destructive'});
      return;
    }
    handleFirebaseAuth('email');
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <CardTitle className="text-3xl font-headline">Welcome to SIM</CardTitle>
        <CardDescription>Sign in to access your dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button onClick={() => handleFirebaseAuth('google')} variant="outline" className="w-full text-lg py-6" disabled={isLoading !== null}>
              {isLoading === 'google' ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <GoogleIcon />}
               Google
          </Button>
          <Button onClick={() => handleFirebaseAuth('apple')} variant="outline" className="w-full text-lg py-6 bg-black text-white hover:bg-black/80 hover:text-white" disabled={isLoading !== null}>
            {isLoading === 'apple' ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <AppleIcon />}
             Apple
          </Button>
        </div>
        
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="email"><Mail className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading !== null} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading !== null} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading !== null}>
                {isLoading === 'email' && <Loader2 className="mr-2 h-5 w-5 animate-spin"/>}
                Sign In with Email
            </Button>
        </form>

        <Separator />
        
         <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={() => handleFirebaseAuth('phone')}>
                {isLoading === 'phone' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Phone className="mr-2 h-4 w-4"/>}
                Sign in with Phone
            </Button>
        </div>
        
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center text-sm">
        <p className="text-muted-foreground text-center">
          By continuing, you agree to our{' '}
          <Link href="#" className="text-primary hover:underline font-semibold" onClick={(e) => { e.preventDefault(); alert('Terms of Service page coming soon!'); }}>
            Terms of Service
          </Link>
          .
        </p>
         <Separator className="my-4" />
        <Dialog open={isDevLoginOpen} onOpenChange={setIsDevLoginOpen}>
          <DialogTrigger asChild>
            <Button variant="link" className="text-muted-foreground text-xs"><Code className="mr-2 h-4 w-4" />Developer Login</Button>
          </DialogTrigger>
          <DeveloperLoginDialog onLoginSuccess={() => setIsDevLoginOpen(false)} />
        </Dialog>
      </CardFooter>
    </Card>
  );
}
