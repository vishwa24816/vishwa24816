"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const FireCard = ({
  name,
  amount,
  time,
  gradientFrom,
  gradientTo,
}: {
  name: string;
  amount: number;
  time: string;
  gradientFrom: string;
  gradientTo: string;
}) => (
  <div
    className={cn(
      "rounded-2xl p-6 text-white h-52 flex flex-col justify-between relative overflow-hidden",
      `bg-gradient-to-br ${gradientFrom} ${gradientTo}`
    )}
  >
    <div className="relative z-10">
      <p className="text-sm opacity-90">₹{amount} paid to</p>
      <p className="text-2xl font-bold mt-1">{name}</p>
    </div>
    <div className="relative z-10 flex items-center text-sm opacity-90">
      <Clock className="w-4 h-4 mr-1.5" />
      <span>{time}</span>
    </div>
    {/* Decorative Elements */}
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full opacity-50" />
    <div className="absolute top-10 left-5 w-2 h-2 bg-white/30 rounded-full" />
    <div className="absolute top-20 right-10 w-1 h-1 bg-white/30 rounded-full" />
    <div className="absolute bottom-1/2 left-1/4 text-2xl opacity-20 transform rotate-12">+</div>
  </div>
);


export default function SimballPage() {
    const { user } = useAuth();
    const isRealMode = user?.id === 'REAL456';
  
    const [activeMode, setActiveMode] = useState<'Portfolio' | 'Fiat' | 'Crypto' | 'Web3'>(isRealMode ? 'Crypto' : 'Portfolio');

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <AppHeader
          activeMode={activeMode}
          onModeChange={setActiveMode}
          isRealMode={isRealMode}
        />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            <h1 className="text-3xl font-bold text-center text-primary">SIMBALL</h1>

            <div className="relative rounded-2xl p-6 overflow-hidden bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg">
                <div className="relative z-10">
                    <p className="text-sm font-medium opacity-90">Leading this month:</p>
                    <h2 className="text-4xl font-bold flex items-center">
                        Suraj <span className="text-2xl ml-2">🔥</span>
                    </h2>
                    <p className="text-lg mt-1 opacity-90">with ₹59</p>
                </div>
                <Avatar className="absolute z-10 right-6 top-1/2 -translate-y-1/2 h-16 w-16 border-4 border-white/50">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Suraj" data-ai-hint="profile avatar" />
                    <AvatarFallback>S</AvatarFallback>
                </Avatar>
                {/* Decorative wave */}
                <div className="absolute -bottom-12 -right-10 w-48 h-48 bg-white/20 rounded-full" />
                 <div className="absolute -bottom-8 right-10 w-32 h-32 bg-white/10 rounded-full" />
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">All fires (2)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FireCard 
                        name="Chaluvaraju"
                        amount={28}
                        time="3 days"
                        gradientFrom="from-green-500"
                        gradientTo="to-emerald-600"
                    />
                     <FireCard 
                        name="Vasanth kumar"
                        amount={5}
                        time="2 days"
                        gradientFrom="from-yellow-400"
                        gradientTo="to-amber-500"
                    />
                </div>
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
