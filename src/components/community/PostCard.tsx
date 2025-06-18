
"use client";

import Image from 'next/image';
import type { CommunityPost } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: CommunityPost;
}

export function PostCard({ post }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });
  const userInitial = post.user.name?.[0].toUpperCase() || post.user.username?.[0].toUpperCase() || 'U';

  return (
    <div className="bg-card border-b border-border p-3 sm:p-4 hover:bg-muted/50 transition-colors duration-150">
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10 mt-1">
          <AvatarImage src={post.user.avatarUrl} alt={post.user.name} data-ai-hint="user avatar" />
          <AvatarFallback className="bg-muted text-muted-foreground">{userInitial}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-sm">
              <span className="font-semibold text-foreground hover:underline cursor-pointer">{post.user.name}</span>
              <span className="text-muted-foreground">@{post.user.username}</span>
              <span className="text-muted-foreground/80">·</span>
              <span className="text-muted-foreground hover:underline cursor-pointer" title={new Date(post.timestamp).toLocaleString()}>{timeAgo}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          <p className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>

          {post.imageUrl && (
            <div className="mt-3 relative rounded-lg overflow-hidden border border-border max-h-[400px]">
              <Image
                src={post.imageUrl}
                alt="Post image"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                data-ai-hint={post.imageAiHint || "community post image"}
              />
              {post.stockSymbol && post.stockChangePercent !== undefined && (
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-medium shadow-md">
                  {post.stockSymbol}: <span className={cn(post.stockChangePercent >= 0 ? "text-green-400" : "text-red-400")}>
                    {post.stockChangePercent >= 0 ? '+' : ''}{post.stockChangePercent.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-muted-foreground pt-2 -ml-2">
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary rounded-full flex items-center space-x-1.5 group">
              <MessageCircle className="h-4 w-4 group-hover:text-primary transition-colors" />
              <span className="text-xs">{post.comments > 0 ? post.comments : ''}</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary rounded-full flex items-center space-x-1.5 group">
              <Repeat className="h-4 w-4 group-hover:text-primary transition-colors" />
              <span className="text-xs">{post.reposts > 0 ? post.reposts : ''}</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary rounded-full flex items-center space-x-1.5 group">
              <Heart className="h-4 w-4 group-hover:text-primary transition-colors" />
              <span className="text-xs">{post.likes > 0 ? post.likes : ''}</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary rounded-full flex items-center group">
              <Share2 className="h-4 w-4 group-hover:text-primary transition-colors" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
