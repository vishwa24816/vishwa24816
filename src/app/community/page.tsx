
"use client";

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { PostCard } from '@/components/community/PostCard';
import { mockCommunityPosts } from '@/lib/mockData';
import type { CommunityPost } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquarePlus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const communityTabs = [
  { value: "hot", label: "Hot" },
  { value: "new", label: "New" },
  { value: "top", label: "Top" },
  { value: "foryou", label: "For You" },
  { value: "research", label: "Research" },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("hot");
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts); // Initialize with mock posts

  // In a real app, posts would be fetched based on the activeTab
  const displayedPosts = posts;

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-slate-900 text-gray-100">
        <CommunityHeader />

        <Tabs defaultValue="hot" value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow overflow-hidden">
          <div className="bg-slate-800 border-b border-slate-700 sticky top-[64px] z-30"> {/* Assuming header is 64px */}
            <TabsList className="container mx-auto px-2 sm:px-4 lg:px-6 flex overflow-x-auto whitespace-nowrap no-scrollbar rounded-none h-auto p-0 border-none bg-transparent">
              {communityTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "py-3 px-3 sm:px-4 text-sm font-medium rounded-none focus-visible:ring-0 focus-visible:ring-offset-0",
                    "border-b-2 hover:bg-transparent transition-colors duration-150",
                     activeTab === tab.value
                      ? "text-primary border-primary"
                      : "text-gray-400 border-transparent hover:text-primary hover:border-primary/70"
                  )}
                >
                  {tab.label}
                   {tab.value === 'new' && <span className="ml-1.5 h-2 w-2 rounded-full bg-primary animate-pulse"></span>}
                   {tab.value === 'foryou' && <span className="ml-1.5 h-2 w-2 rounded-full bg-primary animate-pulse"></span>}
                   {tab.value === 'research' && <span className="ml-1.5 h-2 w-2 rounded-full bg-primary animate-pulse"></span>}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <ScrollArea className="flex-grow">
            <div className="container mx-auto px-0 sm:px-2 md:px-4 py-4 space-y-0"> {/* Reduced y-spacing, no x-padding on mobile */}
                {communityTabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value} className="mt-0 data-[state=inactive]:hidden">
                    {displayedPosts.length > 0 ? (
                        displayedPosts.map(post => <PostCard key={post.id} post={post} />)
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <p>No posts in {tab.label} yet.</p>
                        </div>
                    )}
                  </TabsContent>
                ))}
            </div>
          </ScrollArea>
        </Tabs>

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
