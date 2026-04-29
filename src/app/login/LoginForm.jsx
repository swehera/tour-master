'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Globe, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth.service';
import useAuthStore from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, init } = useAuthStore();
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => { init(); }, []);
  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      const { user, accessToken, refreshToken } = res.data.data;

      login(res.data.data);
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      toast.success(`Welcome back, ${user.name}!`);

      const from = searchParams.get('from');
      if (from && from.startsWith('/')) {
        router.push(from);
      } else {
        router.push(user.role === 'admin' || user.role === 'guide' ? '/dashboard' : '/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Globe className="w-8 h-8 text-sky-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">TourMaster</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address: admin@example.com" type="email" placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
              })}
            />
            <div className="relative">
              <Input
                label="Password: admin123" type={showPass ? 'text' : 'password'}
                placeholder="Your password" error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
              <button
                type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-sky-500 hover:text-sky-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}