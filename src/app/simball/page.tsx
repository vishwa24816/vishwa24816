
"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const FireCard = ({
  tradeType,
  stockSymbol,
  quantity,
  time,
  gradientFrom,
  gradientTo,
  brokerage,
  isPlayed,
}: {
  tradeType: 'BUY' | 'SELL';
  stockSymbol: string;
  quantity: number;
  time: string;
  gradientFrom: string;
  gradientTo: string;
  brokerage: number;
  isPlayed: boolean;
}) => (
  <div
    className={cn(
      "rounded-2xl p-6 text-white h-52 flex flex-col justify-between relative overflow-hidden",
      `bg-gradient-to-br ${gradientFrom} ${gradientTo}`
    )}
  >
    <div className="relative z-10">
       <p className={cn("text-sm opacity-90 flex items-center", tradeType === 'BUY' ? 'text-green-300' : 'text-red-300')}>
         {tradeType === 'BUY' ? <TrendingUp className="w-4 h-4 mr-1.5" /> : <TrendingDown className="w-4 h-4 mr-1.5" />}
        {tradeType}
      </p>
      <p className="text-2xl font-bold mt-1">{stockSymbol}</p>
      <p className="text-lg opacity-90">{quantity} Shares</p>
    </div>
    <div className="relative z-10">
        <div className="text-sm opacity-90 mb-2">
            <span>{isPlayed ? 'Brokerage earned back' : 'Brokerage to be earned back'}: <span className="font-bold">₹{brokerage.toFixed(2)}</span></span>
        </div>
        <div className="flex items-center text-sm opacity-90">
            <Clock className="w-4 h-4 mr-1.5" />
            <span>{time}</span>
        </div>
    </div>
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
                    <p className="text-lg mt-1 opacity-90">with ₹59,000 P&L</p>
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
                <h3 className="text-xl font-semibold mb-4">Games to be played</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FireCard 
                        tradeType="BUY"
                        stockSymbol="RELIANCE"
                        quantity={50}
                        time="3 days ago"
                        gradientFrom="from-green-500"
                        gradientTo="to-emerald-600"
                        brokerage={20.00}
                        isPlayed={false}
                    />
                     <FireCard 
                        tradeType="SELL"
                        stockSymbol="TATAMOTORS"
                        quantity={100}
                        time="2 days ago"
                        gradientFrom="from-red-500"
                        gradientTo="to-rose-600"
                        brokerage={40.00}
                        isPlayed={false}
                    />
                    <FireCard 
                        tradeType="BUY"
                        stockSymbol="INFY"
                        quantity={75}
                        time="1 day ago"
                        gradientFrom="from-blue-500"
                        gradientTo="to-cyan-600"
                        brokerage={30.00}
                        isPlayed={false}
                    />
                </div>
            </div>
            
            <div>
                <h3 className="text-xl font-semibold mb-4 mt-8">Games played</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FireCard 
                        tradeType="BUY"
                        stockSymbol="BTC"
                        quantity={0.5}
                        time="8 hours ago"
                        gradientFrom="from-gray-500"
                        gradientTo="to-gray-600"
                        brokerage={50.00}
                        isPlayed={true}
                    />
                    <FireCard 
                        tradeType="SELL"
                        stockSymbol="ETH"
                        quantity={5}
                        time="2 hours ago"
                        gradientFrom="from-gray-500"
                        gradientTo="to-gray-600"
                        brokerage={80.00}
                        isPlayed={true}
                    />
                </div>
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
