
import type { CryptoFuturePosition } from '@/types';

export const mockCryptoFutures: CryptoFuturePosition[] = [
  {
    id: 'cf1',
    symbol: 'BTC-PERP',
    positionSide: 'LONG',
    quantity: 0.1,
    entryPrice: 65000.00,
    markPrice: 65150.00,
    liquidationPrice: 58500.00,
    unrealizedPnL: 15.00,
    mtmPnl: 4.50,
    margin: 6500.00,
    leverage: 10,
  },
  {
    id: 'cf2',
    symbol: 'ETH-PERP',
    positionSide: 'SHORT',
    quantity: 2,
    entryPrice: 3450.00,
    markPrice: 3420.00,
    liquidationPrice: 3795.00,
    unrealizedPnL: 60.00,
    mtmPnl: 18.00,
    margin: 690.00,
    leverage: 10,
  },
  {
    id: 'cf3',
    symbol: 'SOL-PERP',
    positionSide: 'LONG',
    quantity: 10,
    entryPrice: 168.00,
    markPrice: 170.50,
    unrealizedPnL: 25.00,
    mtmPnl: 7.50,
    margin: 168.00,
    leverage: 10,
  },
];

export const mockRealCryptoFutures: CryptoFuturePosition[] = [
    {
      id: 'cf-real1',
      symbol: 'BTC-PERP',
      positionSide: 'SHORT',
      quantity: 0.05,
      entryPrice: 65200.00,
      markPrice: 65150.00,
      liquidationPrice: 68460.00,
      unrealizedPnL: 2.50,
      mtmPnl: 0.75,
      margin: 163.00,
      leverage: 20,
    },
    {
      id: 'cf-real2',
      symbol: 'BNB-PERP',
      positionSide: 'LONG',
      quantity: 5,
      entryPrice: 578.00,
      markPrice: 580.00,
      liquidationPrice: 520.20,
      unrealizedPnL: 10.00,
      mtmPnl: 3.00,
      margin: 289.00,
      leverage: 10,
    }
];
