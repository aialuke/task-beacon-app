
import { useTaskForm } from './useTaskForm';
import { useUnifiedPhotoUpload } from '@/components/form/hooks/useUnifiedPhotoUpload';
import { useTaskMutations } from './useTaskMutations';
import { useTaskFormValidation } from './useTaskFormValidation';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import type { Task } from '@/types';

interface UseFollowUpTaskOptions {
  parentTask: Task;
  onClose?: () => void;
}

/**
 * Follow-up task hook - Simplified and consolidated
 * 
 * Specialized for creating follow-up tasks with parent task context.
 */
export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskOptions) {
  // Form state management with follow-up defaults
  const taskForm = useTaskForm({ 
    onClose,
    initialDescription: `Follow-up from task: ${parentTask.title}`,
  });
  
  // Photo upload functionality
  const photoUpload = useUnifiedPhotoUpload({
    processingOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
    },
  });

  // Task mutations
  const { createTaskCallback } = useTaskMutations();
  const validation = useTaskFormValidation();

  // Integrated submit handler for follow-up tasks
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const isValidForm = taskForm.validateForm();
    if (!isValidForm) {
      return;
    }

    taskForm.setIsSubmitting(true);
    
    try {
      // Handle photo upload
      const photoUrl = await photoUpload.uploadPhoto();

      // Prepare follow-up task data
      const rawTaskData = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim() || `Follow-up from task: ${parentTask.title}`,
        dueDate: taskForm.dueDate,
        url: taskForm.url.trim(),
        assigneeId: taskForm.assigneeId,
        priority: 'medium' as const,
        photoUrl: photoUrl ?? undefined,
        urlLink: taskForm.url.trim() || undefined,
        parentTaskId: parentTask.id,
      };

      const taskData = validation.prepareTaskData(rawTaskData);
      if (!taskData) {
        toast.error('Validation failed');
        return;
      }

      // Create follow-up task
      const result = await createTaskCallback(taskData as any);

      if (result.success) {
        toast.success('Follow-up task created successfully');
        photoUpload.resetPhoto();
        onClose?.();
      } else {
        toast.error(result.error || 'Failed to create follow-up task');
      }
    } catch (error) {
      logger.error('Follow-up task creation error', error instanceof Error ? error : new Error(String(error)));
      const errorMessage = error instanceof Error ? error.message : 'Failed to create follow-up task';
      toast.error(errorMessage);
    } finally {
      taskForm.setIsSubmitting(false);
    }
  };

  return {
    // Form state
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
    loading: taskForm.isSubmitting || photoUpload.loading,
    
    // Photo upload
    photoPreview: photoUpload.photoPreview,
    handlePhotoChange: photoUpload.handlePhotoChange,
    handlePhotoRemove: photoUpload.handlePhotoRemove,
    photoLoading: photoUpload.loading,
    processingResult: photoUpload.processingResult,
    
    // Actions
    handleSubmit,
    values: taskForm.values,
    
    // Parent task context
    parentTask,
  };
}
