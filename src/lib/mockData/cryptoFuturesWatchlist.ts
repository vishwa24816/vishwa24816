
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

export const mockCryptoFuturesForWatchlist: Stock[] = [
  { 
    id: 'btcinrperp', symbol: 'BTCINR.P', name: 'Bitcoin Perpetual (INR)', 
    price: 2546750.00, change: 12525.00, changePercent: 0.49, 
    exchange: 'Crypto Futures',
    todayLow: 2521700.00, todayHigh: 2571841.75, fiftyTwoWeekLow: 1252500.00, fiftyTwoWeekHigh: 3757500.00,
    openPrice: 2534225.00, prevClosePrice: 2534225.00, 
    volume: 50000, lotSize: 1,
    aboutCompany: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.'
  },
  { 
    id: 'ethinrperp', symbol: 'ETHINR.P', name: 'Ethereum Perpetual (INR)', 
    price: 152011.75, change: -855.88, changePercent: -0.56, 
    exchange: 'Crypto Futures',
    todayLow: 150717.50, todayHigh: 153640.00, fiftyTwoWeekLow: 75150.00, fiftyTwoWeekHigh: 208750.00,
    openPrice: 152867.63, prevClosePrice: 152867.63, 
    volume: 150000, lotSize: 1,
    aboutCompany: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether (ETH) is the native cryptocurrency of the platform. Amongst cryptocurrencies, Ether is second only to Bitcoin in market capitalization.'
  },
  { 
    id: 'solinrperp', symbol: 'SOLINR.P', name: 'Solana Perpetual (INR)', 
    price: 1732.63, change: 41.75, changePercent: 2.47, 
    exchange: 'Crypto Futures',
    todayLow: 1628.25, todayHigh: 1753.50, fiftyTwoWeekLow: 668.00, fiftyTwoWeekHigh: 10020.00,
    openPrice: 1690.88, prevClosePrice: 1690.88, 
    volume: 300000, lotSize: 1,
  },
  { 
    id: 'adainrperp', symbol: 'ADAINR.P', name: 'Cardano Perpetual (INR)', 
    price: 22.13, change: 0.17, changePercent: 0.76, 
    exchange: 'Crypto Futures',
    todayLow: 21.71, todayHigh: 22.55, fiftyTwoWeekLow: 16.70, fiftyTwoWeekHigh: 50.10,
    openPrice: 21.96, prevClosePrice: 21.96, 
    volume: 5000000, lotSize: 1,
  },
  { 
    id: 'dogeinrperp', symbol: 'DOGEINR.P', name: 'Dogecoin Perpetual (INR)', 
    price: 5.22, change: -0.04, changePercent: -0.79, 
    exchange: 'Crypto Futures',
    todayLow: 5.09, todayHigh: 5.34, fiftyTwoWeekLow: 4.18, fiftyTwoWeekHigh: 12.53,
    openPrice: 5.26, prevClosePrice: 5.26, 
    volume: 10000000, lotSize: 1,
  },
];
