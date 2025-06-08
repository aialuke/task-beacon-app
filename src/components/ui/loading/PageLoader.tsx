
/**
 * Page Loading Component - Phase 2 Complexity Reduction
 * 
 * Focused component for full-page loading states.
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './UnifiedLoadingStates';

interface PageLoaderProps {
  message?: string;
  className?: string;
}

const PageLoader = memo(function PageLoader({
  message,
  className,
}: PageLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] space-y-4", className)}>
      <LoadingSpinner size="xl" />
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Loading</h3>
        {message && <p className="text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
});

export default PageLoader;
