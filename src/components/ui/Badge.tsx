'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}

const badgeVariants = {
  default: 'bg-navy-700 text-parchment-300',
  success: 'bg-green-900/30 text-green-400',
  warning: 'bg-amber-900/30 text-amber-300',
  error: 'bg-red-900/30 text-red-400',
};

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
