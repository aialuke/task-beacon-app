
import { useMemo } from 'react';

interface WorkflowStatusOptions {
  canSubmit: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
}

/**
 * Hook for managing workflow status
 * Extracted from useTaskWorkflow for better organization
 */
export function useTaskWorkflowStatus({
  canSubmit,
  isSubmitting,
  isLoading,
}: WorkflowStatusOptions) {
  const workflowStatus = useMemo(
    () => ({
      isReady: canSubmit,
      isBusy: isSubmitting || isLoading,
      canSubmit,
    }),
    [canSubmit, isSubmitting, isLoading]
  );

  return { workflowStatus };
}
