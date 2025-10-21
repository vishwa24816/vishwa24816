
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
  login: (ucc: string, pin: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
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
  const [theme, setThemeState] = useState('system');
  const [language, setLanguageState] = useState('english');
  const [primaryWalletId, setPrimaryWalletIdState] = useState<string | null>(null);

  const { auth } = initializeFirebase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser: User = {
          id: firebaseUser.uid,
          ucc: firebaseUser.uid.slice(0, 7).toUpperCase(), // Create a mock UCC from UID
          email: firebaseUser.email || 'no-email@example.com',
          name: firebaseUser.displayName || 'Firebase User',
        };
        setUser(appUser);
        localStorage.setItem('simUser', JSON.stringify(appUser));
        setLoading(false);
      } else {
        // If no Firebase user, check for mock user in localStorage
        const localUser = localStorage.getItem('simUser');
        if (localUser) {
          try {
            setUser(JSON.parse(localUser));
          } catch(e) {
            setUser(null);
            localStorage.removeItem('simUser');
          }
        } else {
            setUser(null);
        }
        setLoading(false);
      }
    });

    const storedTheme = localStorage.getItem('sim-theme') || 'system';
    setThemeState(storedTheme);
    
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

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const newSystemTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(newSystemTheme);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);


  const login = async (ucc: string, pin: string) => {
    setLoading(true);
    // This is a mock login for the developer flow
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            const normalizedUcc = ucc.toUpperCase();
            if ((normalizedUcc === 'DEMO123' || normalizedUcc === 'REAL456') && pin === '1234') {
                const mockUser: User = {
                    id: normalizedUcc === 'REAL456' ? 'REAL456' : 'DEMO123-USERID',
                    ucc: normalizedUcc,
                    name: normalizedUcc === 'REAL456' ? 'Real User' : 'Demo User',
                    email: `${normalizedUcc.toLowerCase()}@simulation.app`
                };
                setUser(mockUser);
                localStorage.setItem('simUser', JSON.stringify(mockUser));
                setLoading(false);
                resolve();
            } else {
                setLoading(false);
                reject(new Error("Invalid UCC or PIN."));
            }
        }, 1000);
    });
  };
  
  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      throw error;
    } finally {
      // setLoading(false) is handled by onAuthStateChanged
    }
  };

  const signInWithApple = async () => {
    setLoading(true);
    const provider = new OAuthProvider('apple.com');
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Apple sign-in:", error);
      throw error;
    } finally {
       // setLoading(false) is handled by onAuthStateChanged
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
       // setLoading(false) is handled by onAuthStateChanged
    }
  }

  const signInWithPhone = async () => {
    console.log("Phone sign-in process started");
    throw new Error("Phone sign-in is not yet implemented.");
  }

  const logout = async () => {
    setLoading(true);
    try {
      // This will sign out from Firebase. For mock auth, we just clear local storage.
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out from Firebase:", error);
    } finally {
      // This part handles both Firebase and mock logout
      setUser(null);
      localStorage.removeItem('simUser');
      setLoading(false);
    }
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    localStorage.setItem('sim-theme', newTheme);
    setThemeState(newTheme);
  };

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    localStorage.setItem('sim-language', newLanguage);
  };

  const setPrimaryWalletId = (walletId: string) => {
    setPrimaryWalletIdState(walletId);
    localStorage.setItem('simPrimaryWalletId', walletId);
  }
  
  const isRealMode = user?.ucc === 'REAL456'; 

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isRealMode, login, signInWithGoogle, signInWithApple, signInWithEmail, signInWithPhone, logout, loading, theme, setTheme: setTheme as any, language, setLanguage, primaryWalletId, setPrimaryWalletId }}>
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
