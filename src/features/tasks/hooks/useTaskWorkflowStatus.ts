
import { useOptimizedMemo } from '@/hooks/useOptimizedMemo';

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
  const workflowStatus = useOptimizedMemo(
    () => ({
      isReady: canSubmit,
      isBusy: isSubmitting || isLoading,
      canSubmit,
    }),
    [canSubmit, isSubmitting, isLoading],
    { name: 'workflow-status' }
  );

  return { workflowStatus };
}
// CodeRabbit review
// CodeRabbit review
