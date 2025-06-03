import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskForm } from './useTaskForm';
import { useTaskFormValidation } from './useTaskFormValidation';
import { useCreateTaskAPI } from './useCreateTaskAPI';
import { useCreateTaskPhotoUpload } from './useCreateTaskPhotoUpload';

interface UseCreateTaskProps {
  onClose?: () => void;
}

/**
 * Hook for creating new tasks with standardized validation
 * Orchestrates form state, validation, photo upload, and API operations
 */
export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
  const navigate = useNavigate();
  const { validateTaskForm } = useTaskFormValidation();
  const { executeCreateTask } = useCreateTaskAPI();
  const { uploadPhotoIfPresent } = useCreateTaskPhotoUpload();

  const taskForm = useTaskForm({
    onClose: onClose || (() => navigate('/')),
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      console.log('🚀 Task creation started');
      e.preventDefault();

      const formData = {
        title: taskForm.title,
        description: taskForm.description,
        dueDate: taskForm.dueDate,
        url: taskForm.url,
        pinned: taskForm.pinned,
        assigneeId: taskForm.assigneeId,
        priority: 'medium',
      };

      console.log('📋 Form data:', formData);

      const validationResult = validateTaskForm(formData);
      if (!validationResult.isValid) {
        console.error('❌ Validation failed:', validationResult);
        return;
      }

      console.log('✅ Validation passed');
      taskForm.setLoading(true);
      
      try {
        console.log('📸 Starting photo upload...');
        // Handle photo upload
        const photoUrl = await uploadPhotoIfPresent(taskForm.photo);
        console.log('📸 Photo upload result:', photoUrl);

        console.log('💾 Creating task...');
        // Create task
        const result = await executeCreateTask({
          ...formData,
          photoUrl,
        });

        console.log('💾 Task creation result:', result);

        if (result.success) {
          console.log('🎉 Task created successfully, resetting form and navigating...');
          taskForm.resetForm();
          
          // Navigate back to dashboard after successful task creation
          const closeCallback = onClose || (() => navigate('/'));
          closeCallback();
        } else {
          console.error('❌ Task creation failed:', result.error);
        }
      } catch (error: unknown) {
        // Error handling is done in the individual hooks
        console.error('💥 Error in task creation flow:', error);
      } finally {
        taskForm.setLoading(false);
      }
    },
    [taskForm, validateTaskForm, executeCreateTask, uploadPhotoIfPresent, onClose, navigate]
  );

  return {
    ...taskForm,
    handleSubmit,
  };
}
