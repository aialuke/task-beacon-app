
import { useOptimizedMemo } from '@/hooks/useOptimizedMemo';

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
 * Standardized Task Loading States Hook - Phase 3 Implementation
 * 
 * Provides consistent loading state management across task components.
 * Optimizes re-renders by memoizing computed states.
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

  // Compute derived states with optimization
  const loadingStates = useOptimizedMemo(() => {
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
  ], {
    name: 'task-loading-states',
    warnOnSlowComputation: false,
  });

  return loadingStates;
}
// CodeRabbit review
// CodeRabbit review
