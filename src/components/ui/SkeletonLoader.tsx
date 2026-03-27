'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-surface-high/50 animate-shimmer',
        'bg-gradient-to-r from-surface-high/30 via-surface-highest/40 to-surface-high/30 bg-[length:200%_100%]',
        className
      )}
    />
  );
}

export function SkillGridSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="w-20 h-5" />
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, j) => (
              <Skeleton key={j} className="w-10 h-10" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ConstellationSkeleton() {
  return (
    <div className="aspect-square w-full max-w-xs mx-auto">
      <Skeleton className="w-full h-full rounded-xl" />
    </div>
  );
}

export function SheetSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <Skeleton className="w-48 h-6" />
      <SkillGridSkeleton />
      <ConstellationSkeleton />
    </div>
  );
}

export function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] bg-navy-900">
      <div className="text-gold-400 text-4xl mb-4 animate-pulse">
        ⚓
      </div>
      <p className="text-parchment-400 text-sm font-mono">
        {message || 'Loading...'}
      </p>
    </div>
  );
}
