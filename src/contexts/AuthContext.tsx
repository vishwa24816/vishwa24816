
"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import { initializeFirebase } from '@/firebase';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, type User as FirebaseUser } from 'firebase/auth';
import { mockWallets } from '@/lib/mockData/wallets';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRealMode: boolean;
  login: () => Promise<void>; // Updated login function
  logout: () => Promise<void>; // Updated logout function
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

  const { auth } = initializeFirebase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser: User = {
          id: firebaseUser.uid,
          ucc: firebaseUser.uid.slice(0, 7).toUpperCase(), // Create a mock UCC
          email: firebaseUser.email || 'no-email@example.com',
          name: firebaseUser.displayName || 'Anonymous User',
        };
        setUser(appUser);
        localStorage.setItem('simUser', JSON.stringify(appUser));
      } else {
        setUser(null);
        localStorage.removeItem('simUser');
      }
      setLoading(false);
    });

    // Other localStorage initializations
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


    return () => unsubscribe();
  }, [auth]);

  const login = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will handle removing the user
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
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

  // The concept of "real mode" might change. For now, we can base it on a specific user ID or remove it.
  // Let's assume for now it's not a feature.
  const isRealMode = false; // Simplified for Firebase auth

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
