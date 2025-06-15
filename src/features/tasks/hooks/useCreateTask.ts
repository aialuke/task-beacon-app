import { toast } from 'sonner';

import { useUnifiedPhotoUpload } from '@/components/form/hooks/useUnifiedPhotoUpload';
import { logger } from '@/lib/logger';
import type { ProcessingResult } from '@/lib/utils/image';

import { useTaskForm } from './useTaskForm';
import { useTaskFormValidation } from './useTaskFormValidation';
import { useTaskMutations } from './useTaskMutations';



interface UseCreateTaskOptions {
  onClose?: () => void;
}

interface UseCreateTaskReturn {
  // Form state
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  url: string;
  setUrl: (value: string) => void;
  assigneeId: string;
  setAssigneeId: (value: string) => void;
  
  // Form validation and state
  isValid: boolean;
  errors: Record<string, string | undefined>;
  loading: boolean;
  
  // Photo upload
  photoPreview: string | null;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handlePhotoRemove: () => void;
  photoLoading: boolean;
  processingResult: ProcessingResult | null;
  
  // Actions
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  values: Record<string, unknown>;
}

/**
 * Create task hook - Simplified and consolidated
 * 
 * Combines form state, photo upload, and task creation without redundant layers.
 */
export function useCreateTask({ onClose }: UseCreateTaskOptions = {}): UseCreateTaskReturn {
  // Form state management
  const taskForm = useTaskForm({ onClose });
  
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

  // Integrated submit handler
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

      // Prepare task data
      const rawTaskData = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim() || undefined,
        dueDate: taskForm.dueDate,
        url: taskForm.url.trim(),
        assigneeId: taskForm.assigneeId,
        priority: 'medium' as const,
        photoUrl: photoUrl ?? undefined,
        urlLink: taskForm.url.trim() || undefined,
      };

      const taskData = validation.prepareTaskData(rawTaskData);
      if (!taskData) {
        toast.error('Validation failed');
        return;
      }

      // Create task
      const result = await createTaskCallback(taskData);

      if (result.success) {
        toast.success('Task created successfully');
        photoUpload.resetPhoto();
        onClose?.();
      } else {
        toast.error(result.error || 'Failed to create task');
      }
    } catch (error) {
      logger.error('Task creation error', error instanceof Error ? error : new Error(String(error)));
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
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
  };
}
