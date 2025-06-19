
import type { SipOrder } from '@/types';

export const mockSips: SipOrder[] = [
  {
    id: 'sip1',
    instrumentName: 'Parag Parikh Flexi Cap Fund Direct-Growth',
    symbol: 'PARAGPARIKH',
    assetType: 'Mutual Fund',
    amount: 5000,
    frequency: 'Monthly',
    nextDueDate: '2024-08-05', // Adjusted date
    status: 'Active',
    startDate: '2023-01-05',
    installmentsDone: 18, // Adjusted
    totalInstallments: 60,
  },
  {
    id: 'sip2',
    instrumentName: 'NIFTYBEES ETF',
    symbol: 'NIFTYBEES',
    assetType: 'ETF',
    quantity: 10,
    frequency: 'Weekly',
    nextDueDate: '2024-07-29', // Adjusted date
    status: 'Active',
    startDate: '2023-09-01',
    installmentsDone: 45, // Adjusted
  },
  {
    id: 'sip3',
    instrumentName: 'Reliance Industries Ltd.',
    symbol: 'RELIANCE',
    assetType: 'Stock',
    amount: 2000, // Amount-based stock SIP
    frequency: 'Monthly',
    nextDueDate: '2024-08-15', // Adjusted date
    status: 'Paused',
    startDate: '2023-06-15',
    installmentsDone: 13, // Adjusted
  },
  {
    id: 'sip4',
    instrumentName: 'Sovereign Gold Bond Tranche X',
    assetType: 'Gold Bond',
    amount: 6000,
    frequency: 'Monthly', 
    nextDueDate: '2024-09-01', // Assuming it's completed but showing last theoretical due date
    status: 'Completed',
    startDate: '2022-03-01',
    installmentsDone: 12,
    totalInstallments: 12,
  },
  {
    id: 'sip5',
    instrumentName: 'Bitcoin (BTC)',
    symbol: 'BTC',
    assetType: 'Crypto',
    amount: 1000, // INR amount for BTC
    frequency: 'Daily',
    nextDueDate: '2024-07-26', // Today or tomorrow
    status: 'Active',
    startDate: '2024-07-01',
    installmentsDone: 25, 
  },
  {
    id: 'sip6',
    instrumentName: 'Axis Long Term Equity Fund Direct-Growth',
    symbol: 'AXISLTE',
    assetType: 'Mutual Fund',
    amount: 10000,
    frequency: 'Annually', // Annual SIP
    nextDueDate: '2025-01-10',
    status: 'Active',
    startDate: '2023-01-10',
    installmentsDone: 2, // Two annual installments done
    totalInstallments: 5,
  },
  {
    id: 'sip7',
    instrumentName: 'Ethereum (ETH)',
    symbol: 'ETH',
    assetType: 'Crypto',
    quantity: 0.01, // Quantity based crypto SIP
    frequency: 'Weekly',
    nextDueDate: '2024-07-29',
    status: 'Active',
    startDate: '2024-06-01',
    installmentsDone: 8,
  },
  {
    id: 'sip8',
    instrumentName: 'Infosys Ltd.',
    symbol: 'INFY',
    assetType: 'Stock',
    quantity: 5, // Quantity-based stock SIP
    frequency: 'Bi-Weekly',
    nextDueDate: '2024-08-02',
    status: 'Paused',
    startDate: '2023-10-01',
    installmentsDone: 20,
  },
];

