import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Users, MapPin, ArrowRight } from 'lucide-react';
import { getImageUrl, difficultyColor } from '@/utils/helpers';
import { formatCurrency } from '@/utils/formatDate';
import { cn } from '@/utils/helpers';

export default function TourCard({ tour }) {
  const imageUrl = getImageUrl(tour.cover_image);
  return (
    <div className="card group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <img src={imageUrl} alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {tour.is_featured && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-400 text-amber-900 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> Featured
            </span>
          )}
          <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', difficultyColor(tour.difficulty))}>
            {tour.difficulty}
          </span>
        </div>
        {tour.discount_price && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <MapPin className="w-3 h-3" /> {tour.destination}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-3 group-hover:text-sky-500 transition-colors leading-snug">
          {tour.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tour.duration_days}d</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Max {tour.max_group_size}</span>
          {tour.rating_count > 0 && (
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-current" /> {parseFloat(tour.rating_avg || 0).toFixed(1)} ({tour.rating_count})
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-sky-600 dark:text-sky-400">
              {formatCurrency(tour.discount_price || tour.price)}
            </span>
            {tour.discount_price && (
              <span className="text-xs text-gray-400 line-through ml-2">{formatCurrency(tour.price)}</span>
            )}
            <span className="text-xs text-gray-400 block">per person</span>
          </div>
          <Link href={`/tours/${tour.slug || tour.id}`}
            className="flex items-center gap-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors">
            Book <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
