
import { useTaskFormOrchestration } from './useTaskFormOrchestration';
import { useTaskMutations } from './useTaskMutations';
import { useOptimizedMemo, useOptimizedCallback } from '@/hooks/useOptimizedMemo';
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
 * 
 * Now focuses on high-level workflow coordination without duplicating
 * form and mutation logic. Uses composition instead of reimplementation.
 */
export function useTaskWorkflow(options: UseTaskWorkflowOptions = {}) {
  const { onWorkflowComplete, ...formOptions } = options;

  // Use the simplified form orchestration
  const formOrchestration = useTaskFormOrchestration({
    ...formOptions,
    onSubmitSuccess: (task) => {
      onWorkflowComplete?.({ success: true, taskId: task.id });
    },
    onSubmitError: () => {
      onWorkflowComplete?.({ success: false });
    },
  });

  // Get mutations for direct task operations
  const mutations = useTaskMutations();

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

  /**
   * Batch task operations
   */
  const batchTaskOperations = useOptimizedCallback(
    async (operations: Array<{ type: 'update'; data: Partial<Task>; task: Task }>): Promise<{
      results: WorkflowResult[];
      successCount: number;
      totalCount: number;
    }> => {
      const results: WorkflowResult[] = [];
      
      for (const operation of operations) {
        if (operation.type === 'update' && operation.task) {
          const result = await updateTaskWithWorkflow(operation.task, operation.data);
          results.push(result);
        } else {
          results.push({
            success: false,
            error: 'Invalid operation: task required for update',
          });
        }
      }

      const successCount = results.filter(r => r.success).length;
      return { results, successCount, totalCount: results.length };
    },
    [updateTaskWithWorkflow],
    { name: 'batchTaskOperations' }
  );

  // Simplified workflow status that doesn't duplicate form status
  const workflowStatus = useOptimizedMemo(
    () => ({
      isReady: formOrchestration.formStatus.canSubmit,
      isBusy: formOrchestration.isSubmitting || mutations.isLoading,
      canSubmit: formOrchestration.formStatus.canSubmit,
    }),
    [formOrchestration.formStatus, formOrchestration.isSubmitting, mutations.isLoading],
    { name: 'workflow-status' }
  );

  return {
    // Delegate form functionality to form orchestration
    ...formOrchestration,
    
    // Workflow-specific actions
    updateTaskWithWorkflow,
    batchTaskOperations,
    
    // Workflow status (simplified, non-overlapping with form status)
    workflowStatus,
  };
}
