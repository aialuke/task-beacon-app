
/**
 * Simplified Component System - Phase 1 Loading States Consolidation
 * 
 * Updated exports after removing duplicate skeleton implementations.
 */

// === ERROR HANDLING ===
export { default as UnifiedErrorHandler } from '../error/UnifiedErrorHandler';

// === LOADING STATES ===
export { 
  default as UnifiedLoadingStates, 
  LoadingSpinner, 
  CardSkeleton, 
  ImageSkeleton 
} from '../loading/UnifiedLoadingStates';

// Note: SkeletonBox removed - use Skeleton from '@/components/ui/skeleton' instead

// Using standard React patterns instead of complex unified hooks
