
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      await login();
      toast({
        title: "Login Successful",
        description: "You have successfully signed in with Google.",
      });
      // The redirect will be handled by the login page's useEffect
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const GoogleIcon = () => (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.039C35.536 8.91 30.092 6 24 6C13.438 6 5 14.438 5 25s8.438 19 19 19s19-8.438 19-19c0-1.052-.115-2.078-.323-3.083z" />
      <path fill="#FF3D00" d="M6.306 14.691L12.55 19.165C13.899 15.602 16.65 13 20 13c1.945 0 3.728.694 5.106 1.839l5.437-5.437C28.243 5.437 24 2.5 17.5 2.5c-5.83 0-10.938 2.846-14.194 7.191z" />
      <path fill="#4CAF50" d="M19 45.4c5.83 0 10.938-2.846 14.194-7.191l-5.437-5.437c-1.378 1.145-3.161 1.839-5.106 1.839-3.35 0-6.101-2.602-7.45-6.165L5.306 33.309C8.562 40.563 15 45.4 19 45.4z" />
      <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.087 5.571l5.437 5.437c3.26-3.083 5.353-7.51 5.353-12.917C44 21.052 43.885 20.078 43.611 20.083z" />
    </svg>
  );


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
        <Button onClick={handleLogin} variant="outline" className="w-full text-lg py-6 mt-2">
            <GoogleIcon />
            Sign in with Google
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
