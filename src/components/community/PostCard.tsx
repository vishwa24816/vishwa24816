
"use client";

import Image from 'next/image';
import type { CommunityPost, Stock } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat, Share2, MoreHorizontal, TrendingUp, TrendingDown, MinusCircle, PlusCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';


interface PostCardProps {
  post: CommunityPost;
  onAssetClick: (asset: Partial<Stock>) => void;
}

const getRecommendationBadgeVariant = (type?: CommunityPost['recommendationType']) => {
  switch (type) {
    case 'Buy': return 'bg-green-500 hover:bg-green-600 text-white';
    case 'Accumulate': return 'bg-green-400 hover:bg-green-500 text-white';
    case 'Hold': return 'bg-yellow-500 hover:bg-yellow-600 text-black';
    case 'Sell': return 'bg-red-500 hover:bg-red-600 text-white';
    default: return 'secondary';
  }
};

const RecommendationIcon = ({ type }: { type?: CommunityPost['recommendationType'] }) => {
  switch (type) {
    case 'Buy': return <TrendingUp className="h-4 w-4 mr-1.5" />;
    case 'Accumulate': return <PlusCircle className="h-4 w-4 mr-1.5" />;
    case 'Hold': return <MinusCircle className="h-4 w-4 mr-1.5" />;
    case 'Sell': return <TrendingDown className="h-4 w-4 mr-1.5" />;
    default: return null;
  }
};

export function PostCard({ post, onAssetClick }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });
  const userInitial = post.user.name?.[0].toUpperCase() || post.user.username?.[0].toUpperCase() || 'U';
  const isResearchPost = post.researchFirm || post.recommendationType;

  const handleStockClick = () => {
    if (post.stockSymbol) {
        onAssetClick({ symbol: post.stockSymbol, name: post.stockSymbol });
    }
  };

  return (
    <div className="bg-card border-b border-border p-3 sm:p-4 hover:bg-muted/50 transition-colors duration-150">
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10 mt-1">
          <AvatarImage src={post.user.avatarUrl} alt={post.user.name} data-ai-hint="user avatar" />
          <AvatarFallback className="bg-muted text-muted-foreground">{userInitial}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-sm flex-wrap">
              <span className="font-semibold text-foreground hover:underline cursor-pointer">{post.user.name}</span>
              <span className="text-muted-foreground">@{post.user.username}</span>
              <span className="text-muted-foreground/80 hidden sm:inline">·</span>
              <span className="text-muted-foreground hover:underline cursor-pointer" title={new Date(post.timestamp).toLocaleString()}>{timeAgo}</span>
              {post.researchFirm && <span className="text-xs text-muted-foreground italic ml-1">via {post.researchFirm}</span>}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {isResearchPost && post.recommendationType && (
            <div className="mt-2 mb-1">
              <Badge
                variant="outline"
                className={cn("text-sm py-1 px-3 border-2 cursor-pointer", getRecommendationBadgeVariant(post.recommendationType))}
                onClick={handleStockClick}
              >
                <RecommendationIcon type={post.recommendationType} />
                {post.recommendationType.toUpperCase()}
                {post.stockSymbol && <span className="ml-1.5 font-normal">({post.stockSymbol})</span>}
              </Badge>
              {post.targetPrice && (
                <span className="ml-3 text-sm text-muted-foreground">Target: <span className="font-semibold text-foreground">₹{post.targetPrice.toFixed(2)}</span></span>
              )}
            </div>
          )}

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
              {post.stockSymbol && post.stockChangePercent !== undefined && !isResearchPost && ( // Only show this if not a research post with its own symbol display
                <div 
                  className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-medium shadow-md cursor-pointer"
                  onClick={handleStockClick}
                >
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
