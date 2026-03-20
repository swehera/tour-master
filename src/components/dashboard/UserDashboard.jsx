'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { bookingService } from '@/services/booking.service';
import { tourService } from '@/services/tour.service';
import { formatCurrency, formatDate } from '@/utils/formatDate';
import { statusColor, getImageUrl } from '@/utils/helpers';
import { CalendarCheck, MapPin, Clock, ArrowRight, Star, Package, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';

function StatCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className={`rounded-xl border p-4 flex items-center gap-3 ${colorClass}`}>
      <Icon className="w-7 h-7 shrink-0" />
      <div>
        <p className="text-xl font-bold leading-none">{value}</p>
        <p className="text-xs opacity-75 mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [bookings,      setBookings]      = useState([]);
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loadingB,      setLoadingB]      = useState(true);
  const [loadingT,      setLoadingT]      = useState(true);

  useEffect(() => {
    bookingService.getMy({ limit: 20, page: 1 })
      .then(res => setBookings(res.data?.data?.bookings || []))
      .catch(() => {})
      .finally(() => setLoadingB(false));

    tourService.getPublic({ is_featured: true, limit: 3 })
      .then(res => setFeaturedTours(res.data?.data?.tours || []))
      .catch(() => {})
      .finally(() => setLoadingT(false));
  }, []);

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero greeting */}
      <div className="card p-5 sm:p-6 bg-gradient-to-r from-sky-500 to-blue-600 border-0 text-white rounded-2xl">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-sky-100 text-sm">Ready for your next adventure?</p>
        <Link href="/tours"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-sky-600 font-semibold rounded-lg hover:bg-sky-50 transition-colors text-sm">
          Explore Tours <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-3">My Booking Summary</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Package}     label="Total"     value={stats.total}     colorClass="bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800" />
          <StatCard icon={CheckCircle} label="Confirmed" value={stats.confirmed} colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" />
          <StatCard icon={Star}        label="Completed" value={stats.completed} colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800" />
          <StatCard icon={XCircle}     label="Cancelled" value={stats.cancelled} colorClass="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800" />
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">My Recent Bookings</h2>
          <Link href="/dashboard/bookings" className="text-sm text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingB ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-sky-500" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {bookings.slice(0, 5).map(booking => (
              <div key={booking.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                  <img
                    src={getImageUrl(booking.tour_image)}
                    alt={booking.tour_title}
                    className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100&q=60'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{booking.tour_title || 'Tour'}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <CalendarCheck className="w-3 h-3" />{formatDate(booking.tour_date)}
                    </span>
                    <span className="text-xs font-mono text-gray-300 dark:text-gray-600 hidden sm:inline">{booking.booking_ref}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{formatCurrency(booking.total_price)}</p>
                  <span className={`badge-status mt-0.5 ${statusColor(booking.status)}`}>{booking.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarCheck className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 font-medium text-sm">No bookings yet</p>
            <p className="text-xs text-gray-400 mt-1">Start exploring to make your first booking!</p>
            <Link href="/tours"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors text-sm">
              Browse Tours <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Featured Tours */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Featured Tours</h2>
          <Link href="/tours" className="text-sm text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loadingT ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-700" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredTours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredTours.map(tour => (
              <Link key={tour.id} href={`/tours/${tour.slug || tour.id}`}
                className="card overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 group">
                <div className="relative h-32 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={getImageUrl(tour.cover_image)}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=70'; }}
                  />
                  {tour.is_featured && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" /> Featured
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-sky-500 transition-colors">
                    {tour.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />{tour.destination}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />{tour.duration_days}d
                    </span>
                  </div>
                  <p className="text-sky-600 dark:text-sky-400 font-bold text-sm mt-1.5">
                    {formatCurrency(tour.discount_price || tour.price)}
                    <span className="text-xs text-gray-400 font-normal"> /person</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-gray-400 text-sm">No featured tours right now</div>
        )}
      </div>
    </div>
  );
}
