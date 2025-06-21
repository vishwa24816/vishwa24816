
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

// Mock data for underlying stocks to be used in their futures
const relianceFundamentals = { marketCap: '16,50,000Cr', peRatioTTM: 25.5, pbRatio: 3.1, industryPe: 20.1, debtToEquity: 0.4, roe: 12.5, epsTTM: 96.0, divYield: 0.5, bookValue: 790, faceValue: 10 };
const infosysFundamentals = { marketCap: '5,60,000Cr', peRatioTTM: 24.8, pbRatio: 7.2, industryPe: 28.5, debtToEquity: 0.05, roe: 28.5, epsTTM: 54.4, divYield: 1.5, bookValue: 187.5, faceValue: 5 };
const hdfcBankFundamentals = { marketCap: '9,00,000Cr', peRatioTTM: 20.3, pbRatio: 3.5, industryPe: 18.5, debtToEquity: 0.2, roe: 15.8, epsTTM: 79.3, divYield: 0.8, bookValue: 460, faceValue: 1 };
const iciciBankFundamentals = { marketCap: '6,50,000Cr', peRatioTTM: 18.5, pbRatio: 3.2, industryPe: 18.5, debtToEquity: 0.15, roe: 16.5, epsTTM: 50.0, divYield: 0.6, bookValue: 289.15, faceValue: 2 };


export const mockIndexFuturesForWatchlist: Stock[] = [
  { 
    id: 'futNIFTY', symbol: 'NIFTYJANFUT', name: 'NIFTY Jan Future', 
    price: 21850.50, change: 25.20, changePercent: 0.12, 
    exchange: 'NFO', lotSize: 50, marginFactor: 0.1, 
    availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'],
    todayLow: 21805.10, todayHigh: 21880.90, fiftyTwoWeekLow: 18000.00, fiftyTwoWeekHigh: 22000.00,
    openPrice: 21825.30, prevClosePrice: 21825.30, volume: 150000,
  },
  { 
    id: 'futBANKNIFTY', symbol: 'BANKNIFTYJANFUT', name: 'BANKNIFTY Jan Future', 
    price: 47500.75, change: -50.10, changePercent: -0.11, 
    exchange: 'NFO', lotSize: 15, marginFactor: 0.1, 
    availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'],
    todayLow: 47450.50, todayHigh: 47600.00, fiftyTwoWeekLow: 40000.00, fiftyTwoWeekHigh: 48000.00,
    openPrice: 47550.85, prevClosePrice: 47550.85, volume: 200000,
  },
  { 
    id: 'futFINNIFTY', symbol: 'FINNIFTYJANFUT', name: 'FINNIFTY Jan Future', 
    price: 21200.00, change: 15.00, changePercent: 0.07, 
    exchange: 'NFO', lotSize: 40, marginFactor: 0.1, 
    availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'],
    todayLow: 21180.20, todayHigh: 21250.00, fiftyTwoWeekLow: 18000.00, fiftyTwoWeekHigh: 21500.00,
    openPrice: 21185.00, prevClosePrice: 21185.00, volume: 100000,
  },
];

export const mockStockFuturesForWatchlist: Stock[] = [
  { 
    id: 'futRELIANCE', symbol: 'RELIANCEJANFUT', name: 'RELIANCE Jan Future', 
    price: 2455.30, change: 5.80, changePercent: 0.24, 
    exchange: 'NFO', lotSize: 250, marginFactor: 0.15, 
    availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'],
    todayLow: 2440.10, todayHigh: 2465.00, fiftyTwoWeekLow: 2100.00, fiftyTwoWeekHigh: 2800.00,
    openPrice: 2450.00, prevClosePrice: 2449.50, volume: 75000,
    fundamentals: relianceFundamentals
  },
  { 
    id: 'futINFY', symbol: 'INFYJANFUT', name: 'INFOSYS Jan Future', 
    price: 1355.00, change: 10.20, changePercent: 0.76, 
    exchange: 'NFO', lotSize: 400, marginFactor: 0.15, 
    availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'],
    todayLow: 1345.00, todayHigh: 1360.80, fiftyTwoWeekLow: 1150.00, fiftyTwoWeekHigh: 1600.00,
    openPrice: 1346.00, prevClosePrice: 1344.80, volume: 90000,
    fundamentals: infosysFundamentals
  },
  { 
    id: 'futHDFCBANK', symbol: 'HDFCBANKJANFUT', name: 'HDFCBANK Jan Future', 
    price: 1615.00, change: 7.50, changePercent: 0.47, 
    exchange: 'NFO', lotSize: 550, marginFactor: 0.15, 
    availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'],
    todayLow: 1605.50, todayHigh: 1620.00, fiftyTwoWeekLow: 1350.00, fiftyTwoWeekHigh: 1750.00,
    openPrice: 1608.00, prevClosePrice: 1607.50, volume: 120000,
    fundamentals: hdfcBankFundamentals
  },
  { 
    id: 'futICICIBANK', symbol: 'ICICIBANKJANFUT', name: 'ICICIBANK Jan Future', 
    price: 930.20, change: -2.30, changePercent: -0.25, 
    exchange: 'NFO', lotSize: 700, marginFactor: 0.15, 
    availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'],
    todayLow: 928.00, todayHigh: 935.50, fiftyTwoWeekLow: 750.00, fiftyTwoWeekHigh: 1000.00,
    openPrice: 932.50, prevClosePrice: 932.50, volume: 110000,
    fundamentals: iciciBankFundamentals
  },
];
