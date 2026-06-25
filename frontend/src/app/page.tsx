"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCRM } from '@/context/CRMContext';

export default function RootPage() {
  const { user, mounted } = useCRM();
  const router = useRouter();

  useEffect(() => {
    if (mounted) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, mounted, router]);

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-txt-secondary font-semibold">Redirecting...</p>
      </div>
    </div>
  );
}
