'use server';
/**
 * @fileOverview Summarizes top Indian market and finance news headlines using AI.
 *
 * - summarizeIndianMarketNews - A function that handles the news summarization process.
 * - SummarizeIndianMarketNewsInput - The input type for the summarizeIndianMarketNews function.
 * - SummarizeIndianMarketNewsOutput - The return type for the summarizeIndianMarketNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIndianMarketNewsInputSchema = z.object({
  newsHeadlines: z
    .string()
    .describe('A list of news headlines related to the Indian stock market and finance.'),
});
export type SummarizeIndianMarketNewsInput = z.infer<
  typeof SummarizeIndianMarketNewsInputSchema
>;

const SummarizeIndianMarketNewsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the top Indian market and finance news headlines.'
    ),
});
export type SummarizeIndianMarketNewsOutput = z.infer<
  typeof SummarizeIndianMarketNewsOutputSchema
>;

export async function summarizeIndianMarketNews(
  input: SummarizeIndianMarketNewsInput
): Promise<SummarizeIndianMarketNewsOutput> {
  return summarizeIndianMarketNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeIndianMarketNewsPrompt',
  input: {schema: SummarizeIndianMarketNewsInputSchema},
  output: {schema: SummarizeIndianMarketNewsOutputSchema},
  prompt: `You are an AI assistant specializing in providing summaries of financial news related to the Indian stock market.
  Please provide a brief overview of the main trends and important events based on the following news headlines:
  \n
  Headlines:\n{{{newsHeadlines}}}`,
});

const summarizeIndianMarketNewsFlow = ai.defineFlow(
  {
    name: 'summarizeIndianMarketNewsFlow',
    inputSchema: SummarizeIndianMarketNewsInputSchema,
    outputSchema: SummarizeIndianMarketNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
