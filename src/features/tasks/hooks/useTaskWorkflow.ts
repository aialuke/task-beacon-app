
import { useTaskFormOrchestration } from './useTaskFormOrchestration';
import { useTaskMutations } from './useTaskMutations';
import { useTaskBatchOperations } from './useTaskBatchOperations';
import { useTaskWorkflowStatus } from './useTaskWorkflowStatus';
import { useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { Task } from '@/types';
import { UseTaskFormStateOptions } from './useTaskFormState';

interface UseTaskWorkflowOptions extends UseTaskFormStateOptions {
  onWorkflowComplete?: (result: { success: boolean; taskId?: string }) => void;
}

interface WorkflowResult {
  success: boolean;
  error?: string;
  taskId?: string;
}

/**
 * Simplified workflow orchestration hook
 * Now composed of smaller, focused hooks for better maintainability
 */
export function useTaskWorkflow(options: UseTaskWorkflowOptions = {}) {
  const { onWorkflowComplete, ...formOptions } = options;

  // Use specialized hooks
  const formOrchestration = useTaskFormOrchestration({
    ...formOptions,
    onSubmitSuccess: (task) => {
      onWorkflowComplete?.({ success: true, taskId: task.id });
    },
    onSubmitError: () => {
      onWorkflowComplete?.({ success: false });
    },
  });

  const mutations = useTaskMutations();
  const { executeBatchOperations } = useTaskBatchOperations();
  const { workflowStatus } = useTaskWorkflowStatus({
    canSubmit: formOrchestration.formStatus.canSubmit,
    isSubmitting: formOrchestration.isSubmitting,
    isLoading: mutations.isLoading,
  });

  /**
   * Simplified task update workflow
   */
  const updateTaskWithWorkflow = useOptimizedCallback(
    async (task: Task, updates: Partial<Task>): Promise<WorkflowResult> => {
      try {
        const result = await mutations.updateTaskCallback(task.id, updates);
        
        if (result.success) {
          onWorkflowComplete?.({ success: true, taskId: task.id });
          return { success: true, taskId: task.id };
        } else {
          onWorkflowComplete?.({ success: false, taskId: task.id });
          return { success: false, error: 'Update failed', taskId: task.id };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        onWorkflowComplete?.({ success: false, taskId: task.id });
        return { success: false, error: errorMessage, taskId: task.id };
      }
    },
    [mutations, onWorkflowComplete],
    { name: 'updateTaskWithWorkflow' }
  );

  return {
    // Delegate form functionality to form orchestration
    ...formOrchestration,
    
    // Workflow-specific actions
    updateTaskWithWorkflow,
    batchTaskOperations: executeBatchOperations,
    
    // Workflow status
    workflowStatus,
  };
}
