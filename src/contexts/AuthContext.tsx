
"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, type User as FirebaseUser } from 'firebase/auth';
import { initializeFirebase } from '@/firebase/index';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRealMode: boolean;
  login: () => void;
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
    const { auth } = initializeFirebase();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || 'no-email@sim.app',
          name: firebaseUser.displayName || 'Anonymous User'
        };
        setUser(appUser);
        localStorage.setItem('simUser', JSON.stringify(appUser));
      } else {
        setUser(null);
        localStorage.removeItem('simUser');
      }
      setLoading(false);
    });

    try {
      const storedTheme = localStorage.getItem('sim-theme') || 'blue';
      setThemeState(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
      
      const storedLanguage = localStorage.getItem('sim-language') || 'english';
      setLanguageState(storedLanguage);
      
      const storedPrimaryWallet = localStorage.getItem('simPrimaryWalletId');
      if (storedPrimaryWallet) {
        setPrimaryWalletIdState(storedPrimaryWallet);
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
    }
    
    return () => unsubscribe();
  }, []);

  const login = async () => {
    const { auth } = initializeFirebase();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user state
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const logout = async () => {
    const { auth } = initializeFirebase();
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting the user state to null
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
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

  const isRealMode = user?.id === 'REAL456'; // This might need to be re-evaluated

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
