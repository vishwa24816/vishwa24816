
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

export const mockBonds: Stock[] = [
  { id: 'bond1', symbol: 'GOI2033', name: '7.26% GS 2033', price: 101.50, change: 0.05, changePercent: 0.05, exchange: 'BOND' },
  { id: 'bond2', symbol: 'GOI2028', name: '6.54% GS 2028', price: 98.75, change: -0.02, changePercent: -0.02, exchange: 'BOND' },
  { id: 'bond3', symbol: 'NHAI2027', name: 'NHAI InvIT 7.9% 2027', price: 1050.20, change: 1.20, changePercent: 0.11, exchange: 'CORP BOND' },
  { id: 'bond4', symbol: 'RECLTD2025', name: 'REC Ltd 8.15% 2025', price: 1025.00, change: 0.50, changePercent: 0.05, exchange: 'CORP BOND' },
  { id: 'bond5', symbol: 'SGBNOV29', name: 'SGBNOV29-GB', price: 6150.00, change: 25.00, changePercent: 0.41, exchange: 'SGB' },
  { id: 'bond6', symbol: 'PFC2026', name: 'PFC Ltd 8.45% 2026', price: 1080.00, change: 0.75, changePercent: 0.07, exchange: 'CORP BOND' },
  { id: 'bond7', symbol: 'GOI2043', name: '7.41% GS 2043', price: 103.20, change: -0.10, changePercent: -0.10, exchange: 'BOND' },
];
