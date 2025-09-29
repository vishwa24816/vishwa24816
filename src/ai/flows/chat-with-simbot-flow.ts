
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
  initialOrderDetails: z.any().optional().describe("Pre-filled details for the order page, like quantity or leverage."),
  legs: z.any().optional().describe("Pre-filled legs for the strategy builder."),
});
export type ChatWithSimbotOutput = z.infer<typeof ChatWithSimbotOutputSchema>;

export async function chatWithSimbot(
  input: ChatWithSimbotInput
): Promise<ChatWithSimbotOutput> {
  return chatWithSimbotFlow(input);
}

const navigateToInstrument = ai.defineTool(
    {
        name: 'navigateToInstrument',
        description: 'Navigate to the order page for a specific stock, future, or crypto instrument.',
        inputSchema: z.object({
            ticker: z.string().describe('The stock ticker symbol to navigate to. e.g., RELIANCE, TSLA, ETHINR.P'),
            quantity: z.number().optional().describe("The quantity to pre-fill."),
            leverage: z.number().optional().describe("The leverage to pre-fill for futures orders."),
        }),
        outputSchema: z.any(),
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
                url: path,
                initialDetails: {
                    quantity: input.quantity,
                    leverage: input.leverage,
                }
            };
        }
        return { success: false, symbol: input.ticker, url: '' };
    }
);

const createOptionStrategy = ai.defineTool(
    {
        name: 'createOptionStrategy',
        description: 'Creates an options trading strategy like a straddle or strangle for a given underlying asset.',
        inputSchema: z.object({
            underlying: z.string().describe('The underlying asset for the strategy, e.g., BITCOIN, NIFTY.'),
            strategy: z.enum(['straddle', 'strangle']).describe('The type of strategy to create.'),
        }),
        outputSchema: z.any(),
    },
    async ({ underlying, strategy }) => {
        const isCrypto = ['BTC', 'BITCOIN', 'ETH', 'ETHEREUM'].includes(underlying.toUpperCase());
        const targetView = isCrypto ? 'Crypto' : 'Fiat';
        const targetUnderlying = isCrypto ? (underlying.toUpperCase().startsWith('B') ? 'BTC' : 'ETH') : 'NIFTY';
        
        // Mocked legs for a long straddle
        const atmStrike = targetUnderlying === 'NIFTY' ? 22000 : 65000;
        const expiry = '25 JUL 2024';

        const legs = [
            {
                id: `leg1-${Date.now()}`,
                underlyingSymbol: targetUnderlying,
                instrumentName: `${targetUnderlying} ${expiry} ${atmStrike} CE`,
                expiryDate: expiry,
                strikePrice: atmStrike,
                optionType: 'Call',
                action: 'Buy',
                ltp: 150,
                quantity: 1,
            },
            {
                id: `leg2-${Date.now()}`,
                underlyingSymbol: targetUnderlying,
                instrumentName: `${targetUnderlying} ${expiry} ${atmStrike} PE`,
                expiryDate: expiry,
                strikePrice: atmStrike,
                optionType: 'Put',
                action: 'Buy',
                ltp: 130,
                quantity: 1,
            },
        ];
        
        return {
            success: true,
            reply: `I've prepared a long ${strategy} on ${underlying} for you in the strategy builder. Please review and execute it.`,
            targetView: targetView,
            legs: legs,
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
  - If the user asks to buy or view a stock, future, or any other instrument, extract the ticker, quantity, and leverage (if mentioned) and use the navigateToInstrument tool. Do not ask for confirmation, just use the tool.
  - If the user asks to create an option strategy like a "straddle" or "strangle", use the createOptionStrategy tool.
  - For leveraged futures orders, use the navigateToInstrument tool to go to the future's page. The user can set leverage there.

  User message: {{{message}}}
  `,
  tools: [navigateToInstrument, createOptionStrategy]
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

    if (toolRequest?.tool === 'navigateToInstrument') {
        const toolOutput = await navigateToInstrument(toolRequest.input);
        if (toolOutput.success) {
            return {
                reply: `Navigating you to the order page for ${toolOutput.symbol}...`,
                navigationTarget: toolOutput.url,
                initialOrderDetails: toolOutput.initialDetails,
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
            navigationTarget: 'strategy-builder',
            initialOrderDetails: { targetView: toolOutput.targetView },
            legs: toolOutput.legs,
        };
    }

    const output = llmResponse.output();
    if (!output?.reply) {
        return { reply: "I'm having a little trouble understanding that. Could you please rephrase?" };
    }
    
    return output;
  }
);

    