
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

export const mockOptionsForWatchlist: Stock[] = [
  { id: 'optNIFTYCE', symbol: 'NIFTY25JAN2421800CE', name: 'NIFTY 25JAN24 21800 CE', price: 150.75, change: -10.50, changePercent: -6.52, exchange: 'NFO', volume: 250000, openInterest: 150000000 },
  { id: 'optNIFTYPE', symbol: 'NIFTY25JAN2421500PE', name: 'NIFTY 25JAN24 21500 PE', price: 80.20, change: 5.60, changePercent: 7.51, exchange: 'NFO', volume: 300000, openInterest: 180000000 },
  { id: 'optBANKNIFTYCE', symbol: 'BANKNIFTY25JAN2447500CE', name: 'BANKNIFTY 25JAN24 47500 CE', price: 350.00, change: 20.10, changePercent: 6.09, exchange: 'NFO', volume: 400000, openInterest: 200000000 },
  { id: 'optRELIANCECE', symbol: 'RELIANCE25JAN242500CE', name: 'RELIANCE 25JAN24 2500 CE', price: 45.50, change: 2.10, changePercent: 4.83, exchange: 'NFO', volume: 150000, openInterest: 80000000 },
  { id: 'optINFYPE', symbol: 'INFY25JAN241300PE', name: 'INFOSYS 25JAN24 1300 PE', price: 22.80, change: -1.50, changePercent: -6.17, exchange: 'NFO', volume: 120000, openInterest: 60000000 },
];
