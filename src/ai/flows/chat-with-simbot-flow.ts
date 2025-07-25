
'use server';
/**
 * @fileOverview A simple chatbot flow for Simbot.
 *
 * - chatWithSimbot - A function that handles the chat interaction.
 * - ChatWithSimbotInput - The input type for the chatWithSimbot function.
 * - ChatWithSimbotOutput - The return type for the chatWithSimbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { mockStocks } from '@/lib/mockData';
import { mockUsStocks } from '@/lib/mockData/usStocks';

const allStocks = [...mockStocks, ...mockUsStocks];

const ChatWithSimbotInputSchema = z.object({
  message: z.string().describe('The user message to Simbot.'),
});
export type ChatWithSimbotInput = z.infer<typeof ChatWithSimbotInputSchema>;

const ChatWithSimbotOutputSchema = z.object({
  reply: z.string().describe("Simbot's reply to the user message."),
  navigationTarget: z.string().optional().describe("The URL to navigate to, if any."),
});
export type ChatWithSimbotOutput = z.infer<typeof ChatWithSimbotOutputSchema>;

export async function chatWithSimbot(
  input: ChatWithSimbotInput
): Promise<ChatWithSimbotOutput> {
  return chatWithSimbotFlow(input);
}

const navigateToStock = ai.defineTool(
    {
        name: 'navigateToStock',
        description: 'Navigate to the order page for a specific stock ticker.',
        inputSchema: z.object({
            ticker: z.string().describe('The stock ticker symbol to navigate to. e.g., RELIANCE, TSLA'),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            symbol: z.string(),
            url: z.string(),
        }),
    },
    async (input) => {
        const stock = allStocks.find(s => s.symbol.toUpperCase() === input.ticker.toUpperCase());
        if (stock) {
            return {
                success: true,
                symbol: stock.symbol,
                url: `/order/stock/${stock.symbol}`
            };
        }
        return { success: false, symbol: input.ticker, url: '' };
    }
);


const prompt = ai.definePrompt({
  name: 'chatWithSimbotPrompt',
  input: {schema: ChatWithSimbotInputSchema},
  output: {schema: ChatWithSimbotOutputSchema},
  prompt: `You are Simbot, a helpful AI assistant for the Stock Information & Management (SIM) application.
  You are an expert in Indian stock markets, finance, and investment.
  Keep your answers concise and friendly.
  If the user asks to buy or view a stock, use the navigateToStock tool.

  User message: {{{message}}}
  `,
  tools: [navigateToStock]
});

const chatWithSimbotFlow = ai.defineFlow(
  {
    name: 'chatWithSimbotFlow',
    inputSchema: ChatWithSimbotInputSchema,
    outputSchema: ChatWithSimbotOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const toolCalls = llmResponse.toolCalls();

    for (const toolCall of toolCalls) {
        if (toolCall.tool === 'navigateToStock') {
            const toolOutput = await toolCall.run();
            if (toolOutput.success) {
                return {
                    reply: `Navigating you to the order page for ${toolOutput.symbol}...`,
                    navigationTarget: toolOutput.url,
                };
            } else {
                 return {
                    reply: `Sorry, I couldn't find the stock with ticker "${toolOutput.symbol}". Please check the symbol and try again.`,
                };
            }
        }
    }

    const output = llmResponse.output();
     if (!output) {
        return { reply: "I'm having a little trouble understanding that. Could you please rephrase?" };
    }
    return output;
  }
);
