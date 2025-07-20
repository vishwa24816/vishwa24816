import type { PortfolioHolding } from '@/types';
import { mockStocks } from './stocks';
import { mockCryptoAssets } from './cryptoAssets';
import { mockMutualFunds } from './mutualFunds';
import { mockBonds } from './bonds';
import { mockUsStocks } from './usStocks';

const generateHoldingFromStock = (stock: any, type: PortfolioHolding['type']): PortfolioHolding => {
  const quantity = Math.floor(Math.random() * 50) + 5;
  const avgCostPrice = stock.price * (1 - (Math.random() * 0.2 - 0.1)); // Avg price within -10% to +10% of LTP
  const ltp = stock.price;
  const currentValue = ltp * quantity;
  const profitAndLoss = (ltp - avgCostPrice) * quantity;
  const profitAndLossPercent = avgCostPrice > 0 ? (profitAndLoss / (avgCostPrice * quantity)) * 100 : 0;
  
  return {
    ...stock,
    type: type,
    quantity,
    avgCostPrice,
    ltp,
    currentValue,
    profitAndLoss,
    profitAndLossPercent,
    dayChangeAbsolute: stock.change * quantity,
    dayChangePercent: stock.changePercent,
  };
};

export const mockPortfolioHoldings: PortfolioHolding[] = [
  ...mockStocks.slice(0, 5).map(stock => generateHoldingFromStock(stock, 'Stock')),
  ...mockUsStocks.slice(0, 3).map(stock => generateHoldingFromStock(stock, 'Stock')),
  ...mockCryptoAssets.slice(0, 4).map(crypto => generateHoldingFromStock(crypto, 'Crypto')),
  ...mockMutualFunds.slice(0, 2).map(mf => generateHoldingFromStock(mf, 'Mutual Fund')),
  ...mockBonds.slice(0, 1).map(bond => generateHoldingFromStock(bond, 'Bond')),
];


export const mockRealPortfolioHoldings: PortfolioHolding[] = [
  {
    id: 'real_holding_eth',
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'Crypto',
    quantity: 5.5,
    avgCostPrice: 3800.00 * 80,
    ltp: 3400.00 * 80,
    currentValue: 18700.00 * 80,
    profitAndLoss: -2200.00 * 80,
    profitAndLossPercent: -10.53,
    dayChangeAbsolute: -187.00 * 80,
    dayChangePercent: -1.45,
  },
  {
    id: 'real_holding_sol',
    name: 'Solana',
    symbol: 'SOL',
    type: 'Crypto',
    quantity: 50,
    avgCostPrice: 150.00 * 80,
    ltp: 170.00 * 80,
    currentValue: 8500.00 * 80,
    profitAndLoss: 1000.00 * 80,
    profitAndLossPercent: 13.33,
    dayChangeAbsolute: 425.00 * 80,
    dayChangePercent: 5.26,
  },
  {
    id: 'real_holding_btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'Crypto',
    quantity: 0.25,
    avgCostPrice: 62000.00 * 80,
    ltp: 65000.00 * 80,
    currentValue: 16250.00 * 80,
    profitAndLoss: 750.00 * 80,
    profitAndLossPercent: 4.84,
    dayChangeAbsolute: 275.00 * 80,
    dayChangePercent: 1.88,
  },
];
