
import type { CryptoFuturePosition } from '@/types';

export const mockCryptoFutures: CryptoFuturePosition[] = [
  {
    id: 'cf1',
    symbol: 'BTCINR.P',
    positionSide: 'LONG',
    quantity: 0.1,
    entryPrice: 2400000.00,
    markPrice: 2401500.00,
    liquidationPrice: 2180000.00,
    unrealizedPnL: 150.00,
    mtmPnl: 45.00,
    margin: 24000.00,
    leverage: 10,
  },
  {
    id: 'cf2',
    symbol: 'ETHINR.P',
    positionSide: 'SHORT',
    quantity: 2,
    entryPrice: 150300.00,
    markPrice: 150100.00,
    liquidationPrice: 165000.00,
    unrealizedPnL: 400.00,
    mtmPnl: 120.00,
    margin: 30060.00,
    leverage: 10,
  },
  {
    id: 'cf3',
    symbol: 'SOLINR.P',
    positionSide: 'LONG',
    quantity: 10,
    entryPrice: 1660.00,
    markPrice: 1666.50,
    unrealizedPnL: 65.00,
    mtmPnl: 19.50,
    margin: 1660.00,
    leverage: 10,
  },
];

export const mockRealCryptoFutures: CryptoFuturePosition[] = [
    {
      id: 'cf-real1',
      symbol: 'BTCINR.P',
      positionSide: 'SHORT',
      quantity: 0.05,
      entryPrice: 2405000.00,
      markPrice: 2401500.00,
      liquidationPrice: 2650000.00,
      unrealizedPnL: 175.00,
      mtmPnl: 52.50,
      margin: 12025.00,
      leverage: 20,
    },
    {
      id: 'cf-real2',
      symbol: 'BNBINR.P',
      positionSide: 'LONG',
      quantity: 5,
      entryPrice: 19950.00,
      markPrice: 20020.00,
      liquidationPrice: 18952.50,
      unrealizedPnL: 350.00,
      mtmPnl: 105.00,
      margin: 9975.00,
      leverage: 10,
    }
];
