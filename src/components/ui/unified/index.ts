
/**
 * Unified Component System - Centralized Exports
 * 
 * Consolidates error handling, loading states, and common patterns
 * into a single, consistent system.
 */

// === ERROR HANDLING ===
export { default as UnifiedErrorHandler } from '../error/UnifiedErrorHandler';

// === LOADING STATES ===
export { default as UnifiedLoadingStates, LoadingSpinner, SkeletonBox, CardSkeleton, ImageSkeleton } from '../loading/UnifiedLoadingStates';

// === HOOKS ===
export { useUnifiedModal, useUnifiedModals } from '@/hooks/unified/useUnifiedModal';
export { useUnifiedFormState } from '@/hooks/unified/useUnifiedFormState';
// CodeRabbit review
// CodeRabbit review
