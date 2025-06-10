/**
 * Unified Loading States - Phase 4 Consolidation
 * 
 * Single source of truth for all loading components with optimized performance.
 */

import { memo, useMemo } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// === PERFORMANCE OPTIMIZED INTERFACES ===

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface SkeletonProps {
  className?: string;
  aspectRatio?: string;
}

// === SIZE CONFIGURATIONS - MEMOIZED ===
const SPINNER_SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6', 
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
} as const;

// === OPTIMIZED LOADING SPINNER ===
export const LoadingSpinner = memo(function LoadingSpinner({ 
  size = 'md', 
  className 
}: LoadingSpinnerProps) {
  // Memoize size classes to prevent recalculation
  const sizeClasses = useMemo(() => SPINNER_SIZES[size], [size]);
  
  return (
    <div 
      className={cn(
        'loading-unified-spinner',
        sizeClasses,
        'text-muted-foreground',
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
});

// === CARD SKELETON (Internal use) ===
const CardSkeleton = memo(function CardSkeleton({ 
  className 
}: SkeletonProps) {
  return (
    <div className={cn('space-y-4 rounded-lg border p-6', className)}>
      <div className="flex items-start gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
});

// === NOTE: ImageSkeleton and InlineLoader exports removed as unused ===

// === PAGE LOADER ===
export const PageLoader = memo(function PageLoader({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-[400px] flex-col items-center justify-center space-y-4", className)}>
      <LoadingSpinner size="xl" />
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">Loading</h3>
        {message && <p className="text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
});

// === CARD LOADER ===
export const CardLoader = memo(function CardLoader({
  count = 1,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
});

// === NOTE: InlineLoader export removed as unused ===

// === PERFORMANCE METRICS (Development only) ===
if (process.env.NODE_ENV === 'development') {
  // Track component render performance
  (LoadingSpinner as typeof LoadingSpinner & { displayName: string }).displayName = 'LoadingSpinner';
  (CardSkeleton as typeof CardSkeleton & { displayName: string }).displayName = 'CardSkeleton';  
  (PageLoader as typeof PageLoader & { displayName: string }).displayName = 'PageLoader';
  (CardLoader as typeof CardLoader & { displayName: string }).displayName = 'CardLoader';
}
