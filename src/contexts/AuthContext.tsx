
"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import { mockWallets } from '@/lib/mockData/wallets';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRealMode: boolean;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
  theme: string;
  setTheme: (theme: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  primaryWalletId: string | null;
  setPrimaryWalletId: (walletId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState('blue');
  const [language, setLanguageState] = useState('english');
  const [primaryWalletId, setPrimaryWalletIdState] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for a persisted user session
    try {
      const storedUser = localStorage.getItem('simUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const storedTheme = localStorage.getItem('sim-theme') || 'blue';
      setThemeState(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
      
      const storedLanguage = localStorage.getItem('sim-language') || 'english';
      setLanguageState(storedLanguage);
      
      let storedPrimaryWallet = localStorage.getItem('simPrimaryWalletId');
      if (!storedPrimaryWallet && mockWallets.length > 0) {
        storedPrimaryWallet = mockWallets[0].id;
        localStorage.setItem('simPrimaryWalletId', storedPrimaryWallet);
      }
      if (storedPrimaryWallet) {
        setPrimaryWalletIdState(storedPrimaryWallet);
      }

    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      localStorage.clear();
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('simUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('sim-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    localStorage.setItem('sim-language', newLanguage);
  };

  const setPrimaryWalletId = (walletId: string) => {
    setPrimaryWalletIdState(walletId);
    localStorage.setItem('simPrimaryWalletId', walletId);
  }

  const isRealMode = user?.id === 'REAL456';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isRealMode, login, logout, loading, theme, setTheme, language, setLanguage, primaryWalletId, setPrimaryWalletId }}>
        {children}
        <Toaster />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
