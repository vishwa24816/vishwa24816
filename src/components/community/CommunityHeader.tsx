
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Search, Flame, MoreVertical, Home, LogOut, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function CommunityHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-slate-800 text-gray-100 shadow-md sticky top-0 z-50 h-16 flex items-center">
      <div className="container mx-auto flex items-center justify-between px-2 sm:px-4 lg:px-6">
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-slate-700 hover:text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
             <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0 flex flex-col bg-slate-800 border-r-slate-700 text-gray-100">
                <SheetHeader className="p-6 pb-4 border-b border-slate-700">
                    <SheetTitle className="text-xl font-headline text-primary">SIM Community Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-1 p-4 flex-grow">
                    <SheetClose asChild>
                    <Button
                        variant="ghost"
                        className="justify-start text-base p-3 text-gray-200 hover:bg-slate-700 hover:text-white"
                        onClick={() => router.push('/')}
                    >
                        <Home className="mr-3 h-5 w-5 text-primary" />
                        Dashboard Home
                    </Button>
                    </SheetClose>
                     <SheetClose asChild>
                    <Button
                        variant="ghost"
                        className="justify-start text-base p-3 text-gray-200 hover:bg-slate-700 hover:text-white"
                        onClick={() => alert('Community Guidelines coming soon!')}
                    >
                        <Info className="mr-3 h-5 w-5 text-primary" />
                        Guidelines
                    </Button>
                    </SheetClose>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    {user && (
                        <div className="mb-4 text-sm text-gray-400">
                            Logged in as: <span className="font-medium text-gray-200">{user.email}</span>
                        </div>
                    )}
                    <SheetClose asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-base p-3 text-red-400 border-red-500 hover:text-red-300 hover:bg-red-500/20"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </Button>
                    </SheetClose>
                </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold">Community</h1>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-slate-700 hover:text-white">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search Community</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-slate-700 hover:text-white">
            <Flame className="h-5 w-5 text-orange-400" />
            <span className="sr-only">Trending Posts</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-slate-700 hover:text-white">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">More options</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

    