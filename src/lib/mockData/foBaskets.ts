
import type { FoBasket } from '@/types';

export const mockFoBaskets: FoBasket[] = [
  {
    id: 'basket1',
    name: 'Nifty Bull Call Spread Weekly',
    status: 'Active',
    requiredMargin: 15250.75,
    instrumentsCount: 2,
    createdDate: '2024-07-15',
    pnl: 1250.50,
  },
  {
    id: 'basket2',
    name: 'BankNifty Iron Condor Monthly',
    status: 'Pending Execution',
    requiredMargin: 45780.00,
    instrumentsCount: 4,
    createdDate: '2024-07-20',
  },
  {
    id: 'basket3',
    name: 'Reliance Protective Put Jan Fut',
    status: 'Executed',
    requiredMargin: 8100.20,
    instrumentsCount: 2,
    createdDate: '2024-07-10',
    pnl: -350.80,
  },
];

