
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, Shuffle, Zap, ShieldCheck, Route } from 'lucide-react'; // Added Zap, ShieldCheck, Route
import { useToast } from "@/hooks/use-toast";

interface OptionStrategy {
  id: string;
  name: string;
  description: string;
  type: 'bullish' | 'bearish' | 'neutral' | 'volatile';
  complexity: 'simple' | 'moderate' | 'advanced';
  icon: React.ElementType;
}

const strategies: OptionStrategy[] = [
  {
    id: 'bull-call-spread',
    name: 'Bull Call Spread',
    description: 'Buy a call, sell a higher strike call. Limited profit, limited risk.',
    type: 'bullish',
    complexity: 'simple',
    icon: TrendingUp,
  },
  {
    id: 'bear-put-spread',
    name: 'Bear Put Spread',
    description: 'Buy a put, sell a lower strike put. Limited profit, limited risk.',
    type: 'bearish',
    complexity: 'simple',
    icon: TrendingDown,
  },
  {
    id: 'long-straddle',
    name: 'Long Straddle',
    description: 'Buy a call and a put at the same strike. Profits from large price moves.',
    type: 'volatile',
    complexity: 'moderate',
    icon: Shuffle,
  },
  {
    id: 'long-strangle',
    name: 'Long Strangle',
    description: 'Buy an OTM call and an OTM put. Cheaper than straddle, needs larger move.',
    type: 'volatile',
    complexity: 'moderate',
    icon: Zap,
  },
  {
    id: 'iron-condor',
    name: 'Iron Condor',
    description: 'Sell OTM call spread & put spread. Profits if stock stays in range.',
    type: 'neutral',
    complexity: 'advanced',
    icon: Minus,
  },
  {
    id: 'covered-call',
    name: 'Covered Call',
    description: 'Own stock, sell a call option. Generates income, limits upside.',
    type: 'neutral', // or slightly bullish
    complexity: 'simple',
    icon: ShieldCheck,
  },
  {
    id: 'protective-put',
    name: 'Protective Put',
    description: 'Own stock, buy a put option. Limits downside risk, like insurance.',
    type: 'bullish', // as it's a hedge on a long stock position
    complexity: 'simple',
    icon: Route,
  }
];

const getStrategyTypeColor = (type: OptionStrategy['type']) => {
  switch (type) {
    case 'bullish': return 'text-green-600 dark:text-green-500';
    case 'bearish': return 'text-red-600 dark:text-red-500';
    case 'neutral': return 'text-blue-600 dark:text-blue-500';
    case 'volatile': return 'text-purple-600 dark:text-purple-500';
    default: return 'text-muted-foreground';
  }
};

export function ReadymadeStrategiesSection() {
  const { toast } = useToast();

  const handleStrategyClick = (strategyName: string) => {
    toast({
      title: "Strategy Selected (Mock)",
      description: `Exploring ${strategyName}. Further details and execution options would appear here.`,
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold font-headline text-primary">
          Readymade Option Strategies
        </h2>
      </div>
      <p className="text-muted-foreground">
        Explore common option strategies. Click on a strategy to learn more or (mock) initiate.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
        {strategies.map((strategy) => (
          <Card 
            key={strategy.id} 
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
            onClick={() => handleStrategyClick(strategy.name)}
            data-ai-hint={`${strategy.type} option strategy ${strategy.name.toLowerCase().replace(/\s+/g, ' ')}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{strategy.name}</CardTitle>
                <strategy.icon className={`h-6 w-6 ${getStrategyTypeColor(strategy.type)}`} />
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <CardDescription className="text-sm min-h-[60px]">{strategy.description}</CardDescription>
              <div className="flex justify-between items-center text-xs pt-2">
                <span className={`font-medium capitalize px-2 py-0.5 rounded-full ${
                  strategy.type === 'bullish' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' :
                  strategy.type === 'bearish' ? 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300' :
                  strategy.type === 'neutral' ? 'bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300' :
                  'bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300'
                }`}>
                  {strategy.type}
                </span>
                <span className={`font-medium capitalize px-2 py-0.5 rounded-full ${
                    strategy.complexity === 'simple' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300' :
                    strategy.complexity === 'moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300' :
                    'bg-orange-100 text-orange-700 dark:bg-orange-700/30 dark:text-orange-300'
                }`}>
                  {strategy.complexity}
                </span>
              </div>
            </CardContent>
            {/* <CardFooter className="pt-3">
              <Button variant="outline" size="sm" className="w-full">
                Explore Strategy
              </Button>
            </CardFooter> */}
          </Card>
        ))}
      </div>
    </section>
  );
}
