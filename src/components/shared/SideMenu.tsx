
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Menu,
  LogOut,
  HomeIcon,
  Info as InfoIcon,
  TrendingUp,
  Trophy,
  LifeBuoy,
  Puzzle,
  Sun,
  Moon,
  Sparkles,
  History,
  FileText,
  Gift,
  Users,
  Repeat,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function SideMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('sim-theme') as 'light' | 'dark' | null;
    const initialTheme = storedTheme || 'light';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sim-theme', theme);
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isMounted) {
    return (
      <div className="h-9 w-9 bg-primary-foreground/10 rounded-md animate-pulse"></div>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary-foreground/10 text-accent shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-xl font-headline text-primary flex items-center">
            SIM Menu
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-1 p-4 flex-grow">
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-base p-3 hover:bg-accent/10"
              onClick={() => router.push('/')}
            >
              <HomeIcon className="mr-3 h-5 w-5 text-primary" />
              Home
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-base p-3 hover:bg-accent/10"
              onClick={() => alert('About page coming soon!')}
            >
              <InfoIcon className="mr-3 h-5 w-5 text-primary" />
              About
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-base p-3 hover:bg-accent/10"
              onClick={() => router.push('/analytics')}
            >
              <TrendingUp className="mr-3 h-5 w-5 text-primary" />
              Analytics
            </Button>
          </SheetClose>
           <SheetClose asChild>
            <Button
                variant="ghost"
                className="justify-start text-base p-3 hover:bg-accent/10"
                onClick={() => router.push('/gift')}
            >
                <Gift className="mr-3 h-5 w-5 text-primary" />
                Gift
            </Button>
          </SheetClose>
           <SheetClose asChild>
            <Button
                variant="ghost"
                className="justify-start text-base p-3 hover:bg-accent/10"
                onClick={() => router.push('/family')}
            >
                <Users className="mr-3 h-5 w-5 text-primary" />
                Family Account
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
                variant="ghost"
                className="justify-start text-base p-3 hover:bg-accent/10"
                onClick={() => router.push('/nocode-algo')}
            >
                <Puzzle className="mr-3 h-5 w-5 text-primary" />
                No-Code Algo
            </Button>
          </SheetClose>
           <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-base p-3 hover:bg-accent/10"
              onClick={() => router.push('/backtester')}
            >
              <History className="mr-3 h-5 w-5 text-primary" />
              Backtester
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-base p-3 hover:bg-accent/10"
              onClick={() => router.push('/simball')}
            >
              <Sparkles className="mr-3 h-5 w-5 text-primary" />
              SIMBALL
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-base p-3 hover:bg-accent/10"
              onClick={() => router.push('/taxy')}
            >
              <FileText className="mr-3 h-5 w-5 text-primary" />
              Taxy
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-base p-3 hover:bg-accent/10"
              onClick={() => router.push('/support')}
            >
              <LifeBuoy className="mr-3 h-5 w-5 text-primary" />
              Support
            </Button>
          </SheetClose>
          <Button
            variant="ghost"
            className="justify-start text-base p-3 hover:bg-accent/10"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="mr-3 h-5 w-5 text-primary" />
            ) : (
              <Sun className="mr-3 h-5 w-5 text-primary" />
            )}
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </nav>
        <div className="p-4 border-t">
          {user && (
            <div className="mb-4 text-sm text-muted-foreground">
              Logged in as: <span className="font-medium text-foreground">{user.email}</span>
            </div>
          )}
          <SheetClose asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-base p-3 text-destructive border-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
