import { cn } from '@/utils/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function DashboardCard({ title, value, icon: Icon, color = 'sky', change, changeLabel, loading }) {
  const colors = {
    sky:    { bg: 'bg-sky-500/10',     icon: 'text-sky-500',     border: 'border-sky-500/20' },
    green:  { bg: 'bg-emerald-500/10', icon: 'text-emerald-500', border: 'border-emerald-500/20' },
    purple: { bg: 'bg-purple-500/10',  icon: 'text-purple-500',  border: 'border-purple-500/20' },
    amber:  { bg: 'bg-amber-500/10',   icon: 'text-amber-500',   border: 'border-amber-500/20' },
    red:    { bg: 'bg-red-500/10',     icon: 'text-red-500',     border: 'border-red-500/20' },
  };
  const c = colors[color] || colors.sky;

  return (
    <div className="card p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border shrink-0', c.bg, c.border)}>
          <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5', c.icon)} />
        </div>
        {change !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full',
            change >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400')}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ) : (
        <>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-0.5">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{title}</p>
          {changeLabel && <p className="text-xs text-gray-400 mt-1">{changeLabel}</p>}
        </>
      )}
    </div>
  );
}
