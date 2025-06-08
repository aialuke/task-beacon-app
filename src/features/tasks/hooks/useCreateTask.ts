
import { useTaskForm } from './useTaskForm';
import { useTaskFormBase } from './useTaskFormBase';

interface UseCreateTaskOptions {
  onClose?: () => void;
}

/**
 * Create task hook - Phase 2.4.6.2d Streamlined
 * 
 * Combines form state management with photo upload and task creation.
 * Uses consolidated hook architecture without redundant layers.
 */
export function useCreateTask({ onClose }: UseCreateTaskOptions = {}) {
  // Form state management
  const taskForm = useTaskForm({ onClose });
  
  // Photo upload and task creation coordination
  const formBase = useTaskFormBase({ onClose });

  // Integrated submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form using taskForm
    const validation = taskForm.validateForm();
    if (!validation.isValid) {
      return;
    }

    // Create task with photo integration
    await formBase.createTaskWithPhoto(taskForm.values);
  };

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
    
    // Photo upload from formBase
    photoPreview: formBase.photoPreview,
    handlePhotoChange: formBase.handlePhotoChange,
    handlePhotoRemove: formBase.handlePhotoRemove,
    photoLoading: formBase.photoLoading,
    processingResult: formBase.processingResult,
    
    // Combined loading state and actions
    loading: formBase.loading,
    handleSubmit,
    
    // Form utilities
    values: taskForm.values,
  };
}
