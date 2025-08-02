
"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
  theme: string;
  setTheme: (theme: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState('blue');
  const [language, setLanguageState] = useState('english');

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

    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      localStorage.removeItem('simUser');
      localStorage.removeItem('sim-theme');
      localStorage.removeItem('sim-language');
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('simUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('simUser');
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading, theme, setTheme, language, setLanguage }}>
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
