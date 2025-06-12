"use server";

import { summarizeIndianMarketNews, type SummarizeIndianMarketNewsInput } from '@/ai/flows/summarize-indian-market-news';

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
