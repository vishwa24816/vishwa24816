"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockNewsArticles } from '@/lib/mockData';
import type { NewsArticle } from '@/types';
import { summarizeNewsAction } from '@/app/actions';
import { Newspaper, Lightbulb, ExternalLink, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export function NewsSection() {
  const [headlinesToSummarize, setHeadlinesToSummarize] = useState(
    mockNewsArticles.slice(0, 5).map(article => article.headline).join('\n')
  );
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSummarize = () => {
    setError('');
    setSummary('');
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
    <section aria-labelledby="news-section-title">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
              <Newspaper className="h-6 w-6 mr-2" /> Top Market News
            </CardTitle>
          </div>
          <CardDescription>Latest headlines and AI-powered summaries.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Recent Headlines</h3>
            <ScrollArea className="h-48 w-full rounded-md border p-4 bg-muted/50">
              <ul className="space-y-3">
                {mockNewsArticles.map((article: NewsArticle) => (
                  <li key={article.id} className="text-sm">
                    <a href={article.url || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors group">
                      {article.headline}
                      <ExternalLink className="inline-block h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <p className="text-xs text-muted-foreground">{article.source} - {new Date(article.timestamp).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-accent" /> AI News Summary
            </h3>
            <Textarea
              placeholder="Enter news headlines here, one per line..."
              value={headlinesToSummarize}
              onChange={(e) => setHeadlinesToSummarize(e.target.value)}
              rows={5}
              className="mb-2"
            />
            <Button onClick={handleSummarize} disabled={isPending} className="w-full sm:w-auto">
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
        </CardContent>
      </Card>
    </section>
  );
}
