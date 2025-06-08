
/**
 * Standardized Loading State Management - Phase 2.2 Implementation
 * 
 * Provides consistent loading state patterns across all components.
 */

import { useMemo } from 'react';

export interface LoadingState {
  // Primary loading states
  isLoading: boolean;
  isInitialLoading: boolean;
  isFetching: boolean;
  isRefetching: boolean;
  
  // Error states
  isError: boolean;
  error: string | null;
  
  // Data states
  hasData: boolean;
  isEmpty: boolean;
  
  // Computed states
  isReady: boolean;
  showSkeleton: boolean;
  showEmptyState: boolean;
  canRetry: boolean;
}

export interface UseStandardizedLoadingParams {
  isLoading?: boolean;
  isInitialLoading?: boolean;
  isFetching?: boolean;
  isRefetching?: boolean;
  error?: unknown;
  data?: unknown;
  hasData?: boolean;
}

/**
 * Standardized loading state hook
 */
export function useStandardizedLoading({
  isLoading = false,
  isInitialLoading = false,
  isFetching = false,
  isRefetching = false,
  error = null,
  data = null,
  hasData,
}: UseStandardizedLoadingParams): LoadingState {
  return useMemo(() => {
    const isError = !!error;
    const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;
    const dataExists = hasData ?? (data !== null && data !== undefined);
    const isEmpty = !isLoading && !isError && !dataExists;
    
    return {
      // Primary loading states
      isLoading,
      isInitialLoading,
      isFetching,
      isRefetching,
      
      // Error states
      isError,
      error: errorMessage,
      
      // Data states
      hasData: dataExists,
      isEmpty,
      
      // Computed states
      isReady: !isLoading && !isError && dataExists,
      showSkeleton: isInitialLoading || (isLoading && !dataExists),
      showEmptyState: isEmpty,
      canRetry: isError && !isLoading,
    };
  }, [isLoading, isInitialLoading, isFetching, isRefetching, error, data, hasData]);
}
