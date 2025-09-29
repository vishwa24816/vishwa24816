
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

const DEMO_CREDENTIALS = { ucc: 'DEMO123', mpin: '1234', name: 'Demo User' };
const REAL_CREDENTIALS = { ucc: 'REAL456', mpin: '5678', name: 'Real User' };

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  
  // State for Demo Form
  const [demoUcc, setDemoUcc] = useState(DEMO_CREDENTIALS.ucc);
  const [demoMpin, setDemoMpin] = useState(DEMO_CREDENTIALS.mpin);
  const [demoError, setDemoError] = useState('');

  // State for Real Form
  const [realUcc, setRealUcc] = useState('');
  const [realMpin, setRealMpin] = useState('');
  const [realError, setRealError] = useState('');

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoError('');
    if (demoUcc === DEMO_CREDENTIALS.ucc && demoMpin === DEMO_CREDENTIALS.mpin) {
      login({ id: demoUcc, email: `${demoUcc}@sim.app`, name: DEMO_CREDENTIALS.name });
      router.push('/');
    } else {
      setDemoError('Invalid Simulation UCC or MPIN.');
    }
  };

  const handleRealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRealError('');
    if (realUcc === REAL_CREDENTIALS.ucc && realMpin === REAL_CREDENTIALS.mpin) {
      login({ id: realUcc, email: `${realUcc}@sim.app`, name: REAL_CREDENTIALS.name });
      router.push('/');
    } else {
      setRealError('Invalid Real Account UCC or MPIN.');
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
        <CardDescription>Sign in to access your stock simulation dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Simulation Account</TabsTrigger>
            <TabsTrigger value="real">Real Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo" className="pt-6">
            <form onSubmit={handleDemoSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="demo_ucc">UCC (Unique Client Code)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="demo_ucc"
                    type="text"
                    placeholder="Enter your UCC"
                    value={demoUcc}
                    onChange={(e) => setDemoUcc(e.target.value.toUpperCase())}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="demo_mpin">4-Digit MPIN</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="demo_mpin"
                    type="password"
                    placeholder="••••"
                    value={demoMpin}
                    onChange={(e) => setDemoMpin(e.target.value)}
                    required
                    maxLength={4}
                    className="pl-10"
                  />
                </div>
              </div>
              {demoError && <p className="text-sm text-destructive">{demoError}</p>}
              <Button type="submit" className="w-full text-lg py-6">
                <LogIn className="mr-2 h-5 w-5" /> Sign In to Simulation
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="real" className="pt-6">
            <form onSubmit={handleRealSubmit} className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="real_ucc">UCC (Unique Client Code)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="real_ucc"
                    type="text"
                    placeholder="Enter your UCC"
                    value={realUcc}
                    onChange={(e) => setRealUcc(e.target.value.toUpperCase())}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="real_mpin">4-Digit MPIN</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="real_mpin"
                    type="password"
                    placeholder="••••"
                    value={realMpin}
                    onChange={(e) => setRealMpin(e.target.value)}
                    required
                    maxLength={4}
                    className="pl-10"
                  />
                </div>
              </div>
              {realError && <p className="text-sm text-destructive">{realError}</p>}
              <Button type="submit" className="w-full text-lg py-6">
                <LogIn className="mr-2 h-5 w-5" /> Sign In to Real Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
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
