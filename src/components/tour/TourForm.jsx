'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { tourService } from '@/services/tour.service';
import Button from '@/components/ui/Button';
import Input, { Textarea, Select } from '@/components/ui/Input';
import { Upload, X, Plus, Minus } from 'lucide-react';
import { getImageUrl } from '@/utils/helpers';

export default function TourForm({ tour = null }) {
  const router = useRouter();
  const isEdit = !!tour;
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState(tour?.cover_image ? getImageUrl(tour.cover_image) : null);
  const [coverFile,    setCoverFile]    = useState(null);
  const [highlights,   setHighlights]   = useState(tour?.highlights || ['']);
  const [included,     setIncluded]     = useState(tour?.included   || ['']);
  const [excluded,     setExcluded]     = useState(tour?.excluded   || ['']);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title:             tour?.title             || '',
      description:       tour?.description       || '',
      short_description: tour?.short_description || '',
      destination:       tour?.destination       || '',
      duration_days:     tour?.duration_days     || '',
      max_group_size:    tour?.max_group_size     || '',
      price:             tour?.price             || '',
      discount_price:    tour?.discount_price    || '',
      difficulty:        tour?.difficulty        || 'medium',
      category:          tour?.category          || '',
      meeting_point:     tour?.meeting_point     || '',
      is_featured:       tour?.is_featured       || false,
    },
  });

  const arrField = (arr, set) => ({
    items: arr,
    add:   () => set([...arr, '']),
    remove: (i) => set(arr.filter((_, idx) => idx !== i)),
    change: (i, v) => { const a = [...arr]; a[i] = v; set(a); },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== '' && v !== null) fd.append(k, v); });
      fd.append('highlights', JSON.stringify(highlights.filter(Boolean)));
      fd.append('included',   JSON.stringify(included.filter(Boolean)));
      fd.append('excluded',   JSON.stringify(excluded.filter(Boolean)));
      if (coverFile) fd.append('cover_image', coverFile);

      if (isEdit) {
        await tourService.update(tour.id, fd);
        toast.success('Tour updated!');
      } else {
        await tourService.create(fd);
        toast.success('Tour created!');
      }
      router.push('/dashboard/tours');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save tour');
    } finally {
      setLoading(false);
    }
  };

  const handleCover = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const hl = arrField(highlights, setHighlights);
  const inc = arrField(included, setIncluded);
  const exc = arrField(excluded, setExcluded);

  const ArrayField = ({ label, field }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="space-y-2">
        {field.items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={e => field.change(i, e.target.value)}
              placeholder={`${label} ${i + 1}`}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <button type="button" onClick={() => field.remove(i)}
              className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={field.add}
          className="flex items-center gap-1 text-sm text-sky-500 hover:text-sky-600 font-medium">
          <Plus className="w-4 h-4" /> Add item
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Cover Image */}
      <div className="card p-5">
        <h3 className="section-title mb-4">Cover Image</h3>
        <div className="flex items-start gap-5">
          <div className="w-48 h-36 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative shrink-0">
            {coverPreview
              ? <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
              : <div className="text-center text-gray-400"><Upload className="w-8 h-8 mx-auto mb-1" /><p className="text-xs">Upload image</p></div>
            }
          </div>
          <div>
            <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
              <Upload className="w-4 h-4" /> Choose Image
              <input type="file" accept="image/*" className="hidden" onChange={handleCover} />
            </label>
            <p className="text-xs text-gray-400 mt-2">JPEG, PNG, WEBP. Max 5MB.</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="card p-5 space-y-4">
        <h3 className="section-title">Basic Information</h3>
        <Input label="Tour Title *" error={errors.title?.message} placeholder="e.g. Majestic Himalayas Trek"
          {...register('title', { required: 'Title is required' })} />
        <Textarea label="Description *" rows={5} error={errors.description?.message}
          placeholder="Full description of the tour..."
          {...register('description', { required: 'Description is required' })} />
        <Textarea label="Short Description" rows={2} placeholder="Brief summary (shown on cards)"
          {...register('short_description')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Destination *" placeholder="e.g. Nepal" error={errors.destination?.message}
            {...register('destination', { required: 'Destination is required' })} />
          <Input label="Category" placeholder="e.g. Adventure" {...register('category')} />
        </div>
      </div>

      {/* Details */}
      <div className="card p-5 space-y-4">
        <h3 className="section-title">Tour Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input label="Duration (days) *" type="number" min="1" error={errors.duration_days?.message}
            {...register('duration_days', { required: 'Required', min: { value: 1, message: 'Min 1' } })} />
          <Input label="Max Group Size *" type="number" min="1" error={errors.max_group_size?.message}
            {...register('max_group_size', { required: 'Required' })} />
          <Input label="Price (USD) *" type="number" step="0.01" min="0" error={errors.price?.message}
            {...register('price', { required: 'Required', min: { value: 0, message: 'Min 0' } })} />
          <Input label="Discount Price" type="number" step="0.01" min="0"
            {...register('discount_price')} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="Difficulty" {...register('difficulty')}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
          <Input label="Meeting Point" placeholder="e.g. Kathmandu Airport"
            {...register('meeting_point')} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('is_featured')}
            className="w-4 h-4 rounded accent-sky-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Mark as Featured Tour</span>
        </label>
      </div>

      {/* Lists */}
      <div className="card p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        <ArrayField label="Highlights"  field={hl} />
        <ArrayField label="Included"    field={inc} />
        <ArrayField label="Excluded"    field={exc} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" loading={loading}>{isEdit ? 'Update Tour' : 'Create Tour'}</Button>
      </div>
    </form>
  );
}
