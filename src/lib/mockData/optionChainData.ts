
import type { OptionChainData, Underlying, OptionData } from '@/types';

export const mockUnderlyings: Underlying[] = [
  { id: 'nifty', name: 'NIFTY 50', symbol: 'NIFTY' },
  { id: 'banknifty', name: 'NIFTY Bank', symbol: 'BANKNIFTY' },
];

const generateOptionData = (baseLTP: number, isCall: boolean, strike: number, underlyingPrice: number): OptionData => {
  const randomFactor = () => (Math.random() - 0.5) * 0.2 + 1; // +/- 20%
  
  let ltpMultiplier = 0.1;
  if (isCall) {
    ltpMultiplier = Math.max(0.1, (underlyingPrice - strike + 100) / 200); // More sensitive for calls
  } else {
    ltpMultiplier = Math.max(0.1, (strike - underlyingPrice + 100) / 200); // More sensitive for puts
  }
  ltpMultiplier = Math.max(0.05, Math.min(2, ltpMultiplier)); // Bound multiplier


  const ltp = parseFloat(Math.max(0.05, baseLTP * randomFactor() * ltpMultiplier).toFixed(2));
  
  return {
    oi: Math.floor(Math.random() * 500000) + 10000,
    chngInOI: Math.floor((Math.random() - 0.5) * 100000),
    volume: Math.floor(Math.random() * 20000) + 500,
    iv: Math.random() * 30 + 10, // IV between 10 and 40
    ltp: ltp,
    netChng: parseFloat(((Math.random() - 0.5) * (ltp * 0.2)).toFixed(2)), // Max 20% change
    bidQty: Math.floor(Math.random() * 500),
    bidPrice: parseFloat(Math.max(0.05, ltp * (1 - Math.random() * 0.02 - 0.005)).toFixed(2)), // Slightly lower than LTP
    askPrice: parseFloat(Math.max(ltp, ltp * (1 + Math.random() * 0.02 + 0.005)).toFixed(2)), // Slightly higher than LTP
    askQty: Math.floor(Math.random() * 500),
    delta: parseFloat((Math.random() * (isCall ? 1 : -1)).toFixed(2)),
    gamma: parseFloat(Math.random().toFixed(4)),
    theta: parseFloat((Math.random() * -10).toFixed(2)),
    vega: parseFloat((Math.random() * 5).toFixed(2)),
  };
};

const niftyCurrentPrice = 21500; // Example current price for NIFTY

export const mockNiftyOptionChain: Record<string, OptionChainData> = {
  '2024-07-25': {
    underlyingValue: niftyCurrentPrice,
    expiryDate: '25 Jul 2024',
    data: [
      { strikePrice: 21300, call: generateOptionData(150, true, 21300, niftyCurrentPrice), put: generateOptionData(30, false, 21300, niftyCurrentPrice) },
      { strikePrice: 21350, call: generateOptionData(120, true, 21350, niftyCurrentPrice), put: generateOptionData(40, false, 21350, niftyCurrentPrice) },
      { strikePrice: 21400, call: generateOptionData(100, true, 21400, niftyCurrentPrice), put: generateOptionData(50, false, 21400, niftyCurrentPrice) },
      { strikePrice: 21450, call: generateOptionData(80, true, 21450, niftyCurrentPrice), put: generateOptionData(70, false, 21450, niftyCurrentPrice) },
      { strikePrice: 21500, call: generateOptionData(60, true, 21500, niftyCurrentPrice), put: generateOptionData(80, false, 21500, niftyCurrentPrice) }, // ATM approx
      { strikePrice: 21550, call: generateOptionData(45, true, 21550, niftyCurrentPrice), put: generateOptionData(100, false, 21550, niftyCurrentPrice) },
      { strikePrice: 21600, call: generateOptionData(30, true, 21600, niftyCurrentPrice), put: generateOptionData(120, false, 21600, niftyCurrentPrice) },
      { strikePrice: 21650, call: generateOptionData(20, true, 21650, niftyCurrentPrice), put: generateOptionData(150, false, 21650, niftyCurrentPrice) },
      { strikePrice: 21700, call: generateOptionData(15, true, 21700, niftyCurrentPrice), put: generateOptionData(180, false, 21700, niftyCurrentPrice) },
    ],
  },
  '2024-08-29': {
    underlyingValue: niftyCurrentPrice,
    expiryDate: '29 Aug 2024',
    data: [
      { strikePrice: 21300, call: generateOptionData(180, true, 21300, niftyCurrentPrice), put: generateOptionData(50, false, 21300, niftyCurrentPrice) },
      { strikePrice: 21400, call: generateOptionData(140, true, 21400, niftyCurrentPrice), put: generateOptionData(70, false, 21400, niftyCurrentPrice) },
      { strikePrice: 21500, call: generateOptionData(100, true, 21500, niftyCurrentPrice), put: generateOptionData(100, false, 21500, niftyCurrentPrice) },
      { strikePrice: 21600, call: generateOptionData(70, true, 21600, niftyCurrentPrice), put: generateOptionData(140, false, 21600, niftyCurrentPrice) },
      { strikePrice: 21700, call: generateOptionData(50, true, 21700, niftyCurrentPrice), put: generateOptionData(180, false, 21700, niftyCurrentPrice) },
    ],
  },
};

const bankNiftyCurrentPrice = 47000;
export const mockBankNiftyOptionChain: Record<string, OptionChainData> = {
    '2024-07-25': {
    underlyingValue: bankNiftyCurrentPrice, 
    expiryDate: '25 Jul 2024',
    data: [
        { strikePrice: 46800, call: generateOptionData(250, true, 46800, bankNiftyCurrentPrice), put: generateOptionData(130, false, 46800, bankNiftyCurrentPrice) },
        { strikePrice: 46900, call: generateOptionData(200, true, 46900, bankNiftyCurrentPrice), put: generateOptionData(160, false, 46900, bankNiftyCurrentPrice) },
        { strikePrice: 47000, call: generateOptionData(150, true, 47000, bankNiftyCurrentPrice), put: generateOptionData(180, false, 47000, bankNiftyCurrentPrice) },
        { strikePrice: 47100, call: generateOptionData(120, true, 47100, bankNiftyCurrentPrice), put: generateOptionData(220, false, 47100, bankNiftyCurrentPrice) },
        { strikePrice: 47200, call: generateOptionData(90, true, 47200, bankNiftyCurrentPrice), put: generateOptionData(270, false, 47200, bankNiftyCurrentPrice) },
    ]
    }
};

export const mockOptionChains: Record<string, Record<string, OptionChainData>> = {
    NIFTY: mockNiftyOptionChain,
    BANKNIFTY: mockBankNiftyOptionChain,
};
