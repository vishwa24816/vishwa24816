import type { Stock } from '@/types';

export const mockWeb3NFTs: Stock[] = [
  {
    id: 'w3nft_cryptopunks',
    symbol: 'PUNK',
    name: 'CryptoPunks',
    price: 45.5, // Floor price in ETH
    change: 1.2,
    changePercent: 2.7,
    exchange: 'NFT',
    aboutCompany: 'CryptoPunks is one of the first non-fungible token projects on Ethereum, consisting of 10,000 unique 24x24 pixel art images.'
  },
  {
    id: 'w3nft_bayc',
    symbol: 'BAYC',
    name: 'Bored Ape Yacht Club',
    price: 25.8,
    change: -0.5,
    changePercent: -1.9,
    exchange: 'NFT',
    aboutCompany: 'A collection of 10,000 unique Bored Ape NFTs—unique digital collectibles living on the Ethereum blockchain.'
  },
  {
    id: 'w3nft_azuki',
    symbol: 'AZUKI',
    name: 'Azuki',
    price: 5.2,
    change: 0.3,
    changePercent: 6.1,
    exchange: 'NFT',
    aboutCompany: 'A brand for the metaverse. A collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.'
  },
];
