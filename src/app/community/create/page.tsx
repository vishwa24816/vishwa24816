
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Repeat, AtSign, Image as ImageIcon, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const characterLimit = 1000;

  const handlePost = () => {
    // Mock posting logic
    console.log({
      user: isAnonymous ? 'Anonymous' : user?.name || 'User',
      content: postContent,
    });
    router.push('/?view=community');
  };

  const userInitial = user?.name?.[0].toUpperCase() || user?.email?.[0].toUpperCase() || 'A';
  const userName = user?.name || user?.email || 'Anonymous';
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Create Post</h1>
        </div>
        <Button 
          onClick={handlePost} 
          disabled={!postContent.trim()}
          className="rounded-full bg-primary text-primary-foreground font-bold px-6 hover:bg-primary/90 disabled:bg-muted-foreground disabled:text-background"
        >
          Post
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 overflow-y-auto">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={!isAnonymous ? `https://placehold.co/100x100.png?text=${userInitial}` : undefined} 
                alt={userName}
                data-ai-hint="profile avatar"
              />
              <AvatarFallback className="bg-muted text-lg">
                {isAnonymous ? <UserIcon /> : userInitial}
              </AvatarFallback>
            </Avatar>
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-muted-foreground/50 hover:bg-muted-foreground/70"
                onClick={() => setIsAnonymous(!isAnonymous)}
            >
                <Repeat className="h-4 w-4 text-background" />
            </Button>
          </div>

          <div className="flex-1">
            <p className="font-semibold">{isAnonymous ? 'Anonymous' : userName}</p>
            <p className="text-sm text-muted-foreground">
              Click on your profile picture to toggle posting mode.
            </p>
          </div>
        </div>

        <div className="my-6 p-3 bg-primary/10 text-primary rounded-lg text-sm text-center">
            Read Community Guidelines before posting!
        </div>

        <Textarea
          value={postContent}
          onChange={(e) => {
            if (e.target.value.length <= characterLimit) {
              setPostContent(e.target.value);
            }
          }}
          placeholder="Enter your post here"
          className="w-full bg-transparent text-foreground border-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground p-0 h-48"
        />
        <p className="text-right text-sm text-muted-foreground mt-2">
          {postContent.length}/{characterLimit}
        </p>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t">
        <div className="flex items-center justify-between">
           <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
                    <AtSign className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
                    <ImageIcon className="h-6 w-6" />
                </Button>
                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
                    <BarChart2 className="h-6 w-6" />
                </Button>
           </div>
           <Button 
              onClick={handlePost} 
              disabled={!postContent.trim()}
              className="rounded-full bg-primary text-primary-foreground font-bold px-6 hover:bg-primary/90 md:hidden"
            >
              Post
            </Button>
        </div>
      </footer>
    </div>
  );
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
)
