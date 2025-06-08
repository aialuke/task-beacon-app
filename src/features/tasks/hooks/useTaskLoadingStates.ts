
import { useMemo } from 'react';

interface LoadingStateOptions {
  isLoading?: boolean;
  isFetching?: boolean;
  isSubmitting?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  error?: string | null;
}

interface TaskLoadingStates {
  // Primary states
  isLoading: boolean;
  isFetching: boolean;
  isSubmitting: boolean;
  
  // Action states
  isDeleting: boolean;
  isUpdating: boolean;
  
  // Derived states
  isBusy: boolean;
  hasError: boolean;
  canInteract: boolean;
  
  // Error state
  error: string | null;
  
  // Loading messages
  loadingMessage: string;
  busyMessage: string;
}

/**
 * Task Loading States Hook - Simplified Implementation
 * 
 * Provides consistent loading state management using standard React patterns.
 * Removed unnecessary optimization in favor of clarity and maintainability.
 */
export function useTaskLoadingStates(options: LoadingStateOptions = {}): TaskLoadingStates {
  const {
    isLoading = false,
    isFetching = false,
    isSubmitting = false,
    isDeleting = false,
    isUpdating = false,
    error = null,
  } = options;

  // Compute derived states using standard useMemo
  const loadingStates = useMemo(() => {
    const isBusy = isLoading || isFetching || isSubmitting || isDeleting || isUpdating;
    const hasError = !!error;
    const canInteract = !isBusy && !hasError;

    // Generate contextual loading messages
    let loadingMessage = 'Loading...';
    let busyMessage = 'Processing...';

    if (isSubmitting) {
      loadingMessage = 'Saving task...';
      busyMessage = 'Saving...';
    } else if (isDeleting) {
      loadingMessage = 'Deleting task...';
      busyMessage = 'Deleting...';
    } else if (isUpdating) {
      loadingMessage = 'Updating task...';
      busyMessage = 'Updating...';
    } else if (isFetching) {
      loadingMessage = 'Refreshing tasks...';
      busyMessage = 'Refreshing...';
    } else if (isLoading) {
      loadingMessage = 'Loading tasks...';
      busyMessage = 'Loading...';
    }

    return {
      // Primary states
      isLoading,
      isFetching,
      isSubmitting,
      
      // Action states
      isDeleting,
      isUpdating,
      
      // Derived states
      isBusy,
      hasError,
      canInteract,
      
      // Error state
      error,
      
      // Loading messages
      loadingMessage,
      busyMessage,
    };
  }, [
    isLoading,
    isFetching,
    isSubmitting,
    isDeleting,
    isUpdating,
    error,
  ]);

  return loadingStates;
}
