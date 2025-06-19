
import type { PortfolioHolding } from '@/types';

export const mockPortfolioHoldings: PortfolioHolding[] = [
  {
    id: 'holding1',
    name: 'Reliance Industries Ltd.',
    symbol: 'RELIANCE',
    type: 'Stock',
    quantity: 10,
    avgCostPrice: 2400.00,
    ltp: 2450.50,
    currentValue: 24505.00,
    profitAndLoss: 505.00,
    profitAndLossPercent: 2.10,
    dayChangeAbsolute: 127.50, 
    dayChangePercent: 0.52,
  },
  {
    id: 'holding2',
    name: 'Tata Digital India Fund Direct-Growth',
    type: 'Mutual Fund',
    quantity: 500,
    avgCostPrice: 30.00,
    ltp: 33.50,
    currentValue: 16750.00,
    profitAndLoss: 1750.00,
    profitAndLossPercent: 11.67,
    dayChangeAbsolute: 75.00, 
    dayChangePercent: 0.45,
  },
  {
    id: 'holding4',
    name: '7.26% GS 2033',
    symbol: 'GOI2033',
    type: 'Bond',
    quantity: 20,
    avgCostPrice: 990.00,
    ltp: 1010.50,
    currentValue: 20210.00,
    profitAndLoss: 410.00,
    profitAndLossPercent: 2.07,
    dayChangeAbsolute: 30.00, 
    dayChangePercent: 0.15,
  },
  {
    id: 'holding5',
    name: 'NIFTYBEES',
    symbol: 'NIFTYBEES',
    type: 'ETF',
    quantity: 100,
    avgCostPrice: 200.00,
    ltp: 215.30,
    currentValue: 21530.00,
    profitAndLoss: 1530.00,
    profitAndLossPercent: 7.65,
    dayChangeAbsolute: 110.00, 
    dayChangePercent: 0.51,
  },
   {
    id: 'holding6',
    name: 'Infosys Ltd.',
    symbol: 'INFY',
    type: 'Stock',
    quantity: 20,
    avgCostPrice: 1300.00,
    ltp: 1350.00,
    currentValue: 27000.00,
    profitAndLoss: 1000.00,
    profitAndLossPercent: 3.85,
    dayChangeAbsolute: 450.00, 
    dayChangePercent: 1.69,
  },
  {
    id: 'holding_eth',
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'Crypto',
    quantity: 2.77, // Approx to reach ~500 INR current value
    avgCostPrice: 170.00,
    ltp: 180.00, // Mock LTP
    currentValue: 2.77 * 180.00, // Roughly 498.60
    profitAndLoss: (180.00 - 170.00) * 2.77, // 27.70
    profitAndLossPercent: (((180.00 - 170.00) * 2.77) / (170.00 * 2.77)) * 100, // 5.88%
    dayChangeAbsolute: 5.00,
    dayChangePercent: (5.00 / ((2.77 * 180.00) - 5.00)) * 100, // approx 1.01%
  },
];
