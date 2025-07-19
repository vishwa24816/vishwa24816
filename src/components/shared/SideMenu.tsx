"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Menu,
  LogOut,
  Home as HomeIcon,
  Info as InfoIcon,
  TrendingUp,
  Trophy,
  LifeBuoy,
  Puzzle,
  Sun,
  Moon,
  Sparkles,
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
              onClick={() => alert('Advanced Analytics feature coming soon!')}
            >
              <TrendingUp className="mr-3 h-5 w-5 text-primary" />
              Advanced Analytics
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
                variant="ghost"
                className="justify-start text-base p-3 hover:bg-accent/10"
                onClick={() => alert('No-Code Algo feature coming soon!')}
            >
                <Puzzle className="mr-3 h-5 w-5 text-primary" />
                No-Code Algo
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-base p-3 hover:bg-accent/10"
              onClick={() => alert('Challenge feature coming soon!')}
            >
              <Trophy className="mr-3 h-5 w-5 text-primary" />
              Challenge
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-base p-3 hover:bg-accent/10"
              onClick={() => alert('SIMBALL feature coming soon!')}
            >
              <Sparkles className="mr-3 h-5 w-5 text-primary" />
              SIMBALL
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-base p-3 hover:bg-accent/10"
              onClick={() => alert('Support feature coming soon!')}
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
