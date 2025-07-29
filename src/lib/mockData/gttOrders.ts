
import type { GttOrder } from '@/types';

export const mockGttOrders: GttOrder[] = [
  {
    id: 'gtt1',
    instrumentName: 'Reliance Industries Ltd.',
    symbol: 'RELIANCE',
    orderType: 'BUY',
    triggerPrice: 2400.00,
    quantity: 10,
    limitPrice: 2405.00,
    status: 'Active',
    createdDate: '2023-12-01',
    exchange: 'NSE',
    productType: 'CNC',
  },
  {
    id: 'gtt2',
    instrumentName: 'NIFTY 25JAN24 21000 PE',
    symbol: 'NIFTY25JAN24P21000',
    orderType: 'SELL',
    triggerPrice: 150.00,
    quantity: 50, // 1 lot
    limitPrice: 155.00,
    status: 'Active',
    createdDate: '2023-12-10',
    exchange: 'NFO',
    productType: 'NRML',
  },
  {
    id: 'gtt3',
    instrumentName: 'Tata Motors Ltd.',
    symbol: 'TATAMOTORS',
    orderType: 'BUY',
    triggerPrice: 600.00,
    quantity: 20,
    status: 'Triggered',
    createdDate: '2023-11-15',
    exchange: 'NSE',
    productType: 'MIS',
  },
];

export const mockRealGttOrders: GttOrder[] = [
    {
      id: 'gtt-real-1',
      instrumentName: 'Bitcoin',
      symbol: 'BTC',
      orderType: 'BUY',
      triggerPrice: 5100000.00,
      quantity: 0.005,
      limitPrice: 5100500.00,
      status: 'Active',
      createdDate: '2024-07-20',
      exchange: 'Crypto',
      productType: 'DELIVERY',
    },
    {
      id: 'gtt-real-2',
      instrumentName: 'Ethereum',
      symbol: 'ETH',
      orderType: 'SELL',
      triggerPrice: 290000.00,
      quantity: 0.1,
      status: 'Active',
      createdDate: '2024-07-18',
      exchange: 'Crypto',
      productType: 'DELIVERY',
    },
];
