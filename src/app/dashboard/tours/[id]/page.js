'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { tourService } from '@/services/tour.service';
import TourForm from '@/components/tour/TourForm';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function EditTourPage() {
  const { id } = useParams();
  const [tour,    setTour]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tourService.getById(id)
      .then(res => setTour(res.data?.data?.tour))
      .catch(() => toast.error('Tour not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/tours">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="page-title">Edit Tour</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 truncate max-w-md">{tour?.title}</p>
        </div>
      </div>
      {tour ? <TourForm tour={tour} /> : (
        <div className="card p-8 text-center text-gray-400">Tour not found</div>
      )}
    </div>
  );
}
