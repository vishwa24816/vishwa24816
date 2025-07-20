
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
  const strike3 = 120;
  const premium1 = 5;
  const premium2 = 2;
  const premium_short = 3;

  for (let price = 80; price <= 130; price += 1) {
    let pnl = 0;
    switch (strategyId) {
      // Bullish
      case 'long-call':
        pnl = Math.max(0, price - strike1) - premium1;
        break;
      case 'short-put':
        pnl = premium1 - Math.max(0, strike1 - price);
        break;
      case 'bull-call-spread':
        pnl = (Math.max(0, price - strike1) - premium1) - (Math.max(0, price - strike2) - premium2);
        break;
      case 'bull-put-spread':
         pnl = (premium2 - Math.max(0, strike1 - price)) - (premium1 - Math.max(0, strike2 - price));
        break;
      
      // Bearish
      case 'long-put':
         pnl = Math.max(0, strike1 - price) - premium1;
        break;
       case 'short-call':
        pnl = premium1 - Math.max(0, price - strike1);
        break;
      case 'bear-call-spread':
         pnl = (premium1 - Math.max(0, price - strike2)) - (premium2 - Math.max(0, price - strike1));
        break;
      case 'bear-put-spread':
        pnl = (Math.max(0, strike2 - price) - premium2) - (Math.max(0, strike1 - price) - premium1);
        break;
      
      // Non-Directional
      case 'long-straddle':
        pnl = Math.max(0, price - strike1) + Math.max(0, strike1 - price) - (premium1 + premium2);
        break;
       case 'short-straddle':
        pnl = (premium1 + premium2) - (Math.max(0, price - strike1) - Math.max(0, strike1 - price));
        break;
      case 'long-strangle':
        pnl = Math.max(0, price - strike2) + Math.max(0, strike1 - price) - (premium1 + premium2);
        break;
      case 'short-strangle':
        pnl = (premium1 + premium2) - (Math.max(0, price - strike2) - Math.max(0, strike1 - price));
        break;
      case 'iron-condor':
        const shortPut = premium1 - Math.max(0, strike1 - price);
        const longPut = -(premium2 - Math.max(0, 95 - price));
        const shortCall = premium1 - Math.max(0, price - strike2);
        const longCall = -(premium2 - Math.max(0, price - 115));
        pnl = shortPut + longPut + shortCall + longCall;
        break;
      case 'iron-butterfly':
        pnl = (premium_short - Math.max(0, strike1 - price)) + (premium_short - Math.max(0, price - strike1)) - 8;
        break;
      case 'call-butterfly':
        const longCall1 = Math.max(0, price - strike1) - premium2;
        const shortCalls = 2 * (premium1 - Math.max(0, price - strike2));
        const longCall2 = Math.max(0, price - strike3) - premium2;
        pnl = longCall1 + shortCalls + longCall2;
        break;
      case 'put-butterfly':
        const longPut1 = Math.max(0, strike1 - price) - premium2;
        const shortPuts = 2 * (premium1 - Math.max(0, strike2 - price));
        const longPut2 = Math.max(0, strike3 - price) - premium2;
        pnl = longPut1 + shortPuts + longPut2;
        break;
        
      // Fallbacks
      case 'call-ratio-backspread':
      case 'put-ratio-backspread':
      default:
        pnl = (price - 105) * 0.1;
    }
    data.push({ price, pnl });
  }
  return data;
};

export const StrategyPayoffChart: React.FC<StrategyPayoffChartProps> = ({ strategyId }) => {
  const payoffData = React.useMemo(() => generatePayoffData(strategyId), [strategyId]);
  
  const pnlDataKey = "pnl";

  return (
    <ChartContainer
      config={{
        [pnlDataKey]: {
          label: "P&L",
          color: "hsl(var(--primary))",
        },
      }}
      className="h-full w-full pointer-events-none"
    >
      <Chart.ResponsiveContainer>
        <Chart.LineChart
          data={payoffData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <Chart.CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.5)"/>
          <Chart.XAxis dataKey="price" hide />
          <Chart.YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
          <Chart.ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
          <Chart.Line
            dataKey={pnlDataKey}
            type="monotone"
            strokeWidth={2}
            dot={false}
          />
        </Chart.LineChart>
      </Chart.ResponsiveContainer>
    </ChartContainer>
  );
};
