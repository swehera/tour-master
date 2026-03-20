'use client';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Search, RefreshCw, CheckCircle, XCircle, Eye } from 'lucide-react';
import { bookingService } from '@/services/booking.service';
import { Table, Pagination } from '@/components/dashboard/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Select } from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/utils/formatDate';
import { statusColor } from '@/utils/helpers';
import { useForm } from 'react-hook-form';
import useAuthStore from '@/store/authStore';

export default function BookingsPage() {
  const { user } = useAuthStore();
  const isAdmin  = user?.role === 'admin' || user?.role === 'guide';

  const [bookings,  setBookings]  = useState([]);
  const [meta,      setMeta]      = useState({});
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [status,    setStatus]    = useState('');
  const [page,      setPage]      = useState(1);
  const [selected,  setSelected]  = useState(null);
  const [updating,  setUpdating]  = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const fn = isAdmin ? bookingService.getAll : bookingService.getMy;
      const res = await fn({ page, limit: 10, search, status });
      setBookings(res.data?.data?.bookings || []);
      setMeta(res.data?.data?.meta         || {});
    } catch { toast.error('Failed to load bookings'); }
    finally  { setLoading(false); }
  }, [page, search, status, isAdmin]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const openDetail = (booking) => {
    setSelected(booking);
    reset({ status: booking.status, payment_status: booking.payment_status, notes: booking.notes || '' });
  };

  const onUpdate = async (data) => {
    setUpdating(true);
    try {
      await bookingService.update(selected.id, data);
      toast.success('Booking updated');
      setSelected(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingService.cancel(id, 'Cancelled by admin');
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const columns = [
    { key: 'booking_ref', label: 'Ref', render: r => <span className="font-mono text-xs text-sky-600 dark:text-sky-400">{r.booking_ref}</span> },
    ...(isAdmin ? [{ key: 'user_name', label: 'Customer', render: r => (
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{r.user_name || '—'}</p>
        <p className="text-xs text-gray-400">{r.user_email}</p>
      </div>
    )}] : []),
    { key: 'tour_title',  label: 'Tour',    render: r => <span className="truncate block max-w-[160px]">{r.tour_title || '—'}</span> },
    { key: 'tour_date',   label: 'Date',    render: r => formatDate(r.tour_date) },
    { key: 'total_price', label: 'Amount',  render: r => <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(r.total_price)}</span> },
    { key: 'status',        label: 'Status',  render: r => <span className={`badge-status ${statusColor(r.status)}`}>{r.status}</span> },
    { key: 'payment_status',label: 'Payment', render: r => <span className={`badge-status ${statusColor(r.payment_status)}`}>{r.payment_status}</span> },
    { key: 'actions', label: 'Actions', render: r => (
      <div className="flex items-center gap-1">
        <button onClick={() => openDetail(r)}
          className="p-1.5 rounded-lg text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors" title="View/Edit">
          <Eye className="w-4 h-4" />
        </button>
        {r.status !== 'cancelled' && r.status !== 'completed' && (
          <button onClick={() => handleCancel(r.id)}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Cancel">
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{meta.total || 0} total bookings</p>
        </div>
        <Button variant="secondary" size="icon" onClick={fetchBookings}><RefreshCw className="w-4 h-4" /></Button>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        {isAdmin && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by ref, name…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
        )}
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <Table columns={columns} data={bookings} loading={loading} emptyMessage="No bookings found" />
        <Pagination page={page} totalPages={meta.totalPages} total={meta.total} limit={10} onPage={setPage} />
      </div>

      {/* Detail / Edit Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Booking — ${selected?.booking_ref}`} size="lg"
        footer={isAdmin ? <>
          <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
          <Button loading={updating} onClick={handleSubmit(onUpdate)}>
            <CheckCircle className="w-4 h-4" /> Save Changes
          </Button>
        </> : <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Customer',  selected.user_name],
                ['Email',     selected.user_email],
                ['Tour',      selected.tour_title],
                ['Date',      formatDate(selected.tour_date)],
                ['Adults',    selected.num_adults],
                ['Children',  selected.num_children],
                ['Total',     formatCurrency(selected.total_price)],
                ['Method',    selected.payment_method || '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-gray-400 text-xs mb-0.5">{label}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>

            {selected.special_requests && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                <p className="text-xs text-gray-400 mb-1">Special Requests</p>
                <p className="text-gray-700 dark:text-gray-300">{selected.special_requests}</p>
              </div>
            )}

            {isAdmin && (
              <form className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                <Select label="Booking Status" {...register('status')}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
                <Select label="Payment Status" {...register('payment_status')}>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </Select>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes</label>
                  <textarea rows={3} {...register('notes')} placeholder="Internal notes…"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
                </div>
              </form>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
