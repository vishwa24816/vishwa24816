
"use client";

import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Edit3, Shield, LogOut } from 'lucide-react';
import React, { useState } from 'react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const isRealMode = user?.id === 'REAL456';
  
  const [activeMode, setActiveMode] = useState<'Fiat' | 'Crypto'>(isRealMode ? 'Crypto' : 'Fiat');
  
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <AppHeader 
            isRealMode={isRealMode} 
            activeMode={activeMode} 
            onModeChange={setActiveMode} 
        />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <Card className="w-full max-w-lg shadow-xl">
            <CardHeader className="items-center text-center">
              <Avatar className="h-28 w-28 mb-4 border-2 border-primary p-1">
                <AvatarImage 
                  src={`https://placehold.co/112x112.png?text=${user?.email?.[0].toUpperCase()}`} 
                  alt={user?.email || "User avatar"}
                  data-ai-hint="profile avatar" 
                />
                <AvatarFallback className="text-4xl">
                  {user?.email?.[0].toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl font-headline">{user?.name || "Your Name"}</CardTitle>
              <CardDescription className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                {user?.email || "your.email@example.com"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Edit3 className="mr-2 h-5 w-5 text-primary" /> Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-5 w-5 text-primary" /> Account Security
              </Button>
              <Button onClick={logout} variant="destructive" className="w-full justify-start">
                <LogOut className="mr-2 h-5 w-5" /> Logout
              </Button>
            </CardContent>
            <CardFooter>
              <Link href="/" className="w-full">
                <Button variant="ghost" className="w-full text-primary">Back to Home</Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}

    