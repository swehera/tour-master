'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Map, CalendarCheck, Globe, LogOut, ChevronLeft, ChevronRight, MessageSquare, X, Menu } from 'lucide-react';
import { cn } from '@/utils/helpers';
import useAuthStore from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/dashboard',          icon: LayoutDashboard, label: 'Dashboard', roles: ['admin','guide','user'] },
  { href: '/dashboard/users',    icon: Users,           label: 'Users',     roles: ['admin'] },
  { href: '/dashboard/tours',    icon: Map,             label: 'Tours',     roles: ['admin','guide'] },
  { href: '/dashboard/bookings', icon: CalendarCheck,   label: 'Bookings',  roles: ['admin','guide','user'] },
  { href: '/dashboard/contacts', icon: MessageSquare,   label: 'Contacts',  roles: ['admin'] },
];

function SidebarContent({ collapsed, setCollapsed, onLinkClick }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuthStore();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user?.role === 'admin') {
      import('@/services/contact.service').then(({ contactService }) => {
        contactService.unreadCount()
          .then(res => setUnread(res.data?.data?.count || 0))
          .catch(() => {});
      });
    }
  }, [user]);

  const handleLogout = async () => {
    document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Lax';
    try { await authService.logout(); } catch {}
    logout();
    router.push('/');
    toast.success('Logged out');
  };

  const allowed = navItems.filter(i => i.roles.includes(user?.role));

  return (
    <div className="flex flex-col h-full bg-gray-950 border-r border-gray-800">
      {/* Logo */}
      <div className={cn('flex items-center h-16 border-b border-gray-800 px-4 shrink-0', collapsed ? 'justify-center' : 'gap-3')}>
        <Globe className="w-7 h-7 text-sky-400 shrink-0" />
        {!collapsed && <span className="text-white font-bold text-lg">TourMaster</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {allowed.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              onClick={onLinkClick}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all group',
                active ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200',
                collapsed && 'justify-center px-2'
              )}>
              <Icon className={cn('w-5 h-5 shrink-0', active ? 'text-sky-400' : 'text-gray-500 group-hover:text-gray-300')} />
              {!collapsed && <span className="flex-1">{label}</span>}
              {!collapsed && href === '/dashboard/contacts' && unread > 0 && (
                <span className="text-xs font-bold px-1.5 py-0.5 bg-sky-500 text-white rounded-full min-w-[20px] text-center">
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-800 p-3 space-y-1 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        )}
        <Link href="/" onClick={onLinkClick}
          className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors', collapsed && 'justify-center px-2')}>
          <Globe className="w-4 h-4 shrink-0" />
          {!collapsed && 'Visit Site'}
        </Link>
        <button onClick={handleLogout}
          className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-950/20 transition-colors', collapsed && 'justify-center px-2')}>
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Logout'}
        </button>
        {/* Collapse toggle — desktop only */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-800 transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-sky-400" />
          <span className="text-white font-bold">TourMaster</span>
        </div>
        <button onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          {/* Drawer */}
          <div className="relative w-64 h-full animate-slide-down" style={{ animation: 'slideInLeft 0.25s ease-out' }}>
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700">
              <X className="w-4 h-4" />
            </button>
            <SidebarContent
              collapsed={false}
              setCollapsed={() => {}}
              onLinkClick={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside className={cn(
        'hidden lg:flex flex-col fixed left-0 top-0 h-screen z-30 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}>
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onLinkClick={() => {}}
        />
      </aside>
    </>
  );
}
