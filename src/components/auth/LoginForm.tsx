
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { KeyRound, User, LogIn } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DEMO_CREDENTIALS = { ucc: 'DEMO123', mpin: '1234' };
const REAL_CREDENTIALS = { ucc: 'REAL456', mpin: '5678' };

export function LoginForm() {
  const [loginMode, setLoginMode] = useState<'demo' | 'real'>('demo');
  const [ucc, setUcc] = useState(DEMO_CREDENTIALS.ucc);
  const [mpin, setMpin] = useState(DEMO_CREDENTIALS.mpin);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleModeChange = (mode: string) => {
    setError('');
    const newMode = mode as 'demo' | 'real';
    setLoginMode(newMode);
    if (newMode === 'demo') {
      setUcc(DEMO_CREDENTIALS.ucc);
      setMpin(DEMO_CREDENTIALS.mpin);
    } else {
      setUcc(REAL_CREDENTIALS.ucc);
      setMpin(REAL_CREDENTIALS.mpin);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const credentials = loginMode === 'demo' ? DEMO_CREDENTIALS : REAL_CREDENTIALS;

    if (ucc === credentials.ucc && mpin === credentials.mpin) {
      login({ id: ucc, email: `${ucc}@sim.app` }); // Mock user object
      router.push('/');
    } else {
      setError('Invalid UCC or MPIN. Please try again.');
    }
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
        <CardDescription>Sign in to access your stock information dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={loginMode} onValueChange={handleModeChange} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Demo Account</TabsTrigger>
            <TabsTrigger value="real">Real Account</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ucc">UCC (Unique Client Code)</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="ucc"
                type="text"
                placeholder="Enter your UCC"
                value={ucc}
                onChange={(e) => setUcc(e.target.value.toUpperCase())}
                required
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mpin">4-Digit MPIN</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="mpin"
                type="password"
                placeholder="••••"
                value={mpin}
                onChange={(e) => setMpin(e.target.value)}
                required
                maxLength={4}
                className="pl-10"
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full text-lg py-6">
            <LogIn className="mr-2 h-5 w-5" /> Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <p className="text-muted-foreground">
          Don't have an account?{' '}
          <Link href="#" className="text-primary hover:underline font-semibold" onClick={(e) => { e.preventDefault(); alert('Sign up feature coming soon!'); }}>
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
