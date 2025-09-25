
// This file now acts as an index for the mockData directory.
// It imports and re-exports all mock data arrays.

export * from './marketIndices';
export * from './stocks';
export * from './usStocks';
export * from './cryptoAssets';
export * from './newsArticles';
export * from './portfolioHoldings';
export * from './intradayPositions';
export * from './foPositions';
export * from './cryptoFutures';
export * from './mutualFunds';
export * from './bonds';
export * from './futuresWatchlistData'; // Exports mockIndexFuturesForWatchlist and mockStockFuturesForWatchlist
export * from './optionsWatchlistData';
export * from './optionChainData';
export * from './cryptoFuturesWatchlist';
export * from './foBaskets';
export * from './communityPosts';
export * from './comments';
export * from './gttOrders';
export * from './bondBids';
export * from './sips';
export * from './priceAlerts';
export * from './cryptoMutualFunds';
export * from './cryptoETFs';
export * from './cryptoIntradayPositions';
export * from './web3AI';
export * from './web3DeFi';
export * from './web3Gainers';
export * from './web3Memes';
export * from './web3Trending';
export * from './web3Holdings';
export * from './marketSectorData';
export * from './hodlOrders';
export * from './bulkBlockDeals';
export * from './earningsCalls';
export * from './events';
export * from './fiiDiiData';
export * from './insiderTrades';
export * from './bikeInsurance';
export * from './carInsurance';
export * from './healthInsurance';
export * from './lifeInsurance';
export * from './otherInsurance';
export * from './ipo';
export * from './insights';
export * from './etfs';
export * from './superstars';
export * from './transactions';
export * from './wallets';

import { mockStocks as stocks } from './stocks';
import { mockUsStocks as usStocks } from './usStocks';
import { mockCryptoAssets as crypto } from './cryptoAssets';
import { mockMutualFunds as mf } from './mutualFunds';
import { mockBonds as bonds } from './bonds';
import { mockIndexFuturesForWatchlist, mockStockFuturesForWatchlist } from './futuresWatchlistData';
import { mockOptionsForWatchlist } from './optionsWatchlistData';
import { mockCryptoFuturesForWatchlist } from './cryptoFuturesWatchlist';

export const allAssets = [
    ...stocks,
    ...usStocks,
    ...crypto,
    ...mf,
    ...bonds,
    ...mockIndexFuturesForWatchlist,
    ...mockStockFuturesForWatchlist,
    ...mockOptionsForWatchlist,
    ...mockCryptoFuturesForWatchlist,
];
