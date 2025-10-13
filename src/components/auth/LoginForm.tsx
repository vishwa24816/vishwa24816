
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, UserCheck, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

export function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [ucc, setUcc] = useState('DEMO123');
  const [pin, setPin] = useState('1234');
  const [activeTab, setActiveTab] = useState<'sim' | 'real'>('sim');

  useEffect(() => {
    if (activeTab === 'sim') {
      setUcc('DEMO123');
      setPin('1234');
    } else {
      setUcc('REAL456');
      setPin('1234');
    }
  }, [activeTab]);


  const handleLogin = () => {
    if (!ucc) {
      toast({
        title: "Login Error",
        description: "Please enter your UCC.",
        variant: "destructive",
      });
      return;
    }
    if (!pin || pin.length !== 4) {
      toast({
        title: "Login Error",
        description: "Please enter your 4-digit PIN.",
        variant: "destructive",
      });
      return;
    }
    
    login(ucc, pin);
  };
  
  const handleUccChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 7) {
      setUcc(value);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 4) {
      setPin(value);
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
        <CardDescription>Sign in to access your dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="sim" value={activeTab} onValueChange={(v) => setActiveTab(v as 'sim' | 'real')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sim" className="flex items-center gap-2"><UserCircle className="h-4 w-4" />Simulation</TabsTrigger>
                <TabsTrigger value="real" className="flex items-center gap-2"><UserCheck className="h-4 w-4" />Real</TabsTrigger>
            </TabsList>
            <div className="pt-6 space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="ucc">UCC (Client Code)</Label>
                    <Input 
                        id="ucc" 
                        type="text" 
                        placeholder={activeTab === 'sim' ? 'e.g. DEMO123' : 'Enter Real UCC'}
                        value={ucc}
                        onChange={handleUccChange}
                        maxLength={7}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pin">4-Digit PIN</Label>
                    <Input 
                        id="pin" 
                        type="password"
                        value={pin}
                        onChange={handlePinChange}
                        maxLength={4}
                        pattern="\d{4}"
                    />
                </div>
            </div>
        </Tabs>
        
        <Button onClick={handleLogin} className="w-full text-lg py-6 mt-2">
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
        </Button>
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
