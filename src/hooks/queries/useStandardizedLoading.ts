
/**
 * Standardized Loading States - Phase 3.2 Implementation
 * 
 * Consistent loading state management across all components.
 */

import { useMemo } from 'react';

export interface LoadingState {
  isLoading: boolean;
  isInitialLoading: boolean;
  isFetching: boolean;
  isRefetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: string | null;
  isEmpty: boolean;
}

export interface LoadingStateOptions {
  isLoading?: boolean;
  isInitialLoading?: boolean;
  isFetching?: boolean;
  isRefetching?: boolean;
  error?: unknown;
  data?: unknown[] | unknown;
  hasData?: boolean;
}

/**
 * Creates standardized loading state from React Query states
 */
export function useStandardizedLoading({
  isLoading = false,
  isInitialLoading = false,
  isFetching = false,
  isRefetching = false,
  error = null,
  data,
  hasData,
}: LoadingStateOptions): LoadingState {
  return useMemo(() => {
    const isError = !!error;
    const isSuccess = !isError && !isLoading;
    
    // Determine if data is empty
    let isEmpty = false;
    if (hasData !== undefined) {
      isEmpty = !hasData;
    } else if (Array.isArray(data)) {
      isEmpty = data.length === 0;
    } else {
      isEmpty = !data;
    }

    return {
      isLoading,
      isInitialLoading,
      isFetching,
      isRefetching,
      isError,
      isSuccess,
      error: error instanceof Error ? error.message : error ? String(error) : null,
      isEmpty: isEmpty && isSuccess,
    };
  }, [isLoading, isInitialLoading, isFetching, isRefetching, error, data, hasData]);
}

/**
 * Loading state variants for different UI contexts
 */
export const LoadingVariants = {
  // Full page loading
  page: {
    showSpinner: true,
    showSkeleton: false,
    blockInteraction: true,
  },
  
  // Card/component loading
  card: {
    showSpinner: false,
    showSkeleton: true,
    blockInteraction: false,
  },
  
  // Background refresh
  background: {
    showSpinner: false,
    showSkeleton: false,
    blockInteraction: false,
  },
  
  // Button/action loading
  action: {
    showSpinner: true,
    showSkeleton: false,
    blockInteraction: true,
  },
} as const;

export type LoadingVariant = keyof typeof LoadingVariants;

/**
 * Hook for managing loading states with variants
 */
export function useLoadingVariant(
  loadingState: LoadingState,
  variant: LoadingVariant = 'card'
) {
  return useMemo(() => {
    const variantConfig = LoadingVariants[variant];
    
    return {
      ...loadingState,
      shouldShowSpinner: loadingState.isLoading && variantConfig.showSpinner,
      shouldShowSkeleton: loadingState.isLoading && variantConfig.showSkeleton,
      shouldBlockInteraction: loadingState.isLoading && variantConfig.blockInteraction,
      variant,
    };
  }, [loadingState, variant]);
}
// CodeRabbit review
// CodeRabbit review
