
'use server';
/**
 * @fileOverview An AI-powered stock screener flow.
 *
 * - runScreenerFlow - A function that handles the stock screening process.
 * - StockScreenerInput - The input type for the runScreenerFlow function.
 * - StockScreenerOutput - The return type for the runScreenerFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {mockStocks} from '@/lib/mockData';
import type { Stock } from '@/types';

// Create a Zod schema that matches the Stock type for validation and type safety.
// We only need a subset of fields for the screener output.
const StockSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  change: z.number(),
  changePercent: z.number(),
  marketCap: z.string().optional(),
  volume: z.number().optional(),
  exchange: z.string().optional(),
  sector: z.string().optional(),
  fundamentals: z.object({
    marketCap: z.string(),
    peRatioTTM: z.number().nullable().optional(),
    pbRatio: z.number().nullable().optional(),
    industryPe: z.number().nullable().optional(),
    debtToEquity: z.number().nullable().optional(),
    roe: z.number().nullable().optional(),
    epsTTM: z.number().nullable().optional(),
    divYield: z.number().nullable().optional(),
    bookValue: z.number().nullable().optional(),
    faceValue: z.number().nullable().optional(),
  }).optional(),
});

// Define the input for the flow
const StockScreenerInputSchema = z.object({
  query: z.string().describe('The user\'s natural language query for screening stocks.'),
});
export type StockScreenerInput = z.infer<typeof StockScreenerInputSchema>;

// Define the output for the flow
const StockScreenerOutputSchema = z.object({
  stocks: z.array(StockSchema).describe('The list of stocks that match the screening criteria.'),
  analysis: z.string().describe('A brief analysis or summary of the screening results and why they match the criteria.'),
});
export type StockScreenerOutput = z.infer<typeof StockScreenerOutputSchema>;

// Tool to get stock data from our mock data source
const getStockScreenerResults = ai.defineTool(
  {
    name: 'getStockScreenerResults',
    description: 'Retrieves a list of stocks based on specified filtering criteria.',
    inputSchema: z.object({
      sector: z.string().optional().describe('Filter by sector (e.g., "IT", "Banking", "FMCG").'),
      peRatioMax: z.number().optional().describe('Maximum Price-to-Earnings (P/E) ratio.'),
      peRatioMin: z.number().optional().describe('Minimum Price-to-Earnings (P/E) ratio.'),
      roeMin: z.number().optional().describe('Minimum Return on Equity (ROE) in percent.'),
      marketCapMin: z.number().optional().describe('Minimum market capitalization in crores (e.g., 50000 for 50,000 Cr).'),
      debtToEquityMax: z.number().optional().describe('Maximum debt-to-equity ratio. Use a low value like 0.5 for "low debt".'),
    }),
    outputSchema: z.array(StockSchema),
  },
  async (input) => {
    let results: Stock[] = mockStocks;

    if (input.sector) {
      results = results.filter(stock => stock.sector?.toLowerCase().includes(input.sector!.toLowerCase()));
    }
    if (input.peRatioMax !== undefined) {
      results = results.filter(stock => stock.fundamentals?.peRatioTTM != null && stock.fundamentals.peRatioTTM <= input.peRatioMax);
    }
    if (input.peRatioMin !== undefined) {
      results = results.filter(stock => stock.fundamentals?.peRatioTTM != null && stock.fundamentals.peRatioTTM >= input.peRatioMin);
    }
    if (input.roeMin !== undefined) {
        results = results.filter(stock => stock.fundamentals?.roe != null && stock.fundamentals.roe >= input.roeMin);
    }
    if (input.marketCapMin !== undefined) {
        results = results.filter(stock => {
            if (!stock.fundamentals?.marketCap) return false;
            // Convert '16,50,000Cr' string to a number
            const mcValue = parseFloat(stock.fundamentals.marketCap.replace(/,/g, '').replace('Cr', ''));
            return !isNaN(mcValue) && mcValue >= input.marketCapMin;
        });
    }
    if (input.debtToEquityMax !== undefined) {
      results = results.filter(stock => stock.fundamentals?.debtToEquity != null && stock.fundamentals.debtToEquity <= input.debtToEquityMax);
    }
    
    return results as z.infer<typeof StockSchema>[];
  }
);

const stockScreenerFlow = ai.defineFlow(
  {
    name: 'stockScreenerFlow',
    inputSchema: StockScreenerInputSchema,
    outputSchema: StockScreenerOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: `You are an expert stock market analyst. Your task is to help a user screen for stocks based on their request.
      1. Analyze the user's query to understand the filtering criteria. The user may mention sectors, valuation metrics like P/E ratio, performance metrics like ROE, or company size like market cap.
      2. For a "low debt" query, use a 'debtToEquityMax' of 0.5.
      3. For "Large cap", interpret it as a high market capitalization, for example, above 500,000 Cr.
      4. Use the 'getStockScreenerResults' tool with the extracted criteria to find matching stocks.
      5. After receiving the stock list from the tool, provide a brief, insightful analysis. Explain *why* these stocks match the user's query and add any relevant context.
      6. Return both the list of stocks and your analysis.

      User query: "${input.query}"`,
      tools: [getStockScreenerResults],
      output: {
        schema: StockScreenerOutputSchema,
      }
    });

    return llmResponse.output!;
  }
);

export async function runScreenerFlow(input: StockScreenerInput): Promise<StockScreenerOutput> {
  return stockScreenerFlow(input);
}
