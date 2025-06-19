
import type { FoBasket } from '@/types';

export const mockFoBaskets: FoBasket[] = [
  {
    id: 'basket1',
    name: 'Nifty Bull Call Spread Weekly',
    status: 'Active',
    requiredMargin: 15250.75,
    instrumentsCount: 2,
    createdDate: '2024-07-15',
    pnl: 1250.50,
  },
  {
    id: 'basket2',
    name: 'BankNifty Iron Condor Monthly',
    status: 'Pending Execution',
    requiredMargin: 45780.00,
    instrumentsCount: 4,
    createdDate: '2024-07-20',
  },
  {
    id: 'basket3',
    name: 'Reliance Protective Put Jan Fut',
    status: 'Executed',
    requiredMargin: 8100.20,
    instrumentsCount: 2,
    createdDate: '2024-07-10',
    pnl: -350.80,
  },
  {
    id: 'basket_stock1',
    name: 'Bluechip Stocks Long-Term',
    status: 'Active',
    requiredMargin: 150000.00, // Representing total investment
    instrumentsCount: 5,
    createdDate: '2024-05-10',
    pnl: 12500.00,
  },
  {
    id: 'basket_stock2',
    name: 'IT Sector Growth Basket',
    status: 'Executed',
    requiredMargin: 75000.00, // Representing total investment
    instrumentsCount: 3,
    createdDate: '2024-06-01',
    pnl: 3200.00,
  },
  {
    id: 'basket_crypto1',
    name: 'Diversified Crypto Portfolio',
    status: 'Active',
    requiredMargin: 50000.00, // Representing total investment in INR equivalent
    instrumentsCount: 4, // e.g., BTC, ETH, SOL, ADA
    createdDate: '2024-04-15',
    pnl: 8500.00,
  },
  {
    id: 'basket_crypto2',
    name: 'DeFi Gems Basket',
    status: 'Pending Execution',
    requiredMargin: 25000.00,
    instrumentsCount: 3,
    createdDate: '2024-07-22',
  },
  {
    id: 'basket_mf1',
    name: 'Aggressive Growth MF Basket',
    status: 'Active',
    requiredMargin: 120000.00, // Total invested amount
    instrumentsCount: 3, // 3 different mutual funds
    createdDate: '2024-03-01',
    pnl: 15000.00,
  },
  {
    id: 'basket_mf2',
    name: 'Tax Saver ELSS Basket',
    status: 'Executed',
    requiredMargin: 50000.00,
    instrumentsCount: 2,
    createdDate: '2024-02-10',
    pnl: 4500.00,
  },
];
