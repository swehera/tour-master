export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_UPLOADS_URL}/${path}`;
};

export const truncate = (str, n = 100) =>
  str && str.length > n ? str.slice(0, n) + '…' : str;

export const statusColor = (status) => {
  const map = {
    pending:   'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    paid:      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    unpaid:    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    refunded:  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    active:    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    inactive:  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    admin:     'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    guide:     'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    user:      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };
  return map[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
};

export const difficultyColor = (d) => ({
  easy:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}[d] || '');
