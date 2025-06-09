
/**
 * Optimized Component System - Phase 4 Consolidation
 * 
 * Tree-shakable exports with all loading states unified.
 */

// === ERROR HANDLING ===
export { default as UnifiedErrorHandler } from '../error/UnifiedErrorHandler';

// === UNIFIED LOADING STATES (All-in-One) ===
export { 
  LoadingSpinner, 
  CardSkeleton, 
  ImageSkeleton,
  PageLoader,
  CardLoader,
  InlineLoader
} from '../loading/UnifiedLoadingStates';

// === OPTIMIZED IMAGE COMPONENTS ===
export { default as SimpleLazyImage } from '../SimpleLazyImage';

// === LAZY LOADING UTILITIES ===
export { 
  withLazyLoading,
  LazyComponents 
} from '../LazyComponent';

// === PERFORMANCE TYPES (for better tree-shaking) ===
export type {
  LoadingSpinnerProps,
  SkeletonProps,
} from '../loading/UnifiedLoadingStates';
