'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export const useAuth = () => {
  const store = useAuthStore();
  return store;
};

export const useRequireAuth = (requiredRole = null) => {
  const { user, isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      if (requiredRole && user?.role !== requiredRole) {
        if (requiredRole === 'admin' && user?.role !== 'admin') {
          router.push('/dashboard');
        }
      }
    }
  }, [isAuthenticated, loading, user, router, requiredRole]);

  return { user, isAuthenticated, loading };
};
