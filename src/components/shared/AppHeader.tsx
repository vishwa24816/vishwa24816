
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  UserCircle,
  Briefcase,
  Menu,
  Search,
  Sun,
  Moon,
  QrCode,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('sim-theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Prevent applying theme on server or before hydration
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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      alert(`Searching for: ${searchTerm}`);
      // Implement actual search logic here
    }
  };

  if (!isMounted) {
    // Render a placeholder or simplified header during server render / pre-hydration
    // to avoid hydration mismatches related to theme.
    return (
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 mr-3 text-accent" />
            <h1 className="text-2xl sm:text-3xl font-headline font-semibold tracking-tight">
              SIM Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="h-9 w-9 bg-primary-foreground/10 rounded-md animate-pulse"></div>
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
        <div className="flex items-center">
          <Briefcase className="h-8 w-8 mr-3 text-accent" />
          <h1 className="text-2xl sm:text-3xl font-headline font-semibold tracking-tight">
            SIM Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent pointer-events-none" />
            <Input
              type="search"
              placeholder="Search stocks..."
              className="bg-primary-foreground/10 border-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-0 text-primary-foreground placeholder:text-primary-foreground/70 h-9 pl-10 pr-3 rounded-md w-40 md:w-64 transition-all duration-300 focus:w-48 md:focus:w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search stocks"
            />
          </form>

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-primary-foreground/10 text-accent shrink-0">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={() => alert('UPI Scanner clicked!')} className="hover:bg-primary-foreground/10 text-accent shrink-0">
            <QrCode className="h-5 w-5" />
            <span className="sr-only">UPI Scanner</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10 text-accent shrink-0">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="sm:hidden px-2 pt-2 pb-1">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-md bg-background pl-9 pr-3 h-10 border border-input text-foreground placeholder:text-muted-foreground"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search"
                  />
                </form>
              </div>
              <DropdownMenuSeparator className="sm:hidden" />
              
              {user && (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3 py-1">
                       <UserCircle className="h-8 w-8 text-muted-foreground" />
                       <div className="flex flex-col">
                          <p className="text-sm font-medium leading-none text-foreground">
                            {user.name || user.email.split('@')[0]}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                       </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem onClick={() => router.push('/')}>
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Settings clicked!')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
