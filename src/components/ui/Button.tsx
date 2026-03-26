'use client';

import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-gold-600 text-navy-900 font-semibold active:bg-gold-500 disabled:opacity-40',
  secondary: 'bg-navy-700 text-parchment-200 border border-gold-700/30 active:bg-navy-600 disabled:opacity-40',
  ghost: 'text-parchment-400 active:text-parchment-200 active:bg-navy-700/50 disabled:opacity-40',
  danger: 'bg-red-900/30 text-red-400 border border-red-800/30 active:bg-red-900/50 disabled:opacity-40',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-base rounded-xl',
  lg: 'px-6 py-3 text-lg rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-body transition-colors min-h-[48px]',
        'disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
