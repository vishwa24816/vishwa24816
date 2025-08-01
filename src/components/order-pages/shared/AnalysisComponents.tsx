
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bitcoin, ChevronRight, TrendingUp, ArrowUp, ArrowDown, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';


const SentimentGauge = () => {
    const sentimentValue = 75; // "Slightly Bullish" on a scale of 0-100
    const rotation = (sentimentValue / 100) * 180 - 90;

    return (
        <Card className="w-full max-w-sm mx-auto shadow-lg overflow-hidden">
            <CardContent className="p-6 relative">
                <div className="relative h-20 w-40 mx-auto">
                    <div className="absolute inset-0 w-full h-full overflow-hidden rounded-t-full">
                        <div className="absolute w-full h-[200%] top-0 left-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
                    </div>
                     <div className="absolute inset-0 w-full h-full flex items-end justify-center">
                        <div
                            className="w-0.5 h-16 bg-black rounded-t-full origin-bottom transition-transform duration-500"
                            style={{ transform: `rotate(${rotation}deg)` }}
                        ></div>
                    </div>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-background rounded-t-full"></div>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full transform -translate-y-1/2"></div>
                </div>
                 <div className="flex justify-between text-xs font-medium text-muted-foreground px-2 -mt-4">
                    <span>Bearish</span>
                    <span>Neutral</span>
                    <span>Bullish</span>
                </div>

                <div className="text-center mt-4">
                    <p className="text-lg font-bold text-green-600">SLIGHTLY BULLISH</p>
                </div>
                 <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" size="sm" className="rounded-full">12 Hrs</Button>
                    <Button variant="secondary" size="sm" className="rounded-full">24 Hrs</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Weekly</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Monthly</Button>
                </div>
            </CardContent>
        </Card>
    );
};

const AnalysisCard: React.FC<{
    title: string;
    badgeText: string;
    badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'green' | 'red' | 'yellow';
    mainValue: React.ReactNode;
    icon?: React.ReactNode;
    footerText: string;
}> = ({ title, badgeText, badgeVariant = 'secondary', mainValue, icon, footerText }) => {
    const badgeColorClasses = {
        green: 'bg-green-100 text-green-800 border-green-200',
        red: 'bg-red-100 text-red-800 border-red-200',
        yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    
    return (
    <Card className="shadow-lg h-full">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm text-muted-foreground">{title}</h4>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <Badge variant="outline" className={cn(badgeVariant in badgeColorClasses && badgeColorClasses[badgeVariant as keyof typeof badgeColorClasses])}>{badgeText}</Badge>
            <div className="flex justify-between items-center mt-3">
                <div className="text-4xl font-bold text-foreground">
                    {mainValue}
                </div>
                {icon}
            </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{footerText}</p>
      </CardContent>
    </Card>
)};


const NewsSentimentCard: React.FC = () => {
    return (
        <Card className="shadow-lg h-full">
            <CardContent className="p-4 flex flex-col justify-between h-full">
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">News Sentiment</h4>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Promising</Badge>
                     <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span>Positive</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800"><ArrowUp className="h-3 w-3 mr-1" /> 61.3%</Badge>
                        </div>
                         <div className="flex justify-between items-center">
                            <span>Negative</span>
                            <Badge variant="outline" className="bg-red-100 text-red-800"><ArrowDown className="h-3 w-3 mr-1" /> 21.1%</Badge>
                        </div>
                         <div className="flex justify-between items-center">
                            <span>Neutral</span>
                             <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><Circle className="h-3 w-3 mr-1" /> 17.6%</Badge>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">24 Hrs</p>
            </CardContent>
        </Card>
    );
};

const CoinFundamentalCard: React.FC = () => (
    <Card className="shadow-lg">
      <CardContent className="p-4 space-y-3">
        <h4 className="font-semibold text-sm text-muted-foreground">Coin Fundamental</h4>
        <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <Bitcoin className="h-4 w-4"/>
            <span>About Coin</span>
             <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
        </div>
        <div className="space-y-1">
            <p className="text-3xl font-bold">#1 <span className="text-base font-medium text-muted-foreground ml-1">Market Cap Rank</span></p>
        </div>
        <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Market Cap : </span><span className="font-semibold">2.37T</span></p>
            <p><span className="text-muted-foreground">Circulating Supply : </span><span className="font-semibold">19.9M</span></p>
        </div>
        <div>
            <p className="font-semibold text-sm mb-1">Category</p>
            <Badge>Payment Currency</Badge>
            <p className="text-xs text-muted-foreground mt-1">The Bitcoin is widely accepted as a Payment Currency</p>
        </div>
      </CardContent>
    </Card>
);

const BullIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm4.58 6.59L15 12l1.58 1.41L18 12l-1.42-1.41zM9 12l-1.58-1.41L6 12l1.42 1.41L9 12zm3 6c-2.21 0-4-1.79-4-4h8c0 2.21-1.79 4-4 4z"/>
    </svg>
);


export const AnalysisTabContent: React.FC = () => {
    return (
        <div className="p-4 space-y-6">
            <SentimentGauge />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnalysisCard 
                    title="Tech Analysis" 
                    badgeText="Bullish" 
                    badgeVariant="green"
                    mainValue={<>75<span className="text-2xl">%</span></>}
                    icon={<TrendingUp className="h-16 w-16 text-green-500 opacity-50" />}
                    footerText="24 Hrs"
                />
                 <NewsSentimentCard />
            </div>
            <CoinFundamentalCard />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <AnalysisCard 
                    title="Industry Factor" 
                    badgeText="Bullish"
                    badgeVariant="green"
                    mainValue={<div className="text-2xl">36.3K<p className="text-xs font-normal flex items-center text-green-500"><ArrowUp className="h-3 w-3 mr-1"/>3.35K</p></div>}
                    footerText="Total News"
                />
                 <AnalysisCard 
                    title="Popularity Index" 
                    badgeText="Neutral"
                    badgeVariant="yellow"
                    mainValue={"#1"}
                    footerText="News Rank"
                />
            </div>
        </div>
    );
};
