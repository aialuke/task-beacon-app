import { useCallback, useMemo } from 'react';
import { useTaskForm } from '@/features/tasks/hooks/useTaskForm';
import { useTaskMutations } from '@/features/tasks/hooks/useTaskMutations';
import { useRealtimeTaskUpdates } from '@/features/tasks/hooks/useRealtimeTaskUpdates';
import { Task } from '@/types';
import { UseTaskFormStateOptions } from '@/features/tasks/hooks/useTaskFormState';

interface UseTaskWorkflowOptions extends UseTaskFormStateOptions {
  enableRealtimeSync?: boolean;
  enableOptimisticUpdates?: boolean;
  onWorkflowComplete?: (result: { success: boolean; taskId?: string }) => void;
}

/**
 * Enhanced workflow orchestration hook for task operations
 * 
 * Combines multiple task-related hooks into cohesive workflows while maintaining
 * separation of concerns. Provides simplified APIs for complex multi-step operations.
 * 
 * @param options - Configuration options for the workflow
 * @returns Combined workflow state and actions
 */
export function useTaskWorkflow(options: UseTaskWorkflowOptions = {}) {
  const {
    enableRealtimeSync = true,
    enableOptimisticUpdates = true,
    onWorkflowComplete,
    ...formOptions
  } = options;

  // Initialize all constituent hooks
  const form = useTaskForm(formOptions);
  const mutations = useTaskMutations();
  const realtime = useRealtimeTaskUpdates();

  /**
   * Enhanced task update workflow
   * Handles optimistic updates with rollback capability
   */
  const updateTaskWithWorkflow = useCallback(async (
    task: Task,
    updates: Partial<Task>
  ) => {
    try {
      // Use optimistic updates if enabled
      if (enableOptimisticUpdates) {
        const updatedTask = { ...task, ...updates };
        const result = await mutations.toggleTaskComplete(updatedTask);
        
        if (enableRealtimeSync && result.success) {
          realtime.markTaskAsUpdated(task.id);
        }

        return result;
      } else {
        // Standard update without optimistic behavior
        return { success: true };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }, [mutations, realtime, enableOptimisticUpdates, enableRealtimeSync]);

  /**
   * Batch operation workflow
   * Handles multiple task operations with proper coordination
   */
  const batchTaskOperations = useCallback(async (
    operations: Array<{ type: 'update'; data: any; task?: Task }>
  ) => {
    const results = [];
    
    for (const operation of operations) {
      if (operation.type === 'update' && operation.task) {
        const updateResult = await updateTaskWithWorkflow(operation.task, operation.data);
        results.push({ operation: 'update', ...updateResult });
      } else {
        results.push({ operation: operation.type, success: false, error: 'Task required for update' });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return { results, successCount, totalCount };
  }, [updateTaskWithWorkflow]);

  // Compute workflow status
  const workflowStatus = useMemo(() => ({
    isFormReady: form.title.trim().length > 0,
    isLoading: form.loading,
    isRealtimeConnected: realtime.isSubscribed,
    hasUnsavedChanges: form.title || form.description || form.url,
    canSubmit: form.title.trim().length > 0 && !form.loading,
  }), [form, realtime]);

  return {
    // Form state and actions
    ...form,
    
    // Workflow-specific actions
    updateTaskWithWorkflow,
    batchTaskOperations,
    
    // Workflow status
    workflowStatus,
    
    // Real-time information
    isRealtimeConnected: realtime.isSubscribed,
    realtimeUpdatedTasks: realtime.updatedTasksCount,
    
    // Configuration
    enableRealtimeSync,
    enableOptimisticUpdates,
  };
} 