
import type { PortfolioHolding } from '@/types';

export const mockWeb3Holdings: PortfolioHolding[] = [
  {
    id: 'holding_uni',
    name: 'Uniswap',
    symbol: 'UNI',
    type: 'Crypto',
    quantity: 25,
    avgCostPrice: 750, // approx $9
    ltp: 825, // approx $9.90
    currentValue: 25 * 825,
    profitAndLoss: (825 - 750) * 25,
    profitAndLossPercent: ((825 - 750) / 750) * 100,
    dayChangeAbsolute: 10 * 25,
    dayChangePercent: (10 / (825 - 10)) * 100,
  },
  {
    id: 'holding_link',
    name: 'Chainlink',
    symbol: 'LINK',
    type: 'Crypto',
    quantity: 15,
    avgCostPrice: 1200, // approx $14.4
    ltp: 1183, // approx $14.2
    currentValue: 15 * 1183,
    profitAndLoss: (1183 - 1200) * 15,
    profitAndLossPercent: ((1183 - 1200) / 1200) * 100,
    dayChangeAbsolute: -12.5 * 15,
    dayChangePercent: (-12.5 / (1183 + 12.5)) * 100,
  },
  {
    id: 'holding_rndr',
    name: 'Render',
    symbol: 'RNDR',
    type: 'Crypto',
    quantity: 50,
    avgCostPrice: 600, // approx $7.2
    ltp: 650, // approx $7.8
    currentValue: 50 * 650,
    profitAndLoss: (650 - 600) * 50,
    profitAndLossPercent: ((650 - 600) / 600) * 100,
    dayChangeAbsolute: 45 * 50,
    dayChangePercent: (45 / (650 - 45)) * 100,
  },
];
