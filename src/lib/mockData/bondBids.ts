
import type { BondBid } from '@/types';

export const mockBondBids: BondBid[] = [
  {
    id: 'bid1',
    bondName: '7.18% GOI 2033',
    isin: 'IN0020230059',
    bidPrice: 100.50,
    bidYield: '7.10%',
    quantity: 100,
    status: 'Pending',
    bidDate: '2024-01-10',
    platform: 'Exchange',
  },
  {
    id: 'bid2',
    bondName: 'NHAI InvIT 8.05% 2028',
    isin: 'INE906H07136',
    bidPrice: 1020.00,
    bidYield: '7.85%',
    quantity: 50,
    status: 'Filled',
    bidDate: '2024-01-05',
    platform: 'Primary Market',
  },
  {
    id: 'bid3',
    bondName: 'REC Ltd Tax-Free 2029',
    isin: 'INE020B07JZ5',
    bidPrice: 1150.75,
    quantity: 200,
    status: 'Cancelled',
    bidDate: '2023-12-20',
    platform: 'Exchange',
  },
];
