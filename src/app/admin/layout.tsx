'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';

function AdminProtectedContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();

  const isLoginPage = pathname === '/admin/login' || pathname?.startsWith('/admin/login');

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // If on login page, render children directly with NO sidebar and NO blocker
  if (isLoginPage) {
    return <main className="min-h-screen bg-[#FAF7F2]">{children}</main>;
  }

  // If loading or not authenticated, show loading indicator while redirecting
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#C45A2C] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#8C7A6B] font-medium">Checking authorization...</span>
      </div>
    );
  }

  // Authenticated Admin with sidebar
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminProtectedContent>{children}</AdminProtectedContent>
    </AdminAuthProvider>
  );
}
