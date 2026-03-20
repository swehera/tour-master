'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Search, Trash2, Edit, Star, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { tourService } from '@/services/tour.service';
import { Table, Pagination } from '@/components/dashboard/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/utils/formatDate';
import { statusColor, difficultyColor, getImageUrl } from '@/utils/helpers';

export default function ToursAdminPage() {
  const [tours,    setTours]    = useState([]);
  const [meta,     setMeta]     = useState({});
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('');
  const [page,     setPage]     = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search };
      if (status === 'active')   params.is_active   = true;
      if (status === 'inactive') params.is_active   = false;
      if (status === 'featured') params.is_featured = true;
      const res = await tourService.getAll(params);
      setTours(res.data?.data?.tours || []);
      setMeta(res.data?.data?.meta   || {});
    } catch { toast.error('Failed to load tours'); }
    finally  { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { fetchTours(); }, [fetchTours]);

  const handleDelete = async () => {
    try {
      await tourService.delete(deleteId);
      toast.success('Tour deleted');
      setDeleteId(null);
      fetchTours();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await tourService.toggleFeatured(id);
      toast.success('Updated');
      fetchTours();
    } catch { toast.error('Failed to update'); }
  };

  const handleToggleActive = async (id) => {
    try {
      await tourService.toggleActive(id);
      toast.success('Updated');
      fetchTours();
    } catch { toast.error('Failed to update'); }
  };

  const columns = [
    { key: 'title', label: 'Tour', render: r => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
          <img src={getImageUrl(r.cover_image)} alt={r.title} className="w-full h-full object-cover"
            onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100&q=60'; }} />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[180px]">{r.title}</p>
          <p className="text-xs text-gray-400">{r.destination}</p>
        </div>
      </div>
    )},
    { key: 'price',      label: 'Price',      render: r => <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(r.discount_price || r.price)}</span> },
    { key: 'difficulty', label: 'Difficulty', render: r => <span className={`badge-status ${difficultyColor(r.difficulty)}`}>{r.difficulty}</span> },
    { key: 'is_active',  label: 'Status',     render: r => <span className={`badge-status ${statusColor(r.is_active ? 'active' : 'inactive')}`}>{r.is_active ? 'Active' : 'Inactive'}</span> },
    { key: 'is_featured',label: 'Featured',   render: r => (
      <button onClick={() => handleToggleFeatured(r.id)} title="Toggle featured"
        className={`p-1.5 rounded-lg transition-colors ${r.is_featured ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-gray-300 hover:text-amber-400'}`}>
        <Star className={`w-4 h-4 ${r.is_featured ? 'fill-current' : ''}`} />
      </button>
    )},
    { key: 'actions', label: 'Actions', render: r => (
      <div className="flex items-center gap-1">
        <button onClick={() => handleToggleActive(r.id)}
          className={`p-1.5 rounded-lg transition-colors ${r.is_active ? 'text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          title={r.is_active ? 'Deactivate' : 'Activate'}>
          {r.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <Link href={`/dashboard/tours/${r.id}`}>
          <button className="p-1.5 rounded-lg text-gray-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        </Link>
        <button onClick={() => setDeleteId(r.id)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Tours</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{meta.total || 0} total tours</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="icon" onClick={fetchTours}><RefreshCw className="w-4 h-4" /></Button>
          <Link href="/dashboard/tours/create">
            <Button><Plus className="w-4 h-4" /> New Tour</Button>
          </Link>
        </div>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search tours…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="">All Tours</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="featured">Featured</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <Table columns={columns} data={tours} loading={loading} emptyMessage="No tours found" />
        <Pagination page={page} totalPages={meta.totalPages} total={meta.total} limit={10} onPage={setPage} />
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Tour"
        footer={<>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete Tour</Button>
        </>}>
        <p className="text-gray-600 dark:text-gray-300">This will permanently delete the tour and all associated images. This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
