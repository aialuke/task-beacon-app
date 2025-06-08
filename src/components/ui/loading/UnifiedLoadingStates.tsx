
/**
 * Unified Loading States Component
 * 
 * Consolidates TaskLoadingStates, LoadingSpinner, and ImageLoadingState
 * into a single, consistent loading system.
 */

// === EXTERNAL LIBRARIES ===
import React, { memo } from 'react';

// === INTERNAL UTILITIES ===
import { cn } from '@/lib/utils';

// === TYPES ===
interface UnifiedLoadingProps {
  variant?: 'spinner' | 'skeleton' | 'card' | 'page' | 'image' | 'grid';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  count?: number;
  message?: string;
  className?: string;
}

/**
 * Spinner component for basic loading states
 */
const LoadingSpinner = memo(function LoadingSpinner({ 
  size = 'md', 
  className 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl'; 
  className?: string; 
}) {
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
 * Skeleton component for content loading
 */
const SkeletonBox = memo(function SkeletonBox({ 
  className,
  height = 'h-4',
}: { 
  className?: string;
  height?: string;
}) {
  return (
    <div className={cn("animate-pulse bg-muted rounded", height, className)} />
  );
});

/**
 * Card skeleton for task-like content
 */
const CardSkeleton = memo(function CardSkeleton() {
  return (
    <div className="p-6 border rounded-xl bg-card space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <SkeletonBox className="w-3/4 h-6" />
          <SkeletonBox className="w-1/2 h-4" />
        </div>
        <SkeletonBox className="w-6 h-6 rounded-full" />
      </div>
      <div className="space-y-2">
        <SkeletonBox className="w-full h-4" />
        <SkeletonBox className="w-2/3 h-4" />
      </div>
      <div className="flex items-center justify-between">
        <SkeletonBox className="w-20 h-6 rounded-full" />
        <SkeletonBox className="w-16 h-4" />
      </div>
    </div>
  );
});

/**
 * Image skeleton for image loading states
 */
const ImageSkeleton = memo(function ImageSkeleton({ 
  aspectRatio = 'aspect-video',
  className,
}: { 
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <div className={cn("animate-pulse bg-muted rounded-lg flex items-center justify-center", aspectRatio, className)}>
      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  );
});

/**
 * Main unified loading component
 */
const UnifiedLoadingStates = memo(function UnifiedLoadingStates({
  variant = 'spinner',
  size = 'md',
  count = 1,
  message,
  className,
}: UnifiedLoadingProps) {
  const renderContent = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
            <LoadingSpinner size={size} />
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </div>
        );

      case 'skeleton':
        return (
          <div className={cn("space-y-2", className)}>
            {Array.from({ length: count }, (_, i) => (
              <SkeletonBox key={i} className="w-full" />
            ))}
          </div>
        );

      case 'card':
        return (
          <div className={cn("space-y-6", className)}>
            {Array.from({ length: count }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        );

      case 'grid':
        return (
          <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
            {Array.from({ length: count }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        );

      case 'image':
        return <ImageSkeleton className={className} />;

      case 'page':
        return (
          <div className={cn("flex flex-col items-center justify-center min-h-[400px] space-y-4", className)}>
            <LoadingSpinner size="xl" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Loading</h3>
              {message && <p className="text-muted-foreground">{message}</p>}
            </div>
          </div>
        );

      default:
        return <LoadingSpinner size={size} className={className} />;
    }
  };

  return (
    <div role="status" aria-label={message ?? "Loading content"}>
      {renderContent()}
    </div>
  );
});

// Export individual components for backward compatibility
export { LoadingSpinner, SkeletonBox, CardSkeleton, ImageSkeleton };
export default UnifiedLoadingStates;
// CodeRabbit review
