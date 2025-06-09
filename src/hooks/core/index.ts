/**
 * Core Hooks Index
 * Central exports for core application hooks
 */

export { useAuth } from './auth';
export type { UseAuthReturn } from './auth';
export { useErrorHandler } from './error';
export { useUnifiedError } from './useUnifiedError';
export type { UseErrorHandlerOptions } from './error';
export { 
  useLoadingState, 
  useSimpleLoading, 
  useSubmissionState, 
  useImageLoadingState 
} from './useLoadingState';
export type { 
  LoadingState, 
  LoadingStateOptions, 
  LoadingStateActions, 
  UseLoadingStateReturn 
} from './useLoadingState';

// === ENTITY QUERY CONSOLIDATION ===
export {
  useEntityQuery,
  useEntityByIdQuery, 
  useEntityListQuery,
} from './useEntityQuery';

export type {
  EntityQueryConfig,
  EntityQueryReturn,
} from './useEntityQuery';

// === UNIFIED FORM CONSOLIDATION ===
export {
  useUnifiedForm,
  useSimpleForm,
} from './useUnifiedForm';

export type {
  UnifiedFormConfig,
  UnifiedFormActions,
  UnifiedFormReturn,
} from './useUnifiedForm'; 