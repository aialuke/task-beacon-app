
/**
 * Simplified Component System - Step 2.4.6.2c
 * 
 * Simplified from complex unified abstractions to standard React patterns.
 */

// === ERROR HANDLING ===
export { default as UnifiedErrorHandler } from '../error/UnifiedErrorHandler';

// === LOADING STATES ===
export { 
  default as UnifiedLoadingStates, 
  LoadingSpinner, 
  SkeletonBox, 
  CardSkeleton, 
  ImageSkeleton 
} from '../loading/UnifiedLoadingStates';

// Using standard React patterns instead of complex unified hooks
