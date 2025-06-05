
import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

/**
 * Standardized Loading States - Phase 3 Implementation
 * 
 * Provides consistent loading UI patterns across task components.
 */

// Task card loading skeleton
export const TaskCardSkeleton = memo(() => (
  <div className="animate-pulse rounded-xl border-2 border-border/40 bg-muted/20 p-4 sm:p-5">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-muted animate-pulse" />
        <Skeleton className="h-3 w-1/2 bg-muted/80 animate-pulse" />
        <Skeleton className="h-3 w-2/3 bg-muted/60 animate-pulse" />
      </div>
      <div className="h-8 w-8 rounded-full bg-muted/60 animate-pulse" />
    </div>
  </div>
));

TaskCardSkeleton.displayName = 'TaskCardSkeleton';

// Form loading skeleton
export const TaskFormSkeleton = memo(() => (
  <div className="w-full rounded-3xl border border-border/30 bg-card/40 p-8">
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="text-center space-y-3">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
      
      {/* Form fields skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      
      {/* Action buttons skeleton */}
      <div className="flex justify-center gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </div>
));

TaskFormSkeleton.displayName = 'TaskFormSkeleton';

// Inline loading spinner for buttons and small components
export const InlineLoader = memo(({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <Loader2 
    className={`animate-spin ${className}`} 
    size={size}
    aria-label="Loading"
  />
));

InlineLoader.displayName = 'InlineLoader';

// Full page loading state
export const TaskPageLoader = memo(({ message = 'Loading tasks...' }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-[400px] p-8">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  </div>
));

TaskPageLoader.displayName = 'TaskPageLoader';

// Loading overlay for existing content
export const LoadingOverlay = memo(({ 
  visible, 
  message = 'Loading...',
  className = ''
}: { 
  visible: boolean; 
  message?: string;
  className?: string;
}) => {
  if (!visible) return null;

  return (
    <div className={`absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
      <div className="text-center space-y-3">
        <InlineLoader size={24} className="text-primary" />
        <p className="text-sm text-muted-foreground font-medium">{message}</p>
      </div>
    </div>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';
