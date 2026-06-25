"use client";

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CRMProvider, useCRM } from '@/context/CRMContext';
import ShellLayout from './ShellLayout';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const crm = useCRM();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (crm.mounted) {
      if (!crm.user && pathname !== '/login') {
        router.push('/login');
      } else if (crm.user && (pathname === '/login' || pathname === '/')) {
        router.push('/dashboard');
      }
    }
  }, [crm.user, crm.mounted, pathname, router]);

  // Prevent flash of content if not mounted or if checking auth
  if (!crm.mounted) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-txt-secondary font-semibold">Loading CRM Cloud Session...</p>
        </div>
      </div>
    );
  }

  // If user is null and we are not on /login, show loading spinner while redirecting
  if (!crm.user && pathname !== '/login') {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-txt-secondary font-semibold">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <ShellLayout>{children}</ShellLayout>;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CRMProvider>
      <AuthGuard>{children}</AuthGuard>
    </CRMProvider>
  );
}
