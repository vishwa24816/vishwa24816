
"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockNewsArticles } from '@/lib/mockData';
import type { NewsArticle } from '@/types';
import { summarizeNewsAction } from '@/app/actions';
import { Newspaper, Lightbulb, ExternalLink, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NewsSectionProps {
  articles?: NewsArticle[];
}

export function NewsSection({ articles }: NewsSectionProps) {
  const effectiveArticles = articles ?? mockNewsArticles;
  
  const [headlinesToSummarize, setHeadlinesToSummarize] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setHeadlinesToSummarize(
      effectiveArticles.slice(0, 5).map(article => article.headline).join('\n')
    );
    setSummary(''); 
    setError(''); 
  }, [effectiveArticles]);

  const handleSummarize = () => {
    setError('');
    setSummary('');
    if (!headlinesToSummarize.trim()) {
        setError("Please provide some headlines to summarize.");
        return;
    }
    startTransition(async () => {
      const result = await summarizeNewsAction(headlinesToSummarize);
      if (result.summary) {
        setSummary(result.summary);
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <section aria-labelledby="news-section-title" className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 id="news-section-title" className="text-xl font-semibold font-headline text-primary flex items-center">
            <Newspaper className="h-6 w-6 mr-2" /> Top Market News
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {articles ? "Latest headlines relevant to your view and AI-powered summaries." : "Latest headlines and AI-powered summaries."}
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Recent Headlines</h3>
        <ScrollArea className="h-48 w-full rounded-md border p-4 bg-muted/50">
          {effectiveArticles.length > 0 ? (
            <ul className="space-y-3">
              {effectiveArticles.map((article: NewsArticle) => (
                <li key={article.id} className="text-sm">
                  <a href={article.url || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors group">
                    {article.headline}
                    <ExternalLink className="inline-block h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <p className="text-xs text-muted-foreground">{article.source} - {new Date(article.timestamp).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              {articles ? "No news relevant to your current view." : "No news articles available at the moment."}
            </p>
          )}
        </ScrollArea>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-accent" /> AI News Summary
        </h3>
        <Textarea
          placeholder={effectiveArticles.length > 0 ? "Relevant headlines loaded. Edit or add more to summarize..." : "Enter news headlines here, one per line..."}
          value={headlinesToSummarize}
          onChange={(e) => setHeadlinesToSummarize(e.target.value)}
          rows={5}
          className="mb-2"
          disabled={effectiveArticles.length === 0 && !headlinesToSummarize}
        />
        <Button onClick={handleSummarize} disabled={isPending || !headlinesToSummarize.trim()} className="w-full sm:w-auto">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
          {isPending ? 'Summarizing...' : 'Generate Summary'}
        </Button>
      </div>

      {summary && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>AI Generated Summary</AlertTitle>
          <AlertDescription className="prose prose-sm max-w-none">
            {summary.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </section>
  );
}
