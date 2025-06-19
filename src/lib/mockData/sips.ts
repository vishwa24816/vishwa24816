
import type { SipOrder } from '@/types';

export const mockSips: SipOrder[] = [
  {
    id: 'sip1',
    instrumentName: 'Parag Parikh Flexi Cap Fund Direct-Growth',
    symbol: 'PARAGPARIKH',
    assetType: 'Mutual Fund',
    amount: 5000,
    frequency: 'Monthly',
    nextDueDate: '2024-02-05',
    status: 'Active',
    startDate: '2023-01-05',
    installmentsDone: 12,
    totalInstallments: 60,
  },
  {
    id: 'sip2',
    instrumentName: 'NIFTYBEES ETF',
    symbol: 'NIFTYBEES',
    assetType: 'ETF',
    quantity: 10,
    frequency: 'Weekly',
    nextDueDate: '2024-01-22',
    status: 'Active',
    startDate: '2023-09-01',
    installmentsDone: 20,
  },
  {
    id: 'sip3',
    instrumentName: 'Reliance Industries Ltd.',
    symbol: 'RELIANCE',
    assetType: 'Stock',
    amount: 2000, // Amount-based stock SIP
    frequency: 'Monthly',
    nextDueDate: '2024-02-15',
    status: 'Paused',
    startDate: '2023-06-15',
    installmentsDone: 7,
  },
  {
    id: 'sip4',
    instrumentName: 'Sovereign Gold Bond Tranche X',
    assetType: 'Gold Bond',
    amount: 6000,
    frequency: 'Monthly', // Example, SGBs usually not SIP like this
    nextDueDate: '2024-03-01',
    status: 'Completed',
    startDate: '2022-03-01',
    installmentsDone: 12,
    totalInstallments: 12,
  },
];
