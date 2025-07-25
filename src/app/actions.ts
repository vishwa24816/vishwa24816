
"use server";

import { summarizeIndianMarketNews, type SummarizeIndianMarketNewsInput } from '@/ai/flows/summarize-indian-market-news';
import { chatWithSimbot, type ChatWithSimbotInput, type ChatWithSimbotOutput } from '@/ai/flows/chat-with-simbot-flow';
import { runScreenerFlow, type StockScreenerInput, type StockScreenerOutput } from '@/ai/flows/stock-screener-flow';
import type { Stock } from '@/types';


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


export async function sendMessageToSimbotAction(userMessage: string): Promise<ChatWithSimbotOutput & { error?: string }> {
  if (!userMessage.trim()) {
    return { error: "Message cannot be empty.", reply: "" };
  }

  try {
    const input: ChatWithSimbotInput = { message: userMessage };
    const result: ChatWithSimbotOutput = await chatWithSimbot(input);
    return result;
  } catch (error) {
    console.error("Error sending message to Simbot:", error);
    return { error: "Failed to get a response from Simbot. Please try again.", reply: "An error occurred." };
  }
}

export async function runScreenerAction(input: StockScreenerInput): Promise<{ stocks?: Stock[]; analysis?: string; error?: string }> {
  if (!input.query.trim()) {
    return { error: "Query cannot be empty." };
  }

  try {
    const result: StockScreenerOutput = await runScreenerFlow(input);
    // The schema from Zod is slightly different from the TS type, but structurally compatible for this use case.
    // A production app might do a more formal transformation.
    return { stocks: result.stocks as Stock[], analysis: result.analysis };
  } catch (error) {
    console.error("Error running screener:", error);
    return { error: "Failed to run AI screener. The model may be unavailable or the query could not be processed." };
  }
}
