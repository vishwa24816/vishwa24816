
import type { CryptoFuturePosition } from '@/types';

export const mockCryptoFutures: CryptoFuturePosition[] = [
  {
    id: 'cf1',
    symbol: 'BTCINR',
    positionSide: 'LONG',
    quantity: 0.1,
    entryPrice: 3548750.00,
    markPrice: 3600891.75,
    liquidationPrice: 3173000.00,
    unrealizedPnL: 5214.18,
    margin: 35487.50,
    leverage: 10,
  },
  {
    id: 'cf2',
    symbol: 'ETHINR',
    positionSide: 'SHORT',
    quantity: 2,
    entryPrice: 183700.00,
    markPrice: 179588.13,
    unrealizedPnL: 8223.75,
    margin: 36740.00,
    leverage: 10,
  },
  {
    id: 'cf3',
    symbol: 'SOLINR',
    positionSide: 'LONG',
    quantity: 10,
    entryPrice: 5010.00,
    markPrice: 5469.25,
    unrealizedPnL: 4592.50,
    margin: 5010.00,
    leverage: 10,
  },
];
