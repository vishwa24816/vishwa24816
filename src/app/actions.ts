
"use server";

import { summarizeIndianMarketNews, type SummarizeIndianMarketNewsInput } from '@/ai/flows/summarize-indian-market-news';
import { chatWithSimbot, type ChatWithSimbotInput, type ChatWithSimbotOutput } from '@/ai/flows/chat-with-simbot-flow';

export async function summarizeNewsAction(headlines: string): Promise<{ summary?: string; error?: string }> {
  if (!headlines.trim()) {
    return { error: "Headlines cannot be empty." };
  }

  try {
    const input: SummarizeIndianMarketNewsInput = { newsHeadlines: headlines };
    const result = await summarizeIndianMarketNews(input);
    return { summary: result.summary };
  } catch (error) {
    console.error("Error summarizing news:", error);
    return { error: "Failed to summarize news. Please try again." };
  }
}


export async function sendMessageToSimbotAction(userMessage: string): Promise<{ reply?: string; error?: string }> {
  if (!userMessage.trim()) {
    return { error: "Message cannot be empty." };
  }

  try {
    const input: ChatWithSimbotInput = { message: userMessage };
    const result: ChatWithSimbotOutput = await chatWithSimbot(input);
    return { reply: result.reply };
  } catch (error) {
    console.error("Error sending message to Simbot:", error);
    return { error: "Failed to get a response from Simbot. Please try again." };
  }
}
