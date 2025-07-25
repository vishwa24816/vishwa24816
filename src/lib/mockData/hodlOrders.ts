
import type { HodlOrder } from '@/types';

const investedAmount = 250000;
const currentValue = 325000;

export const mockHodlOrders: HodlOrder[] = [
  {
    id: 'hodl1',
    instrumentName: 'Bitcoin',
    symbol: 'BTC',
    assetType: 'Crypto',
    quantity: 0.05,
    investedAmount: investedAmount,
    currentValue: currentValue,
    profit: currentValue - investedAmount,
    lockInEndDate: '2028-12-31',
    purchaseDate: '2023-01-15',
  },
];
