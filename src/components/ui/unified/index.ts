
/**
 * Unified Component System - Step 2.4 Enhanced
 * 
 * Consolidates error handling, loading states, and common patterns
 * into a single, consistent system with unified state management.
 */

// === ERROR HANDLING ===
export { default as UnifiedErrorHandler } from '../error/UnifiedErrorHandler';

// === LOADING STATES ===
export { default as UnifiedLoadingStates, LoadingSpinner, SkeletonBox, CardSkeleton, ImageSkeleton } from '../loading/UnifiedLoadingStates';

// === UNIFIED HOOKS ===
export { 
  useUnifiedModal, 
  useUnifiedModals,
  useUnifiedFormState,
  useUnifiedState,
  useUnifiedAsyncState,
  useUnifiedCollection,
  createUnifiedContext,
  withUnifiedContext
} from '@/hooks/unified';
