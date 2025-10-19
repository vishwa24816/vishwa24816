
"use client";
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || (!loading && isAuthenticated)) {
     return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-blue-100 p-4">
          <p className="text-lg">Loading...</p>
        </div>
      );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-blue-100 p-4">
      <LoginForm />
    </div>
  );
}
