'use client';

import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlighted' | 'warning';
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-4',
        variant === 'default' && 'bg-navy-800 border border-gold-700/20',
        variant === 'highlighted' && 'bg-navy-800 border border-gold-600/40',
        variant === 'warning' && 'bg-amber-900/20 border border-amber-500/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
