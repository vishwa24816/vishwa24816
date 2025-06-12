
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

const ChatWithSimbotInputSchema = z.object({
  message: z.string().describe('The user message to Simbot.'),
});
export type ChatWithSimbotInput = z.infer<typeof ChatWithSimbotInputSchema>;

const ChatWithSimbotOutputSchema = z.object({
  reply: z.string().describe('Simbot\'s reply to the user message.'),
});
export type ChatWithSimbotOutput = z.infer<typeof ChatWithSimbotOutputSchema>;

export async function chatWithSimbot(
  input: ChatWithSimbotInput
): Promise<ChatWithSimbotOutput> {
  return chatWithSimbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithSimbotPrompt',
  input: {schema: ChatWithSimbotInputSchema},
  output: {schema: ChatWithSimbotOutputSchema},
  prompt: `You are Simbot, a helpful AI assistant for the Stock Information & Management (SIM) application.
  You are an expert in Indian stock markets, finance, and investment.
  Keep your answers concise and friendly.

  User message: {{{message}}}
  
  Simbot's reply:`,
});

const chatWithSimbotFlow = ai.defineFlow(
  {
    name: 'chatWithSimbotFlow',
    inputSchema: ChatWithSimbotInputSchema,
    outputSchema: ChatWithSimbotOutputSchema,
  },
  async input => {
    // For now, a very simple canned response or echo for demonstration.
    // Replace with actual model call for real conversation.
    if (input.message.toLowerCase().includes('hello') || input.message.toLowerCase().includes('hi')) {
      return {reply: 'Hello! How can I help you with your investments today?'};
    }
    if (input.message.toLowerCase().includes('how are you')) {
        return {reply: "I'm doing well, thank you for asking! Ready to assist you."};
    }

    const {output} = await prompt(input);
    if (!output) {
        return { reply: "I'm having a little trouble understanding that. Could you please rephrase?" };
    }
    return output;
  }
);
