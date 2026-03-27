'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'teal';
  children: React.ReactNode;
  className?: string;
}

const badgeVariants = {
  default: 'bg-surface-highest text-parchment-300',
  success: 'bg-green-900/20 text-green-400',
  warning: 'bg-amber-900/20 text-amber-300',
  error: 'bg-red-900/20 text-red-400',
  teal: 'bg-teal-600/15 text-teal-400',
};

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium',
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
