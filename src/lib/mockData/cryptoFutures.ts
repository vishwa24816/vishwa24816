
import type { CryptoFuturePosition } from '@/types';

export const mockCryptoFutures: CryptoFuturePosition[] = [
  {
    id: 'cf1',
    symbol: 'BTCINR.P',
    positionSide: 'LONG',
    quantity: 0.1,
    entryPrice: 2540000.00,
    markPrice: 2546750.00,
    liquidationPrice: 2310000.00,
    unrealizedPnL: 675.00,
    margin: 25400.00,
    leverage: 10,
  },
  {
    id: 'cf2',
    symbol: 'ETHINR.P',
    positionSide: 'SHORT',
    quantity: 2,
    entryPrice: 153000.00,
    markPrice: 152011.75,
    liquidationPrice: 168000.00,
    unrealizedPnL: 1976.50,
    margin: 30600.00,
    leverage: 10,
  },
  {
    id: 'cf3',
    symbol: 'SOLINR.P',
    positionSide: 'LONG',
    quantity: 10,
    entryPrice: 1700.00,
    markPrice: 1732.63,
    unrealizedPnL: 326.30,
    margin: 1700.00,
    leverage: 10,
  },
];

export const mockRealCryptoFutures: CryptoFuturePosition[] = [
    {
      id: 'cf-real1',
      symbol: 'BTCINR.P',
      positionSide: 'SHORT',
      quantity: 0.05,
      entryPrice: 2550000.00,
      markPrice: 2546750.00,
      liquidationPrice: 2800000.00,
      unrealizedPnL: 162.50,
      margin: 12750.00,
      leverage: 20,
    },
    {
      id: 'cf-real2',
      symbol: 'BNBINR.P', // Assuming a BNB future exists
      positionSide: 'LONG',
      quantity: 5,
      entryPrice: 19500.00,
      markPrice: 20000.00, // Price from mockStocks for BNB
      liquidationPrice: 18000.00,
      unrealizedPnL: 2500.00,
      margin: 9750.00,
      leverage: 10,
    }
];
