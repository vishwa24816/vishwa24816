
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { PostCard } from '@/components/community/PostCard';
import { mockCommunityPosts } from '@/lib/mockData';
import type { CommunityPost } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function CommunityPage() {
  const { user } = useAuth();
  const isRealMode = user?.id === 'REAL456';
  
  const [searchMode, setSearchMode] = useState<'Fiat' | 'Exchange' | 'Web3'>(isRealMode ? 'Exchange' : 'Fiat');
  const [activeTab, setActiveTab] = useState("hot");

  const displayedTabs = useMemo(() => {
    const allTabs = [
      { value: "hot", label: "Hot" },
      { value: "new", label: "New" },
      { value: "top", label: "Top" },
      { value: "foryou", label: "For You" },
      { value: "research", label: "Research" },
    ];
    if (searchMode === 'Fiat') {
      return allTabs;
    }
    return allTabs.filter(tab => tab.value !== 'research');
  }, [searchMode]);

  useEffect(() => {
    if (searchMode !== 'Fiat' && activeTab === 'research') {
      setActiveTab('hot');
    }
  }, [searchMode, activeTab]);

  const displayedPosts = useMemo(() => {
    if (activeTab === 'research') {
      return mockCommunityPosts.filter(post => post.researchFirm || post.recommendationType);
    }
    // For other tabs, return all posts (or implement specific filtering later)
    return mockCommunityPosts;
  }, [activeTab]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <AppHeader
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
          isRealMode={isRealMode}
        />

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
                          displayedPosts.map(post => <PostCard key={post.id} post={post} />)
                      ) : (
                          <div className="text-center py-10 text-muted-foreground">
                              <p>
                                {activeTab === 'research' 
                                  ? "No research reports or recommendations available yet." 
                                  : `No posts in ${tab.label} yet.`}
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
            onClick={() => alert("Create new post feature coming soon!")}
            aria-label="Create new post"
            >
            <MessageSquarePlus className="h-7 w-7" />
        </Button>
      </div>
    </ProtectedRoute>
  );
}
