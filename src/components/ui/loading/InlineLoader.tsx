
/**
 * Inline Loading Component - Phase 2 Complexity Reduction
 * 
 * Focused component for inline loading states.
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './UnifiedLoadingStates';

interface InlineLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const InlineLoader = memo(function InlineLoader({
  message,
  size = 'md',
  className,
}: InlineLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      <LoadingSpinner size={size} />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
});

export default InlineLoader;
