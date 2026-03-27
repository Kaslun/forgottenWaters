'use client';

import { cn } from '@/lib/utils';

interface ConnectionDotProps {
  status: 'connected' | 'reconnecting' | 'offline';
  className?: string;
}

export function ConnectionDot({ status, className }: ConnectionDotProps) {
  return (
    <span
      className={cn(
        'inline-block w-2 h-2 rounded-full',
        status === 'connected' && 'bg-teal-400 shadow-glow-teal',
        status === 'reconnecting' && 'bg-amber-400 animate-pulse',
        status === 'offline' && 'bg-red-400',
        className
      )}
      title={status}
      aria-label={`Connection: ${status}`}
    />
  );
}
