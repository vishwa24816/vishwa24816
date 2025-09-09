
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/community/PostCard';
import { CommentCard } from '@/components/community/CommentCard';
import { mockCommunityPosts, mockComments } from '@/lib/mockData';
import type { Stock } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

export default function PostDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const postId = params.id as string;

    const post = mockCommunityPosts.find(p => p.id === postId);
    const comments = mockComments.filter(c => c.postId === postId);
    
    const userInitial = user?.name?.[0].toUpperCase() || user?.email?.[0].toUpperCase() || 'A';

    const handleAssetClick = (asset: Partial<Stock>) => {
        if (asset.symbol) {
            router.push(`/order/stock/${asset.symbol}`);
        }
    };
    
    if (!post) {
        return (
            <div className="flex flex-col h-screen bg-background text-foreground">
                <header className="flex items-center p-4 border-b">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-bold ml-4">Post not found</h1>
                </header>
                <main className="flex-grow flex items-center justify-center">
                    <p>The post you are looking for does not exist.</p>
                </main>
            </div>
        );
    }
    

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <header className="flex items-center p-4 border-b sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-xl font-bold ml-4">Post</h1>
            </header>

            <main className="flex-grow overflow-y-auto">
                <PostCard post={post} onAssetClick={handleAssetClick} isDetailPage={true} />
                
                <div className="border-t border-border p-4">
                    <h2 className="text-lg font-semibold mb-4">Comments ({comments.length})</h2>
                    <div className="space-y-4">
                        {comments.map(comment => (
                            <CommentCard key={comment.id} comment={comment} />
                        ))}
                    </div>
                </div>
            </main>
            
            <footer className="p-4 border-t bg-background sticky bottom-0 z-20">
                <div className="flex items-start space-x-3">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <Textarea 
                            placeholder="Post your reply"
                            className="bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary"
                            rows={1}
                        />
                        <div className="flex justify-end mt-2">
                            <Button size="sm">Reply</Button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

