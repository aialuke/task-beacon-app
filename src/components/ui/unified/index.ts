
/**
 * Optimized Component System - Phase 3 Performance Enhancement
 * 
 * Tree-shakable exports with bundle optimization and performance improvements.
 */

// === ERROR HANDLING ===
export { default as UnifiedErrorHandler } from '../error/UnifiedErrorHandler';

// === OPTIMIZED LOADING STATES ===
export { 
  LoadingSpinner, 
  CardSkeleton, 
  ImageSkeleton 
} from '../loading/UnifiedLoadingStates';

// === FOCUSED LOADING COMPONENTS ===
export { default as PageLoader } from '../loading/PageLoader';
export { default as CardLoader } from '../loading/CardLoader';
export { default as InlineLoader } from '../loading/InlineLoader';

// === OPTIMIZED IMAGE COMPONENTS ===
export { default as SimpleLazyImage } from '../SimpleLazyImage';

// === LAZY LOADING UTILITIES ===
export { 
  withLazyLoading,
  LazyComponents 
} from '../LazyComponent';

// === BUNDLE OPTIMIZATION - Remove in production ===
if (process.env.NODE_ENV !== 'production') {
  // Development-only exports for debugging
  export { default as UnifiedLoadingStates } from '../loading/UnifiedLoadingStates';
}

// === PERFORMANCE TYPES (for better tree-shaking) ===
export type {
  LoadingSpinnerProps,
  SkeletonProps,
} from '../loading/UnifiedLoadingStates';
