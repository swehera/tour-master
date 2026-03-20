'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import useAuthStore from '@/store/authStore';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading, init } = useAuthStore();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => { init(); }, []);
  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login?from=/dashboard');
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar />
      {/*
        Mobile: full width, pt-14 for the top bar
        Desktop: margin-left matches sidebar width (w-60 = 240px, collapsed w-16 = 64px)
      */}
      <main className="pt-14 lg:pt-0 lg:ml-60 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}
