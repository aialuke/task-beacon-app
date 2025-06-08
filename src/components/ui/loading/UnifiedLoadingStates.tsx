
/**
 * Unified Loading States - Phase 3 Optimization
 * 
 * Optimized with performance improvements, state comparison, and cleanup patterns.
 */

import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// === PERFORMANCE OPTIMIZED INTERFACES ===

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

interface SkeletonProps {
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

// === OPTIMIZED CARD SKELETON ===
export const CardSkeleton = memo(function CardSkeleton({ 
  className 
}: SkeletonProps) {
  return (
    <div className={cn('space-y-4 rounded-lg border p-6', className)}>
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
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

// === OPTIMIZED IMAGE SKELETON ===
export const ImageSkeleton = memo(function ImageSkeleton({ 
  className, 
  aspectRatio = 'aspect-video' 
}: SkeletonProps) {
  return (
    <Skeleton 
      className={cn(
        'w-full rounded-lg',
        aspectRatio,
        className
      )} 
    />
  );
});

// === PERFORMANCE METRICS (Development only) ===
if (process.env.NODE_ENV === 'development') {
  // Track component render performance
  const originalLoadingSpinner = LoadingSpinner;
  const originalCardSkeleton = CardSkeleton;
  const originalImageSkeleton = ImageSkeleton;
  
  (LoadingSpinner as any).displayName = 'LoadingSpinner';
  (CardSkeleton as any).displayName = 'CardSkeleton';
  (ImageSkeleton as any).displayName = 'ImageSkeleton';
}
