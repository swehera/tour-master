import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TourForm from '@/components/tour/TourForm';
import Button from '@/components/ui/Button';

export const metadata = { title: 'Create Tour' };

export default function CreateTourPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/tours">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="page-title">Create New Tour</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Fill in the details to publish a new tour</p>
        </div>
      </div>
      <TourForm />
    </div>
  );
}
