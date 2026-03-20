'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Map, CalendarCheck, DollarSign, TrendingUp, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { bookingService } from '@/services/booking.service';
import { formatCurrency, formatDate } from '@/utils/formatDate';
import { statusColor } from '@/utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import useAuthStore from '@/store/authStore';

export default function AdminDashboard() {
  const { user }  = useAuthStore();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getDashboard()
      .then(res => setData(res.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const b = data?.bookings || {};
  const t = data?.tours    || {};
  const u = data?.users    || {};

  const monthlyData = (data?.monthly_revenue || []).map(m => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m.month - 1],
    revenue: parseFloat(m.revenue || 0),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, {user?.name} 👋</p>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        <DashboardCard title="Total Revenue"  value={formatCurrency(b.total_revenue)} icon={DollarSign}    color="green"  loading={loading} />
        <DashboardCard title="Total Bookings" value={b.total_bookings || 0}           icon={CalendarCheck} color="sky"    loading={loading} />
        <DashboardCard title="Active Tours"   value={t.active || 0}                   icon={Map}           color="purple" loading={loading} />
        <DashboardCard title="Total Users"    value={u.total  || 0}                   icon={Users}         color="amber"  loading={loading} />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        <DashboardCard title="Confirmed"   value={b.confirmed || 0}                  icon={CheckCircle} color="green" loading={loading} />
        <DashboardCard title="Pending"     value={b.pending   || 0}                  icon={Clock}       color="amber" loading={loading} />
        <DashboardCard title="Cancelled"   value={b.cancelled || 0}                  icon={XCircle}     color="red"   loading={loading} />
        <DashboardCard title="Avg Booking" value={formatCurrency(b.avg_booking_value)} icon={TrendingUp} color="sky"  loading={loading} />
      </div>

      {/* Chart + Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 card p-4 sm:p-5">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Monthly Revenue</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                <Tooltip formatter={v => [formatCurrency(v), 'Revenue']} contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              {loading ? 'Loading…' : 'No revenue data yet'}
            </div>
          )}
        </div>

        <div className="card p-4 sm:p-5">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Overview</h3>
          <div className="space-y-3">
            {[
              { label: 'Featured Tours',    value: t.featured       || 0, color: 'text-purple-500' },
              { label: 'New Users (month)', value: u.new_this_month || 0, color: 'text-sky-500' },
              { label: 'Completed Trips',   value: b.completed      || 0, color: 'text-emerald-500' },
              { label: 'Total Tours',       value: t.total          || 0, color: 'text-amber-500' },
              { label: 'Cancelled',         value: b.cancelled      || 0, color: 'text-red-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <span className={`text-base font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Recent Bookings</h3>
          <Link href="/dashboard/bookings" className="text-sm text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
        ) : data?.recent_bookings?.length > 0 ? (
          <>
            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {data.recent_bookings.map(b => (
                <div key={b.id} className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-900 dark:text-white truncate max-w-[180px]">{b.tour_title || '—'}</span>
                    <span className={`badge-status ${statusColor(b.status)}`}>{b.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{b.user_name} · {b.booking_ref}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(b.total_price)}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full data-table">
                <thead><tr><th>Ref</th><th>Customer</th><th>Tour</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {data.recent_bookings.map(b => (
                    <tr key={b.id}>
                      <td className="font-mono text-xs">{b.booking_ref}</td>
                      <td>{b.user_name || '—'}</td>
                      <td className="max-w-[160px] truncate">{b.tour_title || '—'}</td>
                      <td>{formatDate(b.tour_date)}</td>
                      <td className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(b.total_price)}</td>
                      <td><span className={`badge-status ${statusColor(b.status)}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">No bookings yet</div>
        )}
      </div>
    </div>
  );
}
