'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Map, CalendarCheck, CheckCircle, Clock, Star, Plus, ArrowRight, TrendingUp, Users } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { bookingService } from '@/services/booking.service';
import { tourService } from '@/services/tour.service';
import { formatCurrency, formatDate } from '@/utils/formatDate';
import { statusColor, getImageUrl } from '@/utils/helpers';
import useAuthStore from '@/store/authStore';

export default function GuideDashboard() {
  const { user } = useAuthStore();
  const [bookings,  setBookings]  = useState([]);
  const [tours,     setTours]     = useState([]);
  const [loadingB,  setLoadingB]  = useState(true);
  const [loadingT,  setLoadingT]  = useState(true);

  useEffect(() => {
    // Get all bookings (guide can see all)
    bookingService.getAll({ limit: 50, page: 1 })
      .then(res => setBookings(res.data?.data?.bookings || []))
      .catch(() => {})
      .finally(() => setLoadingB(false));

    // Get tours created by or assigned to guide
    tourService.getAll({ limit: 50, page: 1 })
      .then(res => setTours(res.data?.data?.tours || []))
      .catch(() => {})
      .finally(() => setLoadingT(false));
  }, []);

  // Compute stats from data
  const totalTours     = tours.length;
  const activeTours    = tours.filter(t => t.is_active).length;
  const totalBookings  = bookings.length;
  const pending        = bookings.filter(b => b.status === 'pending').length;
  const confirmed      = bookings.filter(b => b.status === 'confirmed').length;
  const upcoming       = bookings.filter(b => b.status === 'confirmed' && new Date(b.tour_date) >= new Date()).length;
  const totalRevenue   = bookings.filter(b => b.payment_status === 'paid').reduce((s, b) => s + parseFloat(b.total_price || 0), 0);

  const recentBookings = [...bookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  const topTours = [...tours]
    .sort((a, b) => parseInt(b.booking_count || 0) - parseInt(a.booking_count || 0))
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Guide Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome, {user?.name} 👋</p>
        </div>
        <Link href="/dashboard/tours/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors self-start sm:self-auto">
          <Plus className="w-4 h-4" /> New Tour
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <DashboardCard title="My Tours"      value={totalTours}            icon={Map}           color="purple" loading={loadingT} />
        <DashboardCard title="Active Tours"  value={activeTours}           icon={Star}          color="amber"  loading={loadingT} />
        <DashboardCard title="Total Bookings"value={totalBookings}         icon={CalendarCheck} color="sky"    loading={loadingB} />
        <DashboardCard title="Revenue Earned"value={formatCurrency(totalRevenue)} icon={TrendingUp} color="green" loading={loadingB} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <DashboardCard title="Pending"       value={pending}  icon={Clock}        color="amber" loading={loadingB} />
        <DashboardCard title="Confirmed"     value={confirmed}icon={CheckCircle}  color="green" loading={loadingB} />
        <DashboardCard title="Upcoming Trips"value={upcoming} icon={CalendarCheck}color="sky"   loading={loadingB} />
        <DashboardCard title="Travelers"
          value={bookings.reduce((s, b) => s + parseInt(b.num_adults || 0) + parseInt(b.num_children || 0), 0)}
          icon={Users} color="purple" loading={loadingB} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* My Tours */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">My Tours</h3>
            <Link href="/dashboard/tours" className="text-sm text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loadingT ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
          ) : topTours.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {topTours.map(tour => (
                <div key={tour.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <div className="w-12 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                    <img src={getImageUrl(tour.cover_image)} alt={tour.title}
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100&q=60'; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{tour.title}</p>
                    <p className="text-xs text-gray-400">{tour.destination} · {tour.duration_days}d</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-sky-600 dark:text-sky-400">{formatCurrency(tour.price)}</p>
                    <span className={`text-xs font-medium ${tour.is_active ? 'text-emerald-500' : 'text-gray-400'}`}>
                      {tour.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Map className="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 text-sm font-medium">No tours yet</p>
              <Link href="/dashboard/tours/create"
                className="inline-flex items-center gap-1 mt-3 text-sky-500 text-sm hover:text-sky-600 font-medium">
                <Plus className="w-4 h-4" /> Create your first tour
              </Link>
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Recent Bookings</h3>
            <Link href="/dashboard/bookings" className="text-sm text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loadingB ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
          ) : recentBookings.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentBookings.map(booking => (
                <div key={booking.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-900/20 flex items-center justify-center text-sky-600 dark:text-sky-400 text-sm font-bold shrink-0">
                    {booking.user_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{booking.user_name || 'Guest'}</p>
                    <p className="text-xs text-gray-400 truncate">{booking.tour_title} · {formatDate(booking.tour_date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(booking.total_price)}</p>
                    <span className={`badge-status text-xs ${statusColor(booking.status)}`}>{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">No bookings yet</div>
          )}
        </div>
      </div>

      {/* Upcoming confirmed trips */}
      {!loadingB && upcoming > 0 && (
        <div className="card overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              Upcoming Confirmed Trips
              <span className="ml-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full">{upcoming}</span>
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {bookings
              .filter(b => b.status === 'confirmed' && new Date(b.tour_date) >= new Date())
              .sort((a, b) => new Date(a.tour_date) - new Date(b.tour_date))
              .slice(0, 5)
              .map(booking => (
                <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CalendarCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{booking.tour_title}</p>
                      <p className="text-xs text-gray-400">{booking.user_name} · {booking.num_adults} adult{booking.num_adults > 1 ? 's' : ''}{booking.num_children > 0 ? `, ${booking.num_children} child${booking.num_children > 1 ? 'ren' : ''}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatDate(booking.tour_date)}</span>
                    <span className="font-mono text-xs text-gray-400 hidden sm:block">{booking.booking_ref}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
