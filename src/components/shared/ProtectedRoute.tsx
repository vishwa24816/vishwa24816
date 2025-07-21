"use client";

import React, { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const LoadingSpinner = () => (
    <div className="flex min-h-screen items-center justify-center p-4">
        <svg
            className="h-16 w-16 animate-spin-slow text-primary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
        >
            <g transform="translate(50, 50)">
                <path d="M0 -45 A 45 45 0 0 1 31.82 -31.82" stroke="#4ade80" strokeWidth="8" />
                <path d="M45 0 A 45 45 0 0 1 31.82 31.82" stroke="#facc15" strokeWidth="8" />
                <path d="M0 45 A 45 45 0 0 1 -31.82 31.82" stroke="#ef4444" strokeWidth="8" />
                <path d="M-45 0 A 45 45 0 0 1 -31.82 -31.82" stroke="#3b82f6" strokeWidth="8" />
            </g>
        </svg>
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
