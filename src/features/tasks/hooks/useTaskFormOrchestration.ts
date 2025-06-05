
import { useCallback } from 'react';
import { useTaskForm } from './useTaskForm';
import { useTaskMutations } from './useTaskMutations';
import { useOptimizedMemo, useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { Task } from '@/types';
import { UseTaskFormStateOptions } from './useTaskFormState';

interface UseTaskFormOrchestrationOptions extends UseTaskFormStateOptions {
  onSubmitSuccess?: (task: Task) => void;
  onSubmitError?: (error: Error) => void;
}

interface FormSubmissionResult {
  success: boolean;
  error?: string;
  task?: Task;
}

/**
 * Simplified form orchestration hook
 * 
 * Coordinates form state with task mutations without complex workflow logic.
 * Focuses on the single responsibility of orchestrating form submission.
 */
export function useTaskFormOrchestration(options: UseTaskFormOrchestrationOptions = {}) {
  const {
    onSubmitSuccess,
    onSubmitError,
    ...formOptions
  } = options;

  // Get form state and validation
  const form = useTaskForm(formOptions);
  const mutations = useTaskMutations();

  // Optimized form submission handler
  const submitTask = useOptimizedCallback(
    async (): Promise<FormSubmissionResult> => {
      try {
        // Validate form before submission
        const validationResult = form.validateForm();
        if (!validationResult.isValid) {
          const errorMessage = Array.isArray(validationResult.errors) 
            ? validationResult.errors.join(', ') 
            : 'Validation failed';
          
          return {
            success: false,
            error: errorMessage,
          };
        }

        // Prepare task data - only include fields that exist in TaskCreateData
        const taskData = {
          title: form.title,
          description: form.description || undefined,
          due_date: form.dueDate || null,
          url_link: form.url || null,
          assignee_id: form.assigneeId || null,
          priority: 'medium' as const,
        };

        // Submit the task
        const result = await mutations.createTaskCallback(taskData);
        
        if (result.success && result.data) {
          // Reset form on successful submission
          form.resetForm();
          
          // Call success callback if provided
          onSubmitSuccess?.(result.data);
          
          return {
            success: true,
            task: result.data,
          };
        } else {
          const error = new Error(result.error || 'Failed to create task');
          onSubmitError?.(error);
          return {
            success: false,
            error: result.error || 'Failed to create task',
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const err = new Error(errorMessage);
        onSubmitError?.(err);
        
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [form, mutations, onSubmitSuccess, onSubmitError],
    { name: 'submitTask' }
  );

  // Optimized update task handler
  const updateTask = useOptimizedCallback(
    async (taskId: string, updates: Partial<Task>): Promise<FormSubmissionResult> => {
      try {
        const result = await mutations.updateTaskCallback(taskId, updates);
        
        if (result.success && result.data) {
          return {
            success: true,
            task: result.data,
          };
        } else {
          return {
            success: false,
            error: result.error || 'Failed to update task',
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [mutations],
    { name: 'updateTask' }
  );

  // Compute form status
  const formStatus = useOptimizedMemo(
    () => ({
      canSubmit: form.title.trim().length > 0 && !mutations.isLoading,
      isSubmitting: mutations.isLoading,
      hasUnsavedChanges: Boolean(form.title || form.description || form.url),
      isValid: form.title.trim().length > 0,
    }),
    [form.title, form.description, form.url, mutations.isLoading],
    { name: 'form-status' }
  );

  return {
    // Form state and actions
    ...form,
    
    // Orchestrated actions
    submitTask,
    updateTask,
    
    // Form status
    formStatus,
    
    // Loading state from mutations
    isSubmitting: mutations.isLoading,
  };
}
