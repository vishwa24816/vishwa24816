"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, UserCircle, Briefcase } from 'lucide-react';

export function AppHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Briefcase className="h-8 w-8 mr-3 text-accent" />
          <h1 className="text-2xl sm:text-3xl font-headline font-semibold tracking-tight">
            SIM Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <UserCircle className="h-6 w-6 hidden sm:block" />
              <span className="text-sm font-medium hidden md:block">{user.email}</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-primary-foreground/10 text-primary-foreground">
            <LogOut className="mr-0 sm:mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
