/**
 * Unified Async State Interfaces - Phase 1 Consolidation
 *
 * Shared base interfaces to eliminate duplication across async operations.
 */

/**
 * Base async state interface - shared foundation
 */
export interface BaseAsyncState<T = unknown, E = Error> {
  data: T | null;
  loading: boolean;
  error: E | null;
  lastUpdated: number | null;
}

/**
 * Extended async operation state with retry capabilities
 */
export interface AsyncOperationState<T = unknown> extends BaseAsyncState<T> {
  retryCount?: number;
  canRetry?: boolean;
}

/**
 * Batch async operation state for multiple operations
 */
export interface BatchAsyncOperationState<T = unknown>
  extends BaseAsyncState<T[]> {
  completedCount: number;
  totalCount: number;
  failedItems: { index: number; error: Error }[];
}

/**
 * Optimistic async operation state for UI updates
 */
export interface OptimisticAsyncOperationState<T = unknown>
  extends BaseAsyncState<T> {
  optimisticData: T | null;
  isOptimistic: boolean;
  rollbackData: T | null;
}

/**
 * Standard loading state patterns
 */
export interface StandardLoadingState {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: string | null;
}

/**
 * Form submission state
 */
export interface FormSubmissionState extends BaseAsyncState<unknown> {
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
}

/**
 * Query state for data fetching
 */
export interface QueryState<T = unknown> extends BaseAsyncState<T> {
  isFetching: boolean;
  isStale: boolean;
  refetch: () => Promise<void>;
}

/**
 * Creates a standard loading state object
 */
export function createLoadingState(
  isLoading: boolean,
  isFetching: boolean,
  error: unknown = null
): StandardLoadingState {
  return {
    isLoading,
    isFetching,
    isError: !!error,
    error: error
      ? error instanceof Error
        ? error.message
        : String(error)
      : null,
  };
}
