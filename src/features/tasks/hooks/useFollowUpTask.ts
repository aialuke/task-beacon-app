
import { useTaskForm } from './useTaskForm';
import { useTaskFormBase } from './useTaskFormBase';
import type { Task } from '@/types';

interface UseFollowUpTaskOptions {
  parentTask: Task;
  onClose?: () => void;
}

/**
 * Follow-up task hook - Phase 2.4.6.2d Streamlined
 * 
 * Specialized for creating follow-up tasks with parent task context.
 * Uses consolidated hook architecture without redundant layers.
 */
export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskOptions) {
  // Form state management with follow-up defaults
  const taskForm = useTaskForm({ 
    onClose,
    initialDescription: `Follow-up from task: ${parentTask.title}`,
  });
  
  // Photo upload and task creation with parent context
  const formBase = useTaskFormBase({ onClose, parentTask });

  // Integrated submit handler for follow-up tasks
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form using taskForm
    const validation = taskForm.validateForm();
    if (!validation.isValid) {
      return;
    }

    // Create follow-up task with photo integration
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
    
    // Parent task context
    parentTask,
  };
}
