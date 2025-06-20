
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
    instruments: [
      { id: 'instr1-1', action: 'BUY', name: 'NIFTY 25JUL24 22000 CE', price: 150.50, lots: 1, quantityPerLot: 50 },
      { id: 'instr1-2', action: 'SELL', name: 'NIFTY 25JUL24 22200 CE', price: 80.25, lots: 1, quantityPerLot: 50 },
    ],
    probabilityOfProfit: 65,
    maxProfit: 3487.50, // (150.50 - 80.25 - (22200-22000)) * 50 if options expire worthless, or if spread diff is hit
    maxLoss: 1512.50,   // (150.50 - 80.25) * 50 (net premium paid) if spread is wider
    riskRewardRatio: "1:2.3",
    breakEvenPoints: "22070.25",
    totalMargin: 15250.75,
    marginBenefits: 5000, // Example
  },
  {
    id: 'basket2',
    name: 'BankNifty Iron Condor Monthly',
    status: 'Pending Execution',
    requiredMargin: 45780.00,
    instrumentsCount: 4,
    createdDate: '2024-07-20',
    instruments: [
      { id: 'instr2-1', action: 'SELL', name: 'BANKNIFTY 29AUG24 47000 PE', price: 120.00, lots: 1, quantityPerLot: 15 },
      { id: 'instr2-2', action: 'BUY', name: 'BANKNIFTY 29AUG24 46800 PE', price: 90.00, lots: 1, quantityPerLot: 15 },
      { id: 'instr2-3', action: 'SELL', name: 'BANKNIFTY 29AUG24 48000 CE', price: 150.00, lots: 1, quantityPerLot: 15 },
      { id: 'instr2-4', action: 'BUY', name: 'BANKNIFTY 29AUG24 48200 CE', price: 110.00, lots: 1, quantityPerLot: 15 },
    ],
    probabilityOfProfit: 70,
    maxProfit: 1050, // (Net credit received) * lot size = ((120-90)+(150-110))*15 = (30+40)*15 = 70*15
    maxLoss: 1950, // (Width of spread - net credit) * lot size = (200 - 70) * 15 = 130*15
    riskRewardRatio: "1.86:1", // Max loss / Max Profit (approx)
    breakEvenPoints: "46930, 48070",
    totalMargin: 45780.00,
  },
  {
    id: 'basket3',
    name: 'Reliance Protective Put Jan Fut',
    status: 'Executed',
    requiredMargin: 8100.20,
    instrumentsCount: 2,
    createdDate: '2024-07-10',
    pnl: -350.80,
    instruments: [
      { id: 'instr3-1', action: 'BUY', name: 'RELIANCE JAN25 FUT', price: 2900.00, lots: 1, quantityPerLot: 250 },
      { id: 'instr3-2', action: 'BUY', name: 'RELIANCE JAN25 2800 PE', price: 50.75, lots: 1, quantityPerLot: 250 },
    ],
    probabilityOfProfit: 50, // Highly dependent on stock movement
    maxProfit: undefined, // Unlimited on upside due to Future
    maxLoss: 12687.50 + (2900 - 2800)*250, // Premium paid for Put + (Future Price - Strike)*Lot for downside limit
    breakEvenPoints: "Fut Price + Put Premium = 2900 + 50.75 = 2950.75",
    totalMargin: 8100.20, // Margin for future + premium for option
  },
  {
    id: 'basket_stock1',
    name: 'Bluechip Stocks Long-Term',
    status: 'Active',
    requiredMargin: 150000.00, // Representing total investment
    instrumentsCount: 3,
    createdDate: '2024-05-10',
    pnl: 12500.00,
    instruments: [
      { id: 'bs1-1', action: 'BUY', name: 'RELIANCE', price: 2800, lots: 20 },
      { id: 'bs1-2', action: 'BUY', name: 'HDFCBANK', price: 1500, lots: 30 },
      { id: 'bs1-3', action: 'BUY', name: 'INFY', price: 1400, lots: 25 },
    ],
    // Simplified metrics for stock basket
    maxProfit: undefined, // Unlimited for stocks
    maxLoss: 150000.00, // Total investment
    riskRewardRatio: "N/A for long-term stocks",
  },
  {
    id: 'basket_stock2',
    name: 'IT Sector Growth Basket',
    status: 'Executed',
    requiredMargin: 75000.00, // Representing total investment
    instrumentsCount: 2,
    createdDate: '2024-06-01',
    pnl: 3200.00,
    instruments: [
        { id: 'bs2-1', action: 'BUY', name: 'TCS', price: 3800, lots: 10 },
        { id: 'bs2-2', action: 'BUY', name: 'WIPRO', price: 450, lots: 80 },
    ],
  },
  {
    id: 'basket_crypto1',
    name: 'Diversified Crypto Portfolio',
    status: 'Active',
    requiredMargin: 50000.00, // Representing total investment in INR equivalent
    instrumentsCount: 2, // e.g., BTC, ETH
    createdDate: '2024-04-15',
    pnl: 8500.00,
    instruments: [
        { id: 'bc1-1', action: 'BUY', name: 'BTC', price: 2500000, lots: 0.01 }, // Price in INR
        { id: 'bc1-2', action: 'BUY', name: 'ETH', price: 180000, lots: 0.138 }, // Approx 25k INR
    ],
  },
  {
    id: 'basket_crypto2',
    name: 'DeFi Gems Basket',
    status: 'Pending Execution',
    requiredMargin: 25000.00,
    instrumentsCount: 2,
    createdDate: '2024-07-22',
     instruments: [
        { id: 'bc2-1', action: 'BUY', name: 'SOL', price: 15000, lots: 1 },
        { id: 'bc2-2', action: 'BUY', name: 'ADA', price: 100, lots: 100 },
    ],
  },
  {
    id: 'basket_mf1',
    name: 'Aggressive Growth MF Basket',
    status: 'Active',
    requiredMargin: 120000.00, // Total invested amount
    instrumentsCount: 2, // 3 different mutual funds
    createdDate: '2024-03-01',
    pnl: 15000.00,
    instruments: [
        { id: 'bmf1-1', action: 'BUY', name: 'Parag Parikh Flexi Cap', price: 60, lots: 1000 },
        { id: 'bmf1-2', action: 'BUY', name: 'Mirae Asset ELSS', price: 30, lots: 2000 },
    ],
  },
  {
    id: 'basket_mf2',
    name: 'Tax Saver ELSS Basket',
    status: 'Executed',
    requiredMargin: 50000.00,
    instrumentsCount: 1,
    createdDate: '2024-02-10',
    pnl: 4500.00,
    instruments: [
        { id: 'bmf2-1', action: 'BUY', name: 'Axis Long Term Equity', price: 50, lots: 1000 },
    ],
  },
];
