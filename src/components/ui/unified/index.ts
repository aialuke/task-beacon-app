
/**
 * Simplified Component System - Phase 2 Complexity Reduction
 * 
 * Updated exports with focused loading components.
 */

// === ERROR HANDLING ===
export { default as UnifiedErrorHandler } from '../error/UnifiedErrorHandler';

// === LOADING STATES - Phase 2 Focused Components ===
export { 
  LoadingSpinner, 
  CardSkeleton, 
  ImageSkeleton 
} from '../loading/UnifiedLoadingStates';

// Phase 2: Focused loading components
export { default as PageLoader } from '../loading/PageLoader';
export { default as CardLoader } from '../loading/CardLoader';
export { default as InlineLoader } from '../loading/InlineLoader';

// Phase 2: Simplified image component
export { default as SimpleLazyImage } from '../SimpleLazyImage';

// Legacy export for backward compatibility
export { default as UnifiedLoadingStates } from '../loading/UnifiedLoadingStates';
