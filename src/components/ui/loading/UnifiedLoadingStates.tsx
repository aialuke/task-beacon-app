
/**
 * Simplified Loading States Component - Phase 1 Consolidation
 * 
 * Standardized loading spinner and removed duplicate skeleton implementation.
 * Uses shadcn Skeleton component for consistency.
 */

import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

interface UnifiedLoadingProps {
  variant?: 'spinner' | 'skeleton' | 'card' | 'page';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  count?: number;
  message?: string;
  className?: string;
}

/**
 * Standardized spinner component - Phase 1 consolidation
 */
export const LoadingSpinner = memo(function LoadingSpinner({ 
  size = 'md', 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-primary border-t-transparent", sizeClasses[size], className)} />
  );
});

/**
 * Card skeleton using standardized Skeleton component
 */
export const CardSkeleton = memo(function CardSkeleton() {
  return (
    <div className="p-6 border rounded-xl bg-card space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="w-3/4 h-6" />
          <Skeleton className="w-1/2 h-4" />
        </div>
        <Skeleton className="w-6 h-6 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-2/3 h-4" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-16 h-4" />
      </div>
    </div>
  );
});

/**
 * Image skeleton using standardized Skeleton component
 */
export const ImageSkeleton = memo(function ImageSkeleton({ 
  aspectRatio = 'aspect-video',
  className,
}: { 
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <Skeleton className={cn("rounded-lg flex items-center justify-center", aspectRatio, className)}>
      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </Skeleton>
  );
});

/**
 * Simplified main loading component using standard React patterns
 */
const UnifiedLoadingStates = memo(function UnifiedLoadingStates({
  variant = 'spinner',
  size = 'md',
  count = 1,
  message,
  className,
}: UnifiedLoadingProps) {
  if (variant === 'spinner') {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
        <LoadingSpinner size={size} />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: count }, (_, i) => (
          <Skeleton key={i} className="w-full h-4" />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn("space-y-6", className)}>
        {Array.from({ length: count }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[400px] space-y-4", className)}>
        <LoadingSpinner size="xl" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Loading</h3>
          {message && <p className="text-muted-foreground">{message}</p>}
        </div>
      </div>
    );
  }

  return <LoadingSpinner size={size} className={className} />;
});

export default UnifiedLoadingStates;
