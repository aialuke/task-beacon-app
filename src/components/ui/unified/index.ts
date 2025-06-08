
/**
 * Simplified Component System - Step 2.4 Revised
 * 
 * Removed complex unified abstractions.
 * Using standard React patterns and existing utilities.
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

// No unified hooks exports - using standard React patterns instead
