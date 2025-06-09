/**
 * Core Hooks Index
 * Central exports for core application hooks
 */

export { useAuth } from './auth';
export type { UseAuthReturn } from './auth';
export { useErrorHandler } from './error';
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