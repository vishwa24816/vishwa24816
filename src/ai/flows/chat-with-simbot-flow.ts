
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
import { mockStocks, mockCryptoFuturesForWatchlist } from '@/lib/mockData';
import { mockUsStocks } from '@/lib/mockData/usStocks';

const allStocks = [...mockStocks, ...mockUsStocks, ...mockCryptoFuturesForWatchlist];

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
            ticker: z.string().describe('The stock ticker symbol to navigate to. e.g., RELIANCE, TSLA, ETHINR.P'),
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
            let path = '';
            if (stock.exchange?.toLowerCase().includes('future')) {
                path = stock.exchange?.toLowerCase().includes('crypto') ? `/order/crypto-future/${stock.symbol}` : `/order/future/${stock.symbol}`;
            } else {
                path = `/order/stock/${stock.symbol}`;
            }
            return {
                success: true,
                symbol: stock.symbol,
                url: path
            };
        }
        return { success: false, symbol: input.ticker, url: '' };
    }
);

const createOptionStrategy = ai.defineTool(
    {
        name: 'createOptionStrategy',
        description: 'Creates an options trading strategy like a straddle or strangle.',
        inputSchema: z.object({
            underlying: z.string().describe('The underlying asset for the strategy, e.g., BITCOIN, NIFTY.'),
            strategy: z.enum(['straddle', 'strangle']).describe('The type of strategy to create.'),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            reply: z.string(),
        }),
    },
    async (input) => {
        // In a real scenario, this would involve fetching option chain data and creating legs.
        // For this mock, we just confirm the action.
        return {
            success: true,
            reply: `I've prepared a long ${input.strategy} on ${input.underlying} for you in the strategy builder. Please review and execute it.`,
        };
    }
);


const prompt = ai.definePrompt({
  name: 'chatWithSimbotPrompt',
  input: {schema: ChatWithSimbotInputSchema},
  output: {schema: ChatWithSimbotOutputSchema},
  prompt: `You are Simbot, a helpful AI assistant for the SIM (Simulation) application.
  You are an expert in Indian and crypto stock markets, finance, and investment in a simulated environment.
  Keep your answers concise and friendly.
  - If the user asks to buy or view a stock, future, or any other instrument, use the navigateToStock tool. Do not ask for confirmation, just use the tool.
  - If the user asks to create an option strategy like a "straddle" or "strangle", use the createOptionStrategy tool.
  - For leveraged futures orders, use the navigateToStock tool to go to the future's page. The user can set leverage there.

  User message: {{{message}}}
  `,
  tools: [navigateToStock, createOptionStrategy]
});

const chatWithSimbotFlow = ai.defineFlow(
  {
    name: 'chatWithSimbotFlow',
    inputSchema: ChatWithSimbotInputSchema,
    outputSchema: ChatWithSimbotOutputSchema,
  },
  async (input) => {
    const llmResponse = await prompt(input);
    const toolRequest = llmResponse.toolRequest();

    if (toolRequest?.tool === 'navigateToStock') {
        const toolOutput = await navigateToStock(toolRequest.input);
        if (toolOutput.success) {
            return {
                reply: `Navigating you to the order page for ${toolOutput.symbol}...`,
                navigationTarget: toolOutput.url,
            };
        } else {
             return {
                reply: `Sorry, I couldn't find the instrument with ticker "${toolOutput.symbol}". Please check the symbol and try again.`,
            };
        }
    }
    
    if (toolRequest?.tool === 'createOptionStrategy') {
        const toolOutput = await createOptionStrategy(toolRequest.input);
        return {
            reply: toolOutput.reply,
        };
    }

    const output = llmResponse.output();
    if (!output?.reply) {
        return { reply: "I'm having a little trouble understanding that. Could you please rephrase?" };
    }
    
    return output;
  }
);
