
/**
 * Card Loading Component - Phase 2 Complexity Reduction
 * 
 * Focused component for card loading states.
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { CardSkeleton } from './UnifiedLoadingStates';

interface CardLoaderProps {
  count?: number;
  className?: string;
}

const CardLoader = memo(function CardLoader({
  count = 1,
  className,
}: CardLoaderProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
});

export default CardLoader;
