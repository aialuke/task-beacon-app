
import { useState, useMemo, useCallback } from 'react';
import { useUnifiedPhotoUpload } from '@/components/form/hooks/useUnifiedPhotoUpload';
import { useTaskMutations } from './useTaskMutations';
import { useTaskFormValidation } from './useTaskFormValidation';
import { toast } from 'sonner';
import type { Task } from '@/types';

interface UseTaskFormBaseOptions {
  onClose?: () => void;
  parentTask?: Task;
}

/**
 * Streamlined task form base hook - Phase 3 Simplified
 * 
 * Now uses unified photo upload system
 */
export function useTaskFormBase({ onClose, parentTask }: UseTaskFormBaseOptions = {}) {
  const [loading, setLoading] = useState(false);
  const validation = useTaskFormValidation();
  const { createTaskCallback } = useTaskMutations();

  // Unified photo upload hook
  const photoUpload = useUnifiedPhotoUpload({
    processingOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
    },
  });

  // Task data preparation with photo URL integration
  const prepareTaskData = useCallback((formData: any, photoUrl: string | null) => {
    const rawTaskData = {
      title: String(formData.title).trim(),
      description: String(formData.description).trim() || (parentTask ? `Follow-up from task: ${parentTask.title}` : undefined),
      dueDate: formData.dueDate,
      url: String(formData.url).trim(),
      assigneeId: formData.assigneeId,
      priority: 'medium' as const,
      photoUrl: photoUrl ?? undefined,
      urlLink: String(formData.url).trim() || undefined,
      parentTaskId: parentTask?.id || undefined,
    };

    return validation.prepareTaskData(rawTaskData);
  }, [parentTask, validation]);

  // Photo upload and task creation integration
  const createTaskWithPhoto = useCallback(
    async (formData: any) => {
      setLoading(true);
      
      try {
        // Handle photo upload first
        const photoUrl = await photoUpload.uploadPhoto();

        // Prepare validated task data with photo URL
        const taskData = prepareTaskData(formData, photoUrl);

        if (!taskData) {
          return { success: false, error: 'Validation failed' };
        }

        console.log('Creating task with data:', taskData);
        const result = await createTaskCallback(taskData as any);

        if (result.success) {
          const successMessage = parentTask ? 'Follow-up task created successfully' : 'Task created successfully';
          toast.success(successMessage);
          photoUpload.resetPhoto();
          onClose?.();
        } else {
          toast.error(result.error || 'Failed to create task');
        }

        return result;
      } catch (error) {
        console.error('Task creation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [photoUpload, prepareTaskData, createTaskCallback, onClose, parentTask]
  );

  // Combined loading state
  const combinedLoading = useMemo(
    () => loading || photoUpload.loading,
    [loading, photoUpload.loading]
  );

  return useMemo(
    () => ({
      // Photo upload functionality
      photoPreview: photoUpload.photoPreview,
      handlePhotoChange: photoUpload.handlePhotoChange,
      handlePhotoRemove: photoUpload.handlePhotoRemove,
      photoLoading: photoUpload.loading,
      processingResult: photoUpload.processingResult,
      
      // Task creation with photo integration
      createTaskWithPhoto,
      loading: combinedLoading,
      
      // Utilities
      validation,
    }),
    [
      photoUpload.photoPreview,
      photoUpload.handlePhotoChange,
      photoUpload.handlePhotoRemove,
      photoUpload.loading,
      photoUpload.processingResult,
      createTaskWithPhoto,
      combinedLoading,
      validation,
    ]
  );
}
