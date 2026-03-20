'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Sun, Moon, Globe, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import useAuthStore from '@/store/authStore';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { cn } from '@/utils/helpers';

const navLinks = [
  { href: '/',        label: 'Home' },
  { href: '/tours',   label: 'Tours' },
  { href: '/about',   label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open,      setOpen]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [dropdown,  setDropdown]  = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = async () => {
    // Clear cookie
    document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Lax';
    try { await authService.logout(); } catch {}
    logout();
    router.push('/');
    toast.success('Logged out');
  };

  const isHome = pathname === '/';
  const isTransparent = isHome && !scrolled;

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      isTransparent
        ? 'bg-transparent'
        : 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Globe className={cn('w-7 h-7', isTransparent ? 'text-sky-400' : 'text-sky-500')} />
            <span className={isTransparent ? 'text-white' : 'text-gray-900 dark:text-white'}>
              TourMaster
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? isTransparent ? 'bg-white/20 text-white' : 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                    : isTransparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >{label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            {mounted && (
              <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className={cn('p-2 rounded-lg transition-colors', isTransparent ? 'text-white/80 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800')}>
                {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setDropdown(!dropdown)}
                  className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800')}>
                  <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:block">{user?.name?.split(' ')[0]}</span>
                </button>
                {dropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 z-20 animate-slide-down overflow-hidden">
                      {user?.role === 'admin' || user?.role === 'guide' ? (
                        <Link href="/dashboard" onClick={() => setDropdown(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                      ) : null}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login"
                  className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800')}>
                  Login
                </Link>
                <Link href="/register"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors shadow-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            {mounted && (
              <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className={cn('p-2 rounded-lg', isTransparent ? 'text-white' : 'text-gray-500 dark:text-gray-400')}>
                {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            <button onClick={() => setOpen(!open)}
              className={cn('p-2 rounded-lg', isTransparent ? 'text-white' : 'text-gray-500 dark:text-gray-400')}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 px-4 py-3 space-y-1 animate-slide-down">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={cn('block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === href ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800')}>
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
            {isAuthenticated ? (
              <>
                {(user?.role === 'admin' || user?.role === 'guide') && (
                  <Link href="/dashboard" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Login</Link>
                <Link href="/register" onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium bg-sky-500 text-white text-center hover:bg-sky-600">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
