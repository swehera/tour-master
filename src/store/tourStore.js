'use client';
import { create } from 'zustand';

const useTourStore = create((set) => ({
  tours:    [],
  total:    0,
  loading:  false,
  filters:  { page: 1, limit: 9, search: '', category: '', difficulty: '', sort_by: 'created_at', sort_order: 'desc' },

  setTours:   (tours, total) => set({ tours, total }),
  setLoading: (loading) => set({ loading }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters, page: 1 } })),
  setPage:    (page) => set((s) => ({ filters: { ...s.filters, page } })),
  reset:      () => set({ tours: [], total: 0, filters: { page: 1, limit: 9, search: '', category: '', difficulty: '', sort_by: 'created_at', sort_order: 'desc' } }),
}));

export default useTourStore;
