'use client';
import useAuthStore from '@/store/authStore';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import GuideDashboard from '@/components/dashboard/GuideDashboard';
import UserDashboard  from '@/components/dashboard/UserDashboard';

export default function DashboardPage() {
  const { user } = useAuthStore();
  if (!user) return null;
  if (user.role === 'admin')  return <AdminDashboard />;
  if (user.role === 'guide')  return <GuideDashboard />;
  return <UserDashboard />;
}
