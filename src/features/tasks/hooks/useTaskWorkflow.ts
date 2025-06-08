
import { useCallback } from 'react';
import { useTaskForm } from './useTaskForm';
import { useTaskFormBase } from './useTaskFormBase';
import { useTaskMutations } from './useTaskMutations';
import { useTaskBatchOperations } from './useTaskBatchOperations';
import { useTaskWorkflowStatus } from './useTaskWorkflowStatus';
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
 * Simplified workflow orchestration hook - Phase 2.4 Revised
 * Using standard React hooks instead of custom performance abstractions
 */
export function useTaskWorkflow(options: UseTaskWorkflowOptions = {}) {
  const { onWorkflowComplete, onClose, parentTask } = options;

  // Use consolidated form hooks
  const taskForm = useTaskForm({ onClose });
  const formBase = useTaskFormBase({ onClose, parentTask });
  
  const mutations = useTaskMutations();
  const { executeBatchOperations } = useTaskBatchOperations();
  const { workflowStatus } = useTaskWorkflowStatus({
    canSubmit: taskForm.isValid,
    isSubmitting: formBase.loading,
    isLoading: mutations.isLoading,
  });

  /**
   * Enhanced submit handler with workflow completion callback
   */
  const handleSubmitWithWorkflow = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        // Validate form
        const isValidForm = taskForm.validateForm();
        if (!isValidForm) {
          return;
        }

        // Create task with photo integration
        await formBase.createTaskWithPhoto(taskForm.values);
        onWorkflowComplete?.({ success: true });
      } catch (error) {
        onWorkflowComplete?.({ success: false });
      }
    },
    [taskForm, formBase, onWorkflowComplete]
  );

  /**
   * Simplified task update workflow
   */
  const updateTaskWithWorkflow = useCallback(
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
    [mutations, onWorkflowComplete]
  );

  return {
    // Form state from taskForm
    title: taskForm.title,
    setTitle: taskForm.setTitle,
    description: taskForm.description,
    setDescription: taskForm.setDescription,
    dueDate: taskForm.dueDate,
    setDueDate: taskForm.setDueDate,
    url: taskForm.url,
    setUrl: taskForm.setUrl,
    assigneeId: taskForm.assigneeId,
    setAssigneeId: taskForm.setAssigneeId,
    
    // Form validation and state
    isValid: taskForm.isValid,
    errors: taskForm.errors,
    values: taskForm.values,
    
    // Photo upload from formBase
    photoPreview: formBase.photoPreview,
    handlePhotoChange: formBase.handlePhotoChange,
    handlePhotoRemove: formBase.handlePhotoRemove,
    photoLoading: formBase.photoLoading,
    processingResult: formBase.processingResult,
    
    // Combined loading state and actions
    loading: formBase.loading,
    handleSubmit: handleSubmitWithWorkflow,
    
    // Workflow-specific actions
    updateTaskWithWorkflow,
    batchTaskOperations: executeBatchOperations,
    
    // Workflow status
    workflowStatus,
  };
}
