'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { userService } from '@/services/user.service';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import Link from 'next/link';
import { formatDate } from '@/utils/formatDate';
import { statusColor } from '@/utils/helpers';

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    userService.getById(id)
      .then(res => {
        const u = res.data?.data?.user;
        setUser(u);
        reset({ name: u.name, phone: u.phone || '', role: u.role, is_active: u.is_active });
      })
      .catch(() => toast.error('User not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await userService.update(id, { ...data, is_active: data.is_active === 'true' || data.is_active === true });
      toast.success('User updated');
      router.push('/dashboard/users');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-xl">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/users">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="page-title">Edit User</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Update user information</p>
        </div>
      </div>

      {user && (
        <div className="card p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-sky-500 flex items-center justify-center text-white text-xl font-bold">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{user.email}</p>
            <p className="text-sm text-gray-500">Joined {formatDate(user.created_at)}</p>
            <span className={`badge-status mt-1 inline-block ${statusColor(user.role)}`}>{user.role}</span>
          </div>
        </div>
      )}

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name *" error={errors.name?.message}
            {...register('name', { required: 'Name is required' })} />
          <Input label="Phone Number" type="tel"
            {...register('phone')} />
          <Select label="Role" {...register('role')}>
            <option value="user">User</option>
            <option value="guide">Guide</option>
            <option value="admin">Admin</option>
          </Select>
          <Select label="Status" {...register('is_active')}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
