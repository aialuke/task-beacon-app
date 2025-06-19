import { useState, useCallback } from 'react';

import type { TaskFormInput, TaskCreateData, TaskFormSubmissionOptions, TaskFormSubmissionState } from '@/types';

/**
 * Hook for managing task form submission
 * Focused on form submission logic and state
 */
export function useTaskFormSubmission(
  formValues: TaskFormInput,
  options: TaskFormSubmissionOptions = {}
): TaskFormSubmissionState {
  const { onSubmit, onClose } = options;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!onSubmit) return;
      
      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } catch (error) {
        console.error('Submission failed:', error);
        // Even if submission fails, we resolve the promise as the error is handled internally.
        return Promise.resolve();
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, formValues]
  );

  // Get formatted task data for API submission
  const getTaskData = useCallback((): TaskCreateData => {
    return {
      title: formValues.title.trim(),
      description: formValues.description.trim() || undefined,
      due_date: formValues.dueDate || undefined,
      photo_url: null,
      url_link: formValues.url.trim() || undefined,
      assignee_id: formValues.assigneeId || undefined,
    };
  }, [formValues]);

  const handleReset = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  return {
    isSubmitting,
    handleSubmit,
    handleReset,
    getTaskData,
  };
}