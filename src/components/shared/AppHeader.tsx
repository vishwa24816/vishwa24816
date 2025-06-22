
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sun,
  Moon,
  User, 
  Menu,
  LogOut,
  Home as HomeIcon,
  Info as InfoIcon,
  TrendingUp,
  Trophy,
  LifeBuoy,
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
import { useToast } from '@/hooks/use-toast';

interface AppHeaderProps {
  searchMode: 'Exchange' | 'Web3';
  onSearchModeChange: (mode: 'Exchange' | 'Web3') => void;
}

export function AppHeader({ searchMode, onSearchModeChange }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const isRealMode = user?.id === 'REAL456';

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('sim-theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
        // Set default theme if nothing is stored
        document.documentElement.classList.remove('dark'); // Default to light
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
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      alert(`Searching for: ${searchTerm}`);
      // Implement actual search logic here
    }
  };

  const handleSearchModeToggle = () => {
    const newMode = searchMode === 'Exchange' ? 'Web3' : 'Exchange';
    onSearchModeChange(newMode);
    toast({
      title: 'Search Mode Switched',
      description: `Now searching within ${newMode}.`,
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  const searchPlaceholder = isRealMode ? `Search ${searchMode}...` : "Search stocks, mutual funds, crypto...";
  const searchAriaLabel = isRealMode ? `Search ${searchMode}` : "Search stocks, mutual funds, crypto";

  if (!isMounted) {
    return (
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="h-9 w-9 bg-primary-foreground/10 rounded-md animate-pulse"></div>
            <div className="h-9 w-40 md:w-64 bg-primary-foreground/10 rounded-md animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="h-9 w-9 bg-primary-foreground/10 rounded-md animate-pulse"></div>
            <div className="h-9 w-9 bg-primary-foreground/10 rounded-md animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Menu and Search */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10 text-accent shrink-0">
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
                    onClick={() => alert('Stocks Challenge feature coming soon!')}
                  >
                    <Trophy className="mr-3 h-5 w-5 text-primary" />
                    Stocks Challenge
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
                  {theme === 'light' ? <Moon className="mr-3 h-5 w-5 text-primary" /> : <Sun className="mr-3 h-5 w-5 text-primary" />}
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

          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearchSubmit} className="flex items-center relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent pointer-events-none" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="bg-primary-foreground/10 border-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-0 text-primary-foreground placeholder:text-primary-foreground/70 h-9 pl-10 pr-3 rounded-md w-40 md:w-64 transition-all duration-300 focus:w-48 md:focus:w-72"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={searchAriaLabel}
              />
            </form>

            {isRealMode && (
              <Button
                variant="ghost"
                className="h-9 px-3 hover:bg-primary-foreground/20 text-accent shrink-0"
                onClick={handleSearchModeToggle}
              >
                <Repeat className="h-4 w-4 mr-2" />
                {searchMode}
              </Button>
            )}
          </div>
        </div>

        {/* Right Section: Profile */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/profile')} className="hover:bg-primary-foreground/10 text-accent shrink-0">
            <User className="h-5 w-5" />
            <span className="sr-only">Open profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
