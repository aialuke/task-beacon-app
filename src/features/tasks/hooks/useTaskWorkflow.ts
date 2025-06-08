
import { useTaskFormBase } from './useTaskFormBase';
import { useTaskMutations } from './useTaskMutations';
import { useTaskBatchOperations } from './useTaskBatchOperations';
import { useTaskWorkflowStatus } from './useTaskWorkflowStatus';
import { useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { Task } from '@/types';

interface UseTaskWorkflowOptions {
  onClose?: () => void;
  parentTask?: Task;
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
  const { onWorkflowComplete, onClose, parentTask } = options;

  // Use the base form hook for form functionality
  const formBase = useTaskFormBase({ onClose, parentTask });
  
  const mutations = useTaskMutations();
  const { executeBatchOperations } = useTaskBatchOperations();
  const { workflowStatus } = useTaskWorkflowStatus({
    canSubmit: formBase.isValid,
    isSubmitting: formBase.loading,
    isLoading: mutations.isLoading,
  });

  /**
   * Enhanced submit handler with workflow completion callback
   */
  const handleSubmitWithWorkflow = useOptimizedCallback(
    async (e: React.FormEvent) => {
      try {
        await formBase.handleSubmit(e);
        onWorkflowComplete?.({ success: true });
      } catch (error) {
        onWorkflowComplete?.({ success: false });
      }
    },
    [formBase.handleSubmit, onWorkflowComplete],
    { name: 'handleSubmitWithWorkflow' }
  );

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
    // Delegate form functionality to form base
    ...formBase,
    
    // Override submit with workflow callback
    handleSubmit: handleSubmitWithWorkflow,
    
    // Workflow-specific actions
    updateTaskWithWorkflow,
    batchTaskOperations: executeBatchOperations,
    
    // Workflow status
    workflowStatus,
  };
}
// CodeRabbit review
// CodeRabbit review
