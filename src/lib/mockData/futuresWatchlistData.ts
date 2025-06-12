
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

export const mockFuturesForWatchlist: Stock[] = [
  { id: 'futNIFTY', symbol: 'NIFTYJANFUT', name: 'NIFTY Jan Future', price: 21850.50, change: 25.20, changePercent: 0.12, exchange: 'NFO' },
  { id: 'futBANKNIFTY', symbol: 'BANKNIFTYJANFUT', name: 'BANKNIFTY Jan Future', price: 47500.75, change: -50.10, changePercent: -0.11, exchange: 'NFO' },
  { id: 'futRELIANCE', symbol: 'RELIANCEJANFUT', name: 'RELIANCE Jan Future', price: 2455.30, change: 5.80, changePercent: 0.24, exchange: 'NFO' },
  { id: 'futINFY', symbol: 'INFYJANFUT', name: 'INFOSYS Jan Future', price: 1355.00, change: 10.20, changePercent: 0.76, exchange: 'NFO' },
  { id: 'futFINNIFTY', symbol: 'FINNIFTYJANFUT', name: 'FINNIFTY Jan Future', price: 21200.00, change: 15.00, changePercent: 0.07, exchange: 'NFO' },
];
