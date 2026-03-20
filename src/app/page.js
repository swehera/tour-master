'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import TourCard from '@/components/tour/TourCard';
import { tourService } from '@/services/tour.service';
import useAuthStore from '@/store/authStore';
import { MapPin, Shield, Headphones, Star, ChevronRight, ArrowRight, Globe, Mountain, Waves, Camera, Award, Users } from 'lucide-react';

const stats = [
  { value: '50+', label: 'Destinations' },
  { value: '10K+', label: 'Happy Travelers' },
  { value: '200+', label: 'Tour Packages' },
  { value: '15+', label: 'Years Experience' },
];
const features = [
  { icon: MapPin,      title: 'Expert Local Guides',     desc: 'Our certified guides bring destinations to life with insider knowledge and passion.' },
  { icon: Shield,      title: 'Safe & Secure',           desc: 'Travel with confidence. All tours include travel insurance and 24/7 support.' },
  { icon: Headphones,  title: '24/7 Customer Support',   desc: 'We\'re always here for you — before, during, and after your adventure.' },
  { icon: Award,       title: 'Best Price Guarantee',    desc: 'Find the same tour cheaper elsewhere? We\'ll match it and give you 10% off.' },
];
const categories = [
  { icon: Mountain, label: 'Adventure',  desc: 'Trek, climb, explore',    color: 'from-emerald-400 to-teal-600',   q: 'adventure' },
  { icon: Waves,    label: 'Beach',      desc: 'Sun, sand, sea',          color: 'from-sky-400 to-blue-600',       q: 'beach' },
  { icon: Camera,   label: 'Cultural',   desc: 'History & heritage',      color: 'from-amber-400 to-orange-600',   q: 'cultural' },
  { icon: Globe,    label: 'World Tour', desc: 'See it all',              color: 'from-purple-400 to-violet-600',  q: 'world' },
];
const testimonials = [
  { name: 'Sarah M.', location: 'New York, USA', rating: 5, text: 'Absolutely incredible experience! The guides were knowledgeable and the itinerary was perfectly planned. Will definitely book again.' },
  { name: 'James L.', location: 'London, UK',    rating: 5, text: 'Best travel company I\'ve used. Everything was seamless from booking to the final day. Highly recommend TourMaster!' },
  { name: 'Aiko T.', location: 'Tokyo, Japan',   rating: 5, text: 'The Himalayan trek was life-changing. Our guide was exceptional and the whole team made us feel safe and cared for.' },
];

export default function HomePage() {
  const { init } = useAuthStore();
  const [featuredTours, setFeaturedTours] = useState([]);
  const [toursLoading, setToursLoading] = useState(true);

  useEffect(() => { init(); }, []);
  useEffect(() => {
    tourService.getPublic({ is_featured: true, limit: 6 })
      .then(res => setFeaturedTours(res.data?.data?.tours || []))
      .catch(() => {})
      .finally(() => setToursLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-screen hero-gradient flex items-center">
          <div className="absolute inset-0 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
              alt="Hero" className="w-full h-full object-cover opacity-20" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-sky-300 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-white/20">
              <Star className="w-4 h-4 fill-current" /> Rated #1 Travel Agency 2024
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Explore The<br />
              <span className="text-gradient">World With Us</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover breathtaking destinations, immerse yourself in local cultures, and create memories that last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tours" className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-sky-500/30 flex items-center justify-center gap-2">
                Explore Tours <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all">
                Contact Us
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
              {stats.map(({ value, label }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-3xl font-bold text-white">{value}</div>
                  <div className="text-sm text-white/70 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tour Categories</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">Find the perfect adventure for your style</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {categories.map(({ icon: Icon, label, desc, color, q }) => (
                <Link key={label} href={`/tours?category=${q}`}
                  className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br text-white cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${color.replace('from-', '').replace('to-', ', ')})` }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90`} />
                  <div className="relative">
                    <Icon className="w-10 h-10 mb-3 opacity-90" />
                    <h3 className="text-lg font-bold mb-1">{label}</h3>
                    <p className="text-sm opacity-80">{desc}</p>
                    <ChevronRight className="w-5 h-5 mt-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Tours ── */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Featured Tours</h2>
                <p className="text-gray-500 dark:text-gray-400">Handpicked experiences loved by travelers</p>
              </div>
              <Link href="/tours" className="hidden md:flex items-center gap-2 text-sky-500 font-medium hover:text-sky-600">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {toursLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="card overflow-hidden animate-pulse">
                    <div className="h-52 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTours.map(tour => <TourCard key={tour.id} tour={tour} />)}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Globe className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No featured tours yet. Check back soon!</p>
              </div>
            )}
            <div className="text-center mt-10">
              <Link href="/tours" className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-colors inline-flex items-center gap-2">
                Browse All Tours <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose TourMaster?</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">We go the extra mile to make your journey exceptional</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card p-6 text-center hover:shadow-md transition-shadow group">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-sky-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">What Travelers Say</h2>
              <p className="text-gray-500 dark:text-gray-400">Real stories from our happy customers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(({ name, location, rating, text }) => (
                <div key={name} className="card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-1 mb-4">
                    {Array(rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5 italic">"{text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-sm">{name[0]}</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{name}</p>
                      <p className="text-xs text-gray-400">{location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600/80 to-blue-800/80" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready for Your Next Adventure?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Join thousands of travelers who trust TourMaster for unforgettable experiences.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tours" className="px-8 py-4 bg-white text-sky-600 font-bold rounded-xl hover:bg-sky-50 transition-colors shadow-lg">
                Browse Tours
              </Link>
              <Link href="/register" className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl border border-white/30 transition-colors">
                Sign Up Free
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
