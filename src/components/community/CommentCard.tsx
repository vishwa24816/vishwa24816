
"use client";

import React from 'react';
import type { Comment } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentCardProps {
    comment: Comment;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
    const timeAgo = formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true });
    const userInitial = comment.user.name[0].toUpperCase();

    return (
        <div className="flex space-x-3">
            <Avatar className="h-9 w-9">
                <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} data-ai-hint="user avatar" />
                <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
                <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-1.5 text-sm">
                            <span className="font-semibold text-foreground">{comment.user.name}</span>
                            <span className="text-muted-foreground">@{comment.user.username}</span>
                        </div>
                         <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-background/50 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-foreground/90">{comment.content}</p>
                </div>
                 <div className="flex items-center space-x-3 pl-2 text-xs text-muted-foreground">
                    <span>{timeAgo}</span>
                    <Button variant="ghost" size="sm" className="p-1 h-auto text-xs flex items-center gap-1 hover:text-primary">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{comment.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-auto text-xs flex items-center gap-1 hover:text-primary">
                         <MessageCircle className="h-3.5 w-3.5" />
                        <span>Reply</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
