'use client';

import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlighted' | 'warning' | 'glass';
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-4 gold-corner-accent',
        variant === 'default' && 'bg-surface shadow-ambient',
        variant === 'highlighted' && 'bg-surface shadow-ambient shadow-glow-gold',
        variant === 'warning' && 'bg-amber-900/15 ghost-border',
        variant === 'glass' && 'glass shadow-ambient',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
