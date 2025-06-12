
import type { FoPosition } from '@/types';

export const mockFoPositions: FoPosition[] = [
  {
    id: 'fo1',
    instrumentName: 'NIFTY 28DEC23 20000 CE',
    optionType: 'CE',
    transactionType: 'BUY',
    lots: 2,
    quantityPerLot: 50,
    avgPrice: 120.50,
    ltp: 135.25,
    pAndL: (135.25 - 120.50) * 2 * 50,
    pAndLPercent: (((135.25 - 120.50) * 2 * 50) / (120.50 * 2 * 50)) * 100,
    expiryDate: '2023-12-28',
  },
  {
    id: 'fo2',
    instrumentName: 'BANKNIFTY 28DEC23 45000 PE',
    optionType: 'PE',
    transactionType: 'BUY',
    lots: 1,
    quantityPerLot: 15,
    avgPrice: 250.75,
    ltp: 230.10,
    pAndL: (230.10 - 250.75) * 1 * 15,
    pAndLPercent: (((230.10 - 250.75) * 1 * 15) / (250.75 * 1 * 15)) * 100,
    expiryDate: '2023-12-28',
  },
   {
    id: 'fo3',
    instrumentName: 'RELIANCE JAN24 FUT',
    optionType: 'FUT',
    transactionType: 'SELL',
    lots: 1,
    quantityPerLot: 250,
    avgPrice: 2480.00,
    ltp: 2450.50,
    pAndL: (2480.00 - 2450.50) * 1 * 250,
    pAndLPercent: (((2480.00 - 2450.50) * 1 * 250) / (2480.00 * 1 * 250)) * 100,
    expiryDate: '2024-01-25',
  },
];
