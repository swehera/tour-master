'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { tourService } from '@/services/tour.service';
import { bookingService } from '@/services/booking.service';
import useAuthStore from '@/store/authStore';
import { formatCurrency, formatDate } from '@/utils/formatDate';
import { getImageUrl, difficultyColor } from '@/utils/helpers';
import { Clock, Users, MapPin, Star, Check, X, Calendar, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

export default function TourDetailPage() {
  const { id: slug } = useParams();
  const router     = useRouter();
  const { user, isAuthenticated, init } = useAuthStore();
  const [tour,     setTour]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [booking,  setBooking]  = useState(false);
  const [adults,   setAdults]   = useState(1);
  const [children, setChildren] = useState(0);
  const [tourDate, setTourDate] = useState('');
  const [showDesc, setShowDesc] = useState(false);

  useEffect(() => { init(); }, []);
  useEffect(() => {
    tourService.getBySlug(slug)
      .then(res => setTour(res.data?.data?.tour))
      .catch(() => toast.error('Tour not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
    </div>
  );

  if (!tour) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl text-gray-500">Tour not found</p>
        <button onClick={() => router.push('/tours')} className="mt-4 text-sky-500 hover:underline">Back to tours</button>
      </div>
    </div>
  );

  const price      = parseFloat(tour.discount_price || tour.price);
  const total      = (adults * price) + (children * price * 0.5);
  const minDate    = new Date(); minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleBook = async () => {
    if (!isAuthenticated) { toast.error('Please log in to book'); router.push('/login'); return; }
    if (!tourDate) { toast.error('Please select a tour date'); return; }
    setBooking(true);
    try {
      const res = await bookingService.create({ tour_id: tour.id, tour_date: tourDate, num_adults: adults, num_children: children });
      toast.success(`Booking confirmed! Ref: ${res.data.data.booking.booking_ref}`);
      router.push('/dashboard/bookings');
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed'); }
    finally { setBooking(false); }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
        {/* Hero */}
        <div className="relative h-[55vh] bg-gray-900">
          <img src={getImageUrl(tour.cover_image)} alt={tour.title}
            className="w-full h-full object-cover opacity-70"
            onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`badge-status ${difficultyColor(tour.difficulty)}`}>{tour.difficulty}</span>
              {tour.category && <span className="badge-status bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400">{tour.category}</span>}
              {tour.is_featured && <span className="badge-status bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">⭐ Featured</span>}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{tour.title}</h1>
            <div className="flex flex-wrap items-center gap-5 text-gray-200 text-sm">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-sky-400" />{tour.destination}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-sky-400" />{tour.duration_days} days</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-sky-400" />Max {tour.max_group_size}</span>
              {tour.rating_count > 0 && (
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" />{parseFloat(tour.rating_avg).toFixed(1)} ({tour.rating_count} reviews)</span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About This Tour</h2>
                <div className={cn('text-gray-600 dark:text-gray-300 leading-relaxed text-sm', !showDesc && 'line-clamp-5')}>
                  {tour.description}
                </div>
                {tour.description?.length > 400 && (
                  <button onClick={() => setShowDesc(!showDesc)} className="mt-3 flex items-center gap-1 text-sky-500 text-sm font-medium">
                    {showDesc ? <><ChevronUp className="w-4 h-4" /> Show less</> : <><ChevronDown className="w-4 h-4" /> Read more</>}
                  </button>
                )}
              </div>

              {/* Highlights */}
              {tour.highlights?.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Highlights</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tour.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Included / Excluded */}
              {(tour.included?.length > 0 || tour.excluded?.length > 0) && (
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What's Included</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {tour.included?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2 text-sm">Included</h3>
                        <ul className="space-y-1.5">
                          {tour.included.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {tour.excluded?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-red-500 mb-2 text-sm">Not Included</h3>
                        <ul className="space-y-1.5">
                          {tour.excluded.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <X className="w-4 h-4 text-red-400 shrink-0" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Meeting Point */}
              {tour.meeting_point && (
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Meeting Point</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-500 shrink-0" /> {tour.meeting_point}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Booking Card */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-20">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-sky-600 dark:text-sky-400">{formatCurrency(price)}</span>
                  {tour.discount_price && (
                    <span className="text-gray-400 line-through text-sm ml-2">{formatCurrency(tour.price)}</span>
                  )}
                  <span className="text-gray-400 text-sm"> / person</span>
                </div>

                <div className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      <Calendar className="w-4 h-4 inline mr-1" /> Tour Date *
                    </label>
                    <input type="date" min={minDateStr} value={tourDate} onChange={e => setTourDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>

                  {/* Adults */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Adults</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">−</button>
                      <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">{adults}</span>
                      <button onClick={() => setAdults(Math.min(tour.max_group_size, adults + 1))}
                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">+</button>
                    </div>
                  </div>

                  {/* Children */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Children <span className="text-xs text-gray-400">(50% off)</span></label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">−</button>
                      <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">{children}</span>
                      <button onClick={() => setChildren(Math.min(10, children + 1))}
                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">+</button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>{adults} adult{adults > 1 ? 's' : ''} × {formatCurrency(price)}</span>
                      <span>{formatCurrency(adults * price)}</span>
                    </div>
                    {children > 0 && (
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>{children} child{children > 1 ? 'ren' : ''} × {formatCurrency(price * 0.5)}</span>
                        <span>{formatCurrency(children * price * 0.5)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white text-lg mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span>Total</span>
                      <span className="text-sky-600 dark:text-sky-400">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Button onClick={handleBook} loading={booking} className="w-full" size="lg">
                    {isAuthenticated ? 'Book Now' : 'Login to Book'}
                  </Button>
                  <p className="text-xs text-center text-gray-400">Free cancellation up to 24 hours before the tour</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
