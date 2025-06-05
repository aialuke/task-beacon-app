
import { useTaskForm } from '@/features/tasks/hooks/useTaskForm';
import { useTaskMutations } from '@/features/tasks/hooks/useTaskMutations';
import { useOptimizedMemo, useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { Task } from '@/types';
import { UseTaskFormStateOptions } from '@/features/tasks/hooks/useTaskFormState';

interface UseTaskWorkflowOptions extends UseTaskFormStateOptions {
  enableOptimisticUpdates?: boolean;
  onWorkflowComplete?: (result: { success: boolean; taskId?: string }) => void;
}

interface WorkflowResult {
  success: boolean;
  error?: string;
  taskId?: string;
}

/**
 * Optimized workflow orchestration hook for task operations
 * 
 * Streamlined workflow management without realtime dependencies.
 */
export function useTaskWorkflow(options: UseTaskWorkflowOptions = {}) {
  const {
    enableOptimisticUpdates = true,
    onWorkflowComplete,
    ...formOptions
  } = options;

  // Memoize configuration to prevent unnecessary hook re-initializations
  const config = useOptimizedMemo(
    () => ({ enableOptimisticUpdates }),
    [enableOptimisticUpdates],
    { name: 'workflow-config' }
  );

  // Initialize constituent hooks with stable configuration
  const form = useTaskForm(formOptions);
  const mutations = useTaskMutations();

  /**
   * Optimized task update workflow with proper error handling
   */
  const updateTaskWithWorkflow = useOptimizedCallback(
    async (task: Task, updates: Partial<Task>): Promise<WorkflowResult> => {
      try {
        if (config.enableOptimisticUpdates) {
          const result = await mutations.toggleTaskComplete(task);
          
          return {
            success: result.success,
            error: result.success ? undefined : result.message,
            taskId: task.id,
          };
        }

        return { success: true, taskId: task.id };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: errorMessage, taskId: task.id };
      }
    },
    [mutations, config],
    { name: 'updateTaskWithWorkflow' }
  );

  /**
   * Optimized batch operations with better error tracking
   */
  const batchTaskOperations = useOptimizedCallback(
    async (operations: Array<{ type: 'update'; data: Partial<Task>; task: Task }>): Promise<{
      results: WorkflowResult[];
      successCount: number;
      totalCount: number;
    }> => {
      const results: WorkflowResult[] = [];
      
      // Process operations in batches for better performance
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

  // Optimized workflow status computation
  const workflowStatus = useOptimizedMemo(
    () => ({
      isFormReady: form.title.trim().length > 0,
      isLoading: form.loading,
      hasUnsavedChanges: Boolean(form.title || form.description || form.url),
      canSubmit: form.title.trim().length > 0 && !form.loading,
    }),
    [form.title, form.loading, form.description, form.url],
    { name: 'workflow-status' }
  );

  // Memoize return object to prevent unnecessary re-renders
  return useOptimizedMemo(
    () => ({
      // Form state and actions
      ...form,
      
      // Optimized workflow actions
      updateTaskWithWorkflow,
      batchTaskOperations,
      
      // Computed workflow status
      workflowStatus,
      
      // Configuration
      enableOptimisticUpdates: config.enableOptimisticUpdates,
    }),
    [
      form, 
      updateTaskWithWorkflow, 
      batchTaskOperations, 
      workflowStatus, 
      config
    ],
    { name: 'workflow-return' }
  );
}
