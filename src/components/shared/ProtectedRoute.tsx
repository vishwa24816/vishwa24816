
"use client";

import React, { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const LoadingSpinner = () => (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
        <Image
            src="https://img.notionusercontent.com/s3/prod-files-secure%2F7526fb47-9c52-81ef-9df9-00033e87bb4d%2F44533ca6-21d9-4c13-919e-f6d332ea4fc4%2FScreenshot_20250505-214836-643_(1)_(1).png/size/w=680?exp=1761137242&sig=n1ZaahjC9NRyI-xqNn1VtzAQCL8OANTioQvhbjQbIlY&id=2916fb47-9c52-80cf-8195-fcb3959ede09&table=block"
            alt="Loading SIM"
            width={300}
            height={300}
            className="animate-spin-slow w-[50vmin] h-[50vmin] max-w-[300px] max-h-[300px]"
            unoptimized
        />
    </div>
);


export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
