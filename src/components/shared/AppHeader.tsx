
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
  QrCode,
} from 'lucide-react';

export function AppHeader() {
  const { logout } = useAuth();
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

  if (!isMounted) {
    return (
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex h-20 items-center justify-end px-4 sm:px-6 lg:px-8">
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
      <div className="container mx-auto flex h-20 items-center justify-end px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2">
          
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-primary-foreground/10 text-accent shrink-0">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={() => alert('UPI Scanner clicked!')} className="hover:bg-primary-foreground/10 text-accent shrink-0">
            <QrCode className="h-5 w-5" />
            <span className="sr-only">UPI Scanner</span>
          </Button>
          
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent pointer-events-none" />
            <Input
              type="search"
              placeholder="Search stocks, mutual funds, crypto..."
              className="bg-primary-foreground/10 border-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-0 text-primary-foreground placeholder:text-primary-foreground/70 h-9 pl-10 pr-3 rounded-md w-40 md:w-64 transition-all duration-300 focus:w-48 md:focus:w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search stocks, mutual funds, crypto"
            />
          </form>
          
        </div>
      </div>
    </header>
  );
}

