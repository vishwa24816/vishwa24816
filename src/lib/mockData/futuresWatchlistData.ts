
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

export const mockIndexFuturesForWatchlist: Stock[] = [
  { id: 'futNIFTY', symbol: 'NIFTYJANFUT', name: 'NIFTY Jan Future', price: 21850.50, change: 25.20, changePercent: 0.12, exchange: 'NFO', lotSize: 50, marginFactor: 0.1, availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'] },
  { id: 'futBANKNIFTY', symbol: 'BANKNIFTYJANFUT', name: 'BANKNIFTY Jan Future', price: 47500.75, change: -50.10, changePercent: -0.11, exchange: 'NFO', lotSize: 15, marginFactor: 0.1, availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'] },
  { id: 'futFINNIFTY', symbol: 'FINNIFTYJANFUT', name: 'FINNIFTY Jan Future', price: 21200.00, change: 15.00, changePercent: 0.07, exchange: 'NFO', lotSize: 40, marginFactor: 0.1, availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'] },
];

export const mockStockFuturesForWatchlist: Stock[] = [
  { id: 'futRELIANCE', symbol: 'RELIANCEJANFUT', name: 'RELIANCE Jan Future', price: 2455.30, change: 5.80, changePercent: 0.24, exchange: 'NFO', lotSize: 250, marginFactor: 0.15, availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'] },
  { id: 'futINFY', symbol: 'INFYJANFUT', name: 'INFOSYS Jan Future', price: 1355.00, change: 10.20, changePercent: 0.76, exchange: 'NFO', lotSize: 400, marginFactor: 0.15, availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'] },
  { id: 'futHDFCBANK', symbol: 'HDFCBANKJANFUT', name: 'HDFCBANK Jan Future', price: 1615.00, change: 7.50, changePercent: 0.47, exchange: 'NFO', lotSize: 550, marginFactor: 0.15, availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'] },
  { id: 'futICICIBANK', symbol: 'ICICIBANKJANFUT', name: 'ICICIBANK Jan Future', price: 930.20, change: -2.30, changePercent: -0.25, exchange: 'NFO', lotSize: 700, marginFactor: 0.15, availableExpiries: ['25 Jan 2025', '29 Feb 2025', '28 Mar 2025'] },
];
