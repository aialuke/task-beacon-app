import { useCallback } from 'react';
import { useTaskForm } from './useTaskForm';
import { useTaskSubmission } from './useTaskSubmission';
import { useTaskNavigation } from './useTaskNavigation';
import { useEnhancedTaskPhotoUpload } from '@/components/form/hooks/usePhotoUpload';

interface UseCreateTaskProps {
  onClose?: () => void;
}

/**
 * Refactored hook for creating new tasks
 * 
 * Now acts as a thin orchestrator that composes:
 * - Form state management
 * - Photo upload handling
 * - Task submission
 * - Navigation
 * 
 * Each concern is handled by a focused hook, making this easier to test and maintain.
 */
export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
  const { navigateToDashboard } = useTaskNavigation();
  const { submitTask } = useTaskSubmission();
  const taskForm = useTaskForm({
    onClose: onClose || navigateToDashboard,
  });
  
  // Photo upload is now composed separately
  const photoUpload = useEnhancedTaskPhotoUpload({
    processingOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto',
    },
    autoProcess: true,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate form
      const validationResult = taskForm.validateForm();
      if (!validationResult.isValid) {
        taskForm.showValidationErrors(validationResult.errors);
        return;
      }

      taskForm.setLoading(true);
      
      try {
        // Handle photo upload if present
        let photoUrl: string | null = null;
        if (photoUpload.photo) {
          const uploadResult = await photoUpload.uploadPhoto();
          if (uploadResult) {
            photoUrl = uploadResult;
          }
        }

        // Submit task
        const result = await submitTask({
          title: taskForm.title,
          description: taskForm.description,
          dueDate: taskForm.dueDate,
          url: taskForm.url,
          pinned: taskForm.pinned,
          assigneeId: taskForm.assigneeId,
          photoUrl,
          priority: 'medium',
        });

        if (result.success) {
          // Reset form
          taskForm.resetFormState();
          photoUpload.resetPhoto();
          
          // Navigate or call onClose
          const closeCallback = onClose || navigateToDashboard;
          closeCallback();
        }
      } finally {
        taskForm.setLoading(false);
      }
    },
    [taskForm, photoUpload, submitTask, onClose, navigateToDashboard]
  );

  // Combine loading states
  const loading = taskForm.loading || photoUpload.photoLoading;

  return {
    // Form state
    ...taskForm,
    loading, // Combined loading state
    
    // Photo upload
    photo: photoUpload.photo,
    photoPreview: photoUpload.photoPreview,
    handlePhotoChange: photoUpload.handlePhotoChange,
    isPhotoModalOpen: photoUpload.isPhotoModalOpen,
    openPhotoModal: photoUpload.openPhotoModal,
    closePhotoModal: photoUpload.closePhotoModal,
    handleModalPhotoSelect: photoUpload.handleModalPhotoSelect,
    handlePhotoRemove: photoUpload.handlePhotoRemove,
    
    // Submit handler
    handleSubmit,
  };
}
