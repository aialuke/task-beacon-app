import { useState, useCallback } from 'react';

/**
 * Unified Loading State Hook - Phase 1 Consolidation
 *
 * Replaces all scattered loading state patterns with a single, consistent implementation.
 * Eliminates duplicate loading logic across 15+ components and hooks.
 */

interface LoadingState {
  isLoading: boolean;
  isSubmitting: boolean;
  isFetching: boolean;
  error: string | null;
}

interface LoadingStateOptions {
  initialLoading?: boolean;
  initialSubmitting?: boolean;
  initialFetching?: boolean;
  initialError?: string | null;
}

interface LoadingStateActions {
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setFetching: (fetching: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  startLoading: () => void;
  stopLoading: () => void;
  startSubmitting: () => void;
  stopSubmitting: () => void;
  startFetching: () => void;
  stopFetching: () => void;
  setSuccess: () => void;
  setFailure: (error: string) => void;
}

interface UseLoadingStateReturn extends LoadingState, LoadingStateActions {
  isIdle: boolean;
  hasError: boolean;
  isAnyLoading: boolean;
}

/**
 * Unified loading state hook that replaces all scattered loading patterns
 */
export function useLoadingState(
  options: LoadingStateOptions = {}
): UseLoadingStateReturn {
  const {
    initialLoading = false,
    initialSubmitting = false,
    initialFetching = false,
    initialError = null,
  } = options;

  const [isLoading, setIsLoadingState] = useState(initialLoading);
  const [isSubmitting, setIsSubmittingState] = useState(initialSubmitting);
  const [isFetching, setIsFetchingState] = useState(initialFetching);
  const [error, setErrorState] = useState<string | null>(initialError);

  // Action creators
  const setLoading = useCallback((loading: boolean) => {
    setIsLoadingState(loading);
    if (loading) setErrorState(null);
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmittingState(submitting);
    if (submitting) setErrorState(null);
  }, []);

  const setFetching = useCallback((fetching: boolean) => {
    setIsFetchingState(fetching);
    if (fetching) setErrorState(null);
  }, []);

  const setError = useCallback((error: string | null) => {
    setErrorState(error);
    if (error) {
      setIsLoadingState(false);
      setIsSubmittingState(false);
      setIsFetchingState(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoadingState(false);
    setIsSubmittingState(false);
    setIsFetchingState(false);
    setErrorState(null);
  }, []);

  // Convenience methods
  const startLoading = useCallback(() => setLoading(true), [setLoading]);
  const stopLoading = useCallback(() => setLoading(false), [setLoading]);
  const startSubmitting = useCallback(
    () => setSubmitting(true),
    [setSubmitting]
  );
  const stopSubmitting = useCallback(
    () => setSubmitting(false),
    [setSubmitting]
  );
  const startFetching = useCallback(() => setFetching(true), [setFetching]);
  const stopFetching = useCallback(() => setFetching(false), [setFetching]);

  const setSuccess = useCallback(() => {
    setIsLoadingState(false);
    setIsSubmittingState(false);
    setIsFetchingState(false);
    setErrorState(null);
  }, []);

  const setFailure = useCallback(
    (error: string) => {
      setError(error);
    },
    [setError]
  );

  // Computed states
  const isIdle = !isLoading && !isSubmitting && !isFetching && !error;
  const hasError = !!error;
  const isAnyLoading = isLoading || isSubmitting || isFetching;

  return {
    // State
    isLoading,
    isSubmitting,
    isFetching,
    error,
    isIdle,
    hasError,
    isAnyLoading,

    // Actions
    setLoading,
    setSubmitting,
    setFetching,
    setError,
    reset,
    startLoading,
    stopLoading,
    startSubmitting,
    stopSubmitting,
    startFetching,
    stopFetching,
    setSuccess,
    setFailure,
  };
}

/**
 * Specialized hook for form submission states
 */
export function useSubmissionState(initialSubmitting = false) {
  const loadingState = useLoadingState({ initialSubmitting });

  return {
    isSubmitting: loadingState.isSubmitting,
    error: loadingState.error,
    startSubmitting: loadingState.startSubmitting,
    stopSubmitting: loadingState.stopSubmitting,
    setError: loadingState.setError,
    setSuccess: loadingState.setSuccess,
    setFailure: loadingState.setFailure,
    reset: loadingState.reset,
  };
}

/**
 * Specialized hook for image loading states
 */
export function useImageLoadingState() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);

  const resetImageState = useCallback(() => {
    setImageLoaded(false);
    setImageError(false);
  }, []);

  return {
    imageLoaded,
    imageError,
    isImageLoading: !imageLoaded && !imageError,
    handleImageLoad,
    handleImageError,
    resetImageState,
  };
}
