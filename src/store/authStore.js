'use client';
import { create } from 'zustand';
import { setTokens, clearTokens, getStoredUser, getAccessToken } from '@/lib/auth';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  init: () => {
    const user  = getStoredUser();
    const token = getAccessToken();
    set({ user: user || null, isAuthenticated: !!(user && token), loading: false });
  },

  login: (data) => {
    const { user, accessToken, refreshToken } = data;
    setTokens(accessToken, refreshToken, user);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  isAdmin:  () => get().user?.role === 'admin',
  isGuide:  () => ['admin', 'guide'].includes(get().user?.role),
}));

export default useAuthStore;
