
/**
 * Unified Hook System - Step 2.4 Complete
 * 
 * Centralized exports for all unified state management patterns.
 * Replaces scattered hook implementations with consistent, standardized patterns.
 */

// === UNIFIED STATE MANAGEMENT ===
export { 
  useUnifiedState, 
  useUnifiedAsyncState, 
  useUnifiedCollection 
} from './useUnifiedState';

// === UNIFIED CONTEXT MANAGEMENT ===
export { 
  createUnifiedContext, 
  withUnifiedContext 
} from './useUnifiedContext';

// === UNIFIED UI MANAGEMENT ===
export { useUnifiedModal, useUnifiedModals } from './useUnifiedModal';
export { useUnifiedFormState } from './useUnifiedFormState';
