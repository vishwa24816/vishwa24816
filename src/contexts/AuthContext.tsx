
"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import { initializeFirebase } from '@/firebase';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, type User as FirebaseUser, OAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { mockWallets } from '@/lib/mockData/wallets';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRealMode: boolean;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithPhone: () => Promise<void>;
  logout: () => Promise<void>;
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

  const signInWithApple = async () => {
    setLoading(true);
    const provider = new OAuthProvider('apple.com');
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Apple sign-in:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Error during email sign-in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const signInWithPhone = async () => {
    // Phone auth requires more UI setup (Recaptcha, OTP input), so this is a placeholder
    console.log("Phone sign-in process started");
  }

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
  
  const isRealMode = false; 

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isRealMode, signInWithApple, signInWithEmail, signInWithPhone, logout, loading, theme, setTheme, language, setLanguage, primaryWalletId, setPrimaryWalletId }}>
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
