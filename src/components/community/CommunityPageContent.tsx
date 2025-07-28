
"use client";

import React, { useState, useMemo } from 'react';
import { PostCard } from '@/components/community/PostCard';
import { mockCommunityPosts } from '@/lib/mockData';
import type { CommunityPost, Stock } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface CommunityPageContentProps {
  onAssetClick: (asset: Stock) => void;
  activeMode: 'Portfolio' | 'Fiat' | 'Wealth' | 'Crypto' | 'Web3';
}

export function CommunityPageContent({ activeMode, onAssetClick }: CommunityPageContentProps) {
  const [activeTab, setActiveTab] = useState("hot");
  const router = useRouter();

  const displayedTabs = useMemo(() => {
    return [
      { value: "hot", label: "Hot" },
      { value: "new", label: "New" },
      { value: "top", label: "Top" },
      { value: "foryou", label: "For You" },
      { value: "research", label: "Research" },
    ];
  }, []);

  const displayedPosts = useMemo(() => {
    // Filter posts based on the active header mode
    const modeFilteredPosts = mockCommunityPosts.filter(post => {
      if (activeMode === 'Portfolio') {
        return true; // Show all posts in Portfolio mode
      }
      return post.category?.toLowerCase() === activeMode.toLowerCase();
    });

    // Then, apply the tab-specific filter (e.g., for 'research')
    if (activeTab === 'research') {
      return modeFilteredPosts.filter(post => post.researchFirm || post.recommendationType);
    }
    
    // For other tabs, return all posts from the selected mode
    return modeFilteredPosts;
  }, [activeTab, activeMode]);

  return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <main className="flex-grow flex flex-col overflow-hidden">
          <Tabs defaultValue="hot" value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow overflow-hidden">
            <div className="border-b bg-background">
              <TabsList 
                className="grid w-full p-0 border-none bg-transparent"
                style={{ gridTemplateColumns: `repeat(${displayedTabs.length}, 1fr)` }}
              >
                {displayedTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "py-3 px-3 sm:px-4 text-sm font-medium rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 justify-center",
                      "data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent hover:text-primary hover:border-primary/70 transition-colors duration-150 text-muted-foreground"
                    )}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <ScrollArea className="flex-grow">
              <div className="px-0 sm:px-2 md:px-4 py-4 space-y-0">
                  {displayedTabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-0 data-[state=inactive]:hidden">
                      {displayedPosts.length > 0 ? (
                          displayedPosts.map(post => <PostCard key={post.id} post={post} onAssetClick={onAssetClick} />)
                      ) : (
                          <div className="text-center py-10 text-muted-foreground">
                              <p>
                                No posts in {activeMode} for the '{tab.label}' category yet.
                              </p>
                          </div>
                      )}
                    </TabsContent>
                  ))}
              </div>
            </ScrollArea>
          </Tabs>
        </main>

        <Button
            variant="default"
            size="icon"
            className="fixed bottom-20 right-4 sm:right-6 md:right-8 z-40 rounded-full h-14 w-14 shadow-xl bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
            onClick={() => router.push('/community/create')}
            aria-label="Create new post"
            >
            <MessageSquarePlus className="h-7 w-7" />
        </Button>
      </div>
  );
}
