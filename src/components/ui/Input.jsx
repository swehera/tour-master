'use client';
import { cn } from '@/utils/helpers';
import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', hint, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>}
    <input
      ref={ref}
      className={cn(
        'w-full px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
        error
          ? 'border-red-400 bg-red-50 dark:bg-red-950/20 dark:border-red-700'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
        'text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
));
Input.displayName = 'Input';

export const Textarea = forwardRef(({ label, error, className = '', rows = 4, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>}
    <textarea
      ref={ref} rows={rows}
      className={cn(
        'w-full px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none',
        error ? 'border-red-400' : 'border-gray-300 dark:border-gray-600',
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>}
    <select
      ref={ref}
      className={cn(
        'w-full px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
        error ? 'border-red-400' : 'border-gray-300 dark:border-gray-600',
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
));
Select.displayName = 'Select';

export default Input;
