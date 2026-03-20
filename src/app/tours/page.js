'use client';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import TourCard from '@/components/tour/TourCard';
import { tourService } from '@/services/tour.service';
import useAuthStore from '@/store/authStore';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ToursPage() {
  const { init } = useAuthStore();
  const [tours,      setTours]      = useState([]);
  const [meta,       setMeta]       = useState({});
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sortBy,     setSortBy]     = useState('created_at');
  const [page,       setPage]       = useState(1);
  const [showFilters,setShowFilters]= useState(false);

  useEffect(() => { init(); }, []);
  useEffect(() => {
    tourService.getCategories().then(res => setCategories(res.data?.data?.categories || [])).catch(() => {});
  }, []);

  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tourService.getPublic({ page, limit: 9, search, category, difficulty, sort_by: sortBy });
      setTours(res.data?.data?.tours || []);
      setMeta(res.data?.data?.meta   || {});
    } catch {} finally { setLoading(false); }
  }, [page, search, category, difficulty, sortBy]);

  useEffect(() => { fetchTours(); }, [fetchTours]);

  const clearFilters = () => { setSearch(''); setCategory(''); setDifficulty(''); setSortBy('created_at'); setPage(1); };
  const hasFilters   = search || category || difficulty || sortBy !== 'created_at';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 py-14 px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">All Tours</h1>
          <p className="text-sky-100 text-lg">Find your perfect adventure from our curated collection</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search destinations, tours…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-300 hover:border-sky-500 transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {hasFilters && <span className="w-2 h-2 rounded-full bg-sky-500" />}
            </button>
            <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="created_at">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="rating_avg">Top Rated</option>
              <option value="duration_days">Duration</option>
            </select>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="card p-4 mb-6 flex flex-wrap gap-3 items-end animate-slide-down">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Difficulty</label>
                <select value={difficulty} onChange={e => { setDifficulty(e.target.value); setPage(1); }}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="">Any Level</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              {hasFilters && (
                <button onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                  <X className="w-3.5 h-3.5" /> Clear All
                </button>
              )}
            </div>
          )}

          {/* Results count */}
          {!loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {meta.total || 0} tour{meta.total !== 1 ? 's' : ''} found
            </p>
          )}

          {/* Tours Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(9).fill(0).map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="h-52 bg-gray-200 dark:bg-gray-800" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No tours found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
              {hasFilters && <button onClick={clearFilters} className="mt-4 text-sky-500 hover:text-sky-600 text-sm font-medium">Clear filters</button>}
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-sky-500 text-white' : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => p + 1)} disabled={page === meta.totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
