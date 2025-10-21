
"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, TrendingUp, TrendingDown, Trophy, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { DXBallGame } from '@/components/simball/DXBallGame';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FireCard = ({
  tradeType,
  stockSymbol,
  quantity,
  time,
  gradientFrom,
  gradientTo,
  brokerage,
  isPlayed,
  onClick,
}: {
  tradeType: 'BUY' | 'SELL';
  stockSymbol: string;
  quantity: number;
  time: string;
  gradientFrom: string;
  gradientTo: string;
  brokerage: number;
  isPlayed: boolean;
  onClick?: () => void;
}) => (
  <div
    className={cn(
      "rounded-2xl p-6 text-white h-52 flex flex-col justify-between relative overflow-hidden",
      `bg-gradient-to-br ${gradientFrom} ${gradientTo}`,
      !isPlayed && "cursor-pointer hover:scale-105 transition-transform duration-200"
    )}
    onClick={onClick}
  >
    <div className="relative z-10">
       <p className={cn("text-sm opacity-90 flex items-center", tradeType === 'BUY' ? 'text-green-300' : 'text-red-300')}>
         {tradeType === 'BUY' ? <TrendingUp className="w-4 h-4 mr-1.5" /> : <TrendingDown className="w-4 h-4 mr-1.5" />}
        {tradeType}
      </p>
      <p className="text-2xl font-bold mt-1">{stockSymbol}</p>
      <p className="text-lg opacity-90">{quantity} Quantity</p>
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

const leaderboardData = [
    { rank: 1, name: 'Suraj', pnl: 59000, avatar: 'https://placehold.co/100x100.png?text=S' },
    { rank: 2, name: 'Anjali', pnl: 52500, avatar: 'https://placehold.co/100x100.png?text=A' },
    { rank: 3, name: 'Vikram', pnl: 48000, avatar: 'https://placehold.co/100x100.png?text=V' },
    { rank: 4, name: 'Priya', pnl: 45200, avatar: 'https://placehold.co/100x100.png?text=P' },
    { rank: 5, name: 'Rohan', pnl: 41800, avatar: 'https://placehold.co/100x100.png?text=R' },
];

export function SimballPageContent({ onPlayGame }: { onPlayGame: (brokerage: number) => void }) {
    const { user } = useAuth();
    
  return (
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            <h1 className="text-3xl font-bold text-center text-primary">SIMBALL</h1>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="leaderboard" className="border-none">
                     <div className="rounded-2xl p-6 overflow-hidden bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg">
                        <AccordionTrigger className="w-full hover:no-underline p-0">
                             <div className="w-full flex justify-between items-center">
                                <div className="text-left">
                                    <p className="text-sm font-medium opacity-90 flex items-center"><Trophy className="h-4 w-4 mr-2 text-yellow-300"/>Leading this month:</p>
                                    <h2 className="text-4xl font-bold flex items-center">
                                        {leaderboardData[0].name} <span className="text-2xl ml-2">🔥</span>
                                    </h2>
                                    <p className="text-lg mt-1 opacity-90">with ₹{leaderboardData[0].pnl.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center">
                                <Avatar className="h-16 w-16 border-4 border-white/50">
                                    <AvatarImage src={leaderboardData[0].avatar} alt={leaderboardData[0].name} data-ai-hint="profile avatar" />
                                    <AvatarFallback>{leaderboardData[0].name[0]}</AvatarFallback>
                                </Avatar>
                                <ChevronDown className="h-8 w-8 text-white/80 ml-4 transition-transform duration-200" />
                                </div>
                             </div>
                        </AccordionTrigger>
                     </div>
                    <AccordionContent className="bg-slate-700 text-white rounded-b-2xl p-4 -mt-2 space-y-3">
                        {leaderboardData.slice(1).map((player) => (
                             <div key={player.rank} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10">
                                <div className="flex items-center">
                                    <span className="text-lg font-bold w-8 text-center">{player.rank}</span>
                                    <Avatar className="h-10 w-10 ml-2 border-2 border-white/30">
                                        <AvatarImage src={player.avatar} alt={player.name} data-ai-hint="profile avatar" />
                                        <AvatarFallback>{player.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold ml-4">{player.name}</p>
                                </div>
                                <p className="font-bold text-lg">₹{player.pnl.toLocaleString()}</p>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>


            <div>
                <h3 className="text-xl font-semibold mb-4">Games to be played</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FireCard 
                        tradeType="BUY"
                        stockSymbol="BTC"
                        quantity={0.5}
                        time="3 days ago"
                        gradientFrom="from-green-500"
                        gradientTo="to-emerald-600"
                        brokerage={50}
                        isPlayed={false}
                        onClick={() => onPlayGame(50)}
                    />
                     <FireCard 
                        tradeType="SELL"
                        stockSymbol="ETH"
                        quantity={5}
                        time="2 days ago"
                        gradientFrom="from-red-500"
                        gradientTo="to-rose-600"
                        brokerage={80}
                        isPlayed={false}
                        onClick={() => onPlayGame(80)}
                    />
                    <FireCard 
                        tradeType="BUY"
                        stockSymbol="SOL"
                        quantity={10}
                        time="1 day ago"
                        gradientFrom="from-blue-500"
                        gradientTo="to-cyan-600"
                        brokerage={40}
                        isPlayed={false}
                        onClick={() => onPlayGame(40)}
                    />
                </div>
            </div>
            
            <div>
                <h3 className="text-xl font-semibold mb-4 mt-8">Games played</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FireCard 
                        tradeType="BUY"
                        stockSymbol="DOGE"
                        quantity={1000}
                        time="8 hours ago"
                        gradientFrom="from-gray-500"
                        gradientTo="to-gray-600"
                        brokerage={25}
                        isPlayed={true}
                    />
                    <FireCard 
                        tradeType="SELL"
                        stockSymbol="SHIB"
                        quantity={500000}
                        time="2 hours ago"
                        gradientFrom="from-gray-500"
                        gradientTo="to-gray-600"
                        brokerage={35}
                        isPlayed={true}
                    />
                </div>
            </div>
        </main>
  );
}

export default function SimballPage() {
    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <SimballPageContent onPlayGame={() => {}} />
            </div>
        </ProtectedRoute>
    )
}
