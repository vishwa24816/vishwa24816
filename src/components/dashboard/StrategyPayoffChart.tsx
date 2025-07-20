
"use client";

import React from "react";
import { Chart, ChartContainer } from "@/components/ui/chart";
import type { StrategyId } from "@/types";

interface StrategyPayoffChartProps {
  strategyId: StrategyId;
}

const generatePayoffData = (strategyId: StrategyId) => {
  const data = [];
  const strike1 = 100;
  const strike2 = 110;
  const premium1 = 5;
  const premium2 = 2;
  const premium_short = 3;

  for (let price = 80; price <= 130; price += 1) {
    let pnl = 0;
    switch (strategyId) {
      case 'long-call':
        pnl = Math.max(0, price - strike1) - premium1;
        break;
      case 'short-put':
        pnl = premium1 - Math.max(0, strike1 - price);
        break;
      case 'bull-call-spread':
        pnl = Math.max(0, price - strike1) - Math.max(0, price - strike2) - (premium1 - premium2);
        break;
      case 'bull-put-spread':
         pnl = (premium1 - premium2) - (Math.max(0, strike1 - price) - Math.max(0, strike2 - price));
        break;
      case 'long-put':
         pnl = Math.max(0, strike1 - price) - premium1;
        break;
       case 'short-call':
        pnl = premium1 - Math.max(0, price - strike1);
        break;
      case 'bear-call-spread':
         pnl = (premium1 - premium2) - (Math.max(0, price - strike1) - Math.max(0, price - strike2));
        break;
      case 'bear-put-spread':
        pnl = Math.max(0, strike2 - price) - Math.max(0, strike1 - price) - (premium1 - premium2);
        break;
      case 'long-straddle':
        pnl = Math.max(0, price - strike1) + Math.max(0, strike1 - price) - (premium1 + premium2);
        break;
       case 'short-straddle':
        pnl = (premium1 + premium2) - (Math.max(0, price - strike1) + Math.max(0, strike1 - price));
        break;
      case 'long-strangle':
        pnl = Math.max(0, price - strike2) + Math.max(0, strike1 - price) - (premium1 + premium2);
        break;
      case 'short-strangle':
        pnl = (premium1 + premium2) - (Math.max(0, price - strike2) + Math.max(0, strike1 - price));
        break;
      case 'iron-condor':
        pnl = (Math.max(0, price-95) - Math.max(0, price-100)) - (Math.max(0, 110-price) - Math.max(0, 105-price)) + 2;
        break;
      case 'iron-butterfly':
        pnl = premium_short - (Math.abs(price-strike1));
        break;
    }
    data.push({ price, pnl });
  }
  return data;
};

export const StrategyPayoffChart: React.FC<StrategyPayoffChartProps> = ({ strategyId }) => {
  const payoffData = React.useMemo(() => generatePayoffData(strategyId), [strategyId]);
  
  return (
    <ChartContainer config={{}} className="h-full w-full pointer-events-none">
      <Chart.ResponsiveContainer>
        <Chart.AreaChart data={payoffData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Chart.defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-positive)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-positive)" stopOpacity={0.1} />
            </linearGradient>
             <linearGradient id="splitColorNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-negative)" stopOpacity={0.1} />
              <stop offset="95%" stopColor="var(--color-negative)" stopOpacity={0.8} />
            </linearGradient>
          </Chart.defs>
          <Chart.XAxis dataKey="price" hide />
          <Chart.YAxis hide />
          <Chart.ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
          <Chart.Area
            dataKey="pnl"
            type="monotone"
            strokeWidth={2}
            stroke="hsl(var(--primary))"
            fill="transparent"
          />
           <Chart.Area
            dataKey="pnl"
            type="monotone"
            fillOpacity={0.5}
            fill={(d) => (d.pnl >= 0 ? 'url(#splitColor)' : 'url(#splitColorNegative)')}
          />
        </Chart.AreaChart>
      </Chart.ResponsiveContainer>
    </ChartContainer>
  );
};
