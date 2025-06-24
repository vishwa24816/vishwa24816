import type { HeatmapItem, SummaryCardItem } from '@/types';

export const sectorsHeatmap: HeatmapItem[] = [
  { name: 'Banking & Finance', change: 1.20, size: 30 },
  { name: 'Hardware & Tech', change: 1.82, size: 25 },
  { name: 'Electrical Equip', change: -1.20, size: 20 },
  { name: 'Transportation', change: -0.50, size: 18 },
  { name: 'Commercial Serv.', change: 1.10, size: 18 },
  { name: 'Cement and Cons..', change: -0.70, size: 12 },
  { name: 'Fertilizers', change: 0.90, size: 12 },
  { name: 'Chemicals & Pet..', change: 1.40, size: 10 },
  { name: 'Hotels & Restau..', change: 0.90, size: 10 },
  { name: 'Building and..', change: 0.60, size: 8 },
  { name: 'Telecommunicati..', change: 0.20, size: 8 },
  { name: 'Textiles & Appar..', change: 0.40, size: 8 },
];

export const industriesHeatmap: HeatmapItem[] = [
    { name: 'Automotive', change: 1.32, size: 25 },
    { name: 'Media Broadcas..', change: -2.27, size: 20 },
    { name: 'Industrial Eq..', change: -1.70, size: 15 },
    { name: 'Other Agricult..', change: 0.78, size: 15 },
    { name: 'Airlines', change: 0.85, size: 12 },
    { name: 'Copper', change: 1.12, size: 12 },
    { name: 'Other Teleco..', change: 0.47, size: 10 },
    { name: 'Exploration &..', change: 0.46, size: 10 },
];

export const indicesHeatmap: HeatmapItem[] = [
    { name: 'ALPHAQVAL', change: 9.0, size: 40 },
    { name: 'NIFTYBSE', change: 1.24, size: 15 },
    { name: 'NIFTYBANK', change: 1.86, size: 15 },
    { name: 'NIFTYMD', change: -2.87, size: 15 },
    { name: 'NIFTY50', change: 1.45, size: 10 },
    { name: 'NIFTY100', change: 0.89, size: 10 },
    { name: 'SENSEX', change: 1.42, size: 10 },
    { name: 'SENSEX100', change: 1.73, size: 10 },
    { name: 'NIFTYAUTO', change: 0.78, size: 10 },
    { name: 'BSETELECOM', change: 1.25, size: 10 },
    { name: 'ITBSE', change: 1.84, size: 10 },
    { name: 'NIFTYPS', change: -1.50, size: 10 },
];


export const sectorsSummary: SummaryCardItem[] = [
    { name: 'Others', companies: 27, change: 2.0, advances: 15, declines: 12 },
    { name: 'Transportation', companies: 101, change: 1.8, advances: 60, declines: 41 },
    { name: 'Banking & Finance', companies: 55, change: 1.2, advances: 40, declines: 15 },
];

export const industriesSummary: SummaryCardItem[] = [
    { name: 'Industrial Gases', companies: 5, change: -3.7, advances: 3, declines: 2 },
    { name: 'Cement', companies: 10, change: 3.6, advances: 8, declines: 2 },
    { name: 'Automotive', companies: 25, change: 1.32, advances: 18, declines: 7 },
];

export const indicesSummary: SummaryCardItem[] = [
    { name: 'Nifty Alpha Quality Value', companies: 30, change: 9.0, ltp: 22284.2, advances: 25, declines: 5 },
    { name: 'Nifty 50 Equal Weight', companies: 50, change: -2.4, ltp: 19876.5, advances: 18, declines: 32 },
    { name: 'Nifty Bank', companies: 12, change: 1.86, ltp: 47500.75, advances: 9, declines: 3 },
];
