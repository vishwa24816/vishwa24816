
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
import { Mail, Phone, Loader2 } from 'lucide-react';

export function LoginForm() {
  const { signInWithApple, signInWithEmail } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<null | 'apple' | 'email' | 'phone'>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const AppleIcon = () => (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.01,16.09c-1.6,0-1.89-1.02-3.43-1.02s-2,1-3.41,1c-1.54,0-2.88-1.09-3.79-2.61c-1.3-2.14-1.09-4.83,0.4-6.84 c0.77-1.04,1.86-1.7,3.06-1.7c1.48,0,2.1,0.91,3.48,0.91c1.33,0,1.94-0.91,3.43-0.91c1.11,0,2.15,0.59,2.88,1.52 c-1.7,1.06-2.73,2.7-2.73,4.52c0,2.02,1.31,3.21,2.95,4.19c-0.89,1.4-1.9,2.23-3.27,2.23C13.25,18.3,12.91,18.3,12.01,16.09z M14.65,4.01C14.07,3.06,13.06,2.5,11.95,2.5c-1.5,0-2.83,0.96-3.6,2.44C9,5.89,9.97,6.5,11.16,6.5c1.55,0,2.78-0.98,3.49-2.49z"/>
    </svg>
  );

  const handleAppleLogin = async () => {
    setIsLoading('apple');
    try {
      await signInWithApple();
      toast({
        title: "Sign-In Successful",
        description: "You have successfully signed in with Apple.",
      });
    } catch (error) {
      console.error("Apple Sign-In failed:", error);
      toast({
        title: "Sign-In Error",
        description: "Failed to sign in with Apple. Please try again.",
        variant: "destructive",
      });
    } finally {
        setIsLoading(null);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading('email');
    try {
        await signInWithEmail(email, password);
        toast({
            title: "Sign-In Successful",
            description: "You have successfully signed in.",
        });
    } catch (error: any) {
        toast({
            title: "Sign-In Error",
            description: error.message || "Invalid email or password. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(null);
    }
  }

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
        
        <Button onClick={handleAppleLogin} variant="outline" className="w-full text-lg py-6 mt-2 bg-black text-white hover:bg-black/80 hover:text-white" disabled={isLoading !== null}>
          {isLoading === 'apple' ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <AppleIcon />}
           Sign in with Apple
        </Button>
        
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
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
            <Button variant="outline" className="w-full" disabled>
                <Phone className="mr-2 h-4 w-4"/>
                Sign in with Phone
            </Button>
            <p className="text-center text-xs text-muted-foreground">Phone sign-in coming soon.</p>
        </div>
        
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <p className="text-muted-foreground">
          By continuing, you agree to our{' '}
          <Link href="#" className="text-primary hover:underline font-semibold" onClick={(e) => { e.preventDefault(); alert('Terms of Service page coming soon!'); }}>
            Terms of Service
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  );
}
