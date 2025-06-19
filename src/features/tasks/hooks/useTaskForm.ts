
import { useState, useCallback } from 'react';

import type { TaskFormInput } from '@/lib/validation/schemas';
import type { TaskFormOptions, TaskFormHookReturn } from '@/types';

import { useTaskFormState } from './useTaskFormState';
import { useTaskFormSubmission } from './useTaskFormSubmission';
import { useTaskFormValidation } from './useTaskFormValidation';

// Local type definition for form errors
type FormErrors<T extends Record<string, unknown>> = {
  [K in keyof T]?: string;
};

/**
 * Task form hook - Phase 3 Refactored
 *
 * Now composed of focused hooks for better separation of concerns:
 * - useTaskFormState: Form data management
 * - useTaskFormValidation: Validation logic
 * - useTaskFormSubmission: Submission handling
 */
export function useTaskForm(options: TaskFormOptions = {}): TaskFormHookReturn {
  const {
    initialTitle = '',
    initialDescription = '',
    initialDueDate = null,
    initialUrl = null,
    initialAssigneeId = null,
    onSubmit,
    onClose,
  } = options;

  // Form state management
  const formState = useTaskFormState({
    initialTitle,
    initialDescription,
    initialDueDate,
    initialUrl,
    initialAssigneeId,
  });

  // Validation logic
  const validation = useTaskFormValidation();
  const [errors, setErrors] = useState<FormErrors<TaskFormInput>>({});

  // Submission handling
  const submission = useTaskFormSubmission(formState.values, {
    onSubmit,
    onClose,
  });

  // Enhanced form validation with error state management
  const validateForm = useCallback(() => {
    const formData = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      dueDate: formState.dueDate,
      url: formState.url.trim(),
      assigneeId: formState.assigneeId,
    };

    const result = validation.validateTaskFormData(formData);
    setErrors(result.errors);
    return result.isValid;
  }, [formState, validation]);

  // Enhanced submit handler with validation
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!validateForm()) return;
      await submission.handleSubmit();
    },
    [validateForm, submission]
  );

  // Enhanced reset that clears errors
  const resetFormState = useCallback(() => {
    formState.resetForm();
    setErrors({});
    submission.handleReset();
  }, [formState, submission]);

  const isValid = !Object.keys(errors).length && formState.title.trim().length > 0;

  return {
    // Form state
    ...formState,
    
    // Validation
    isValid,
    errors,
    validateForm,
    
    // Submission
    isSubmitting: submission.isSubmitting,
    handleSubmit,
    resetFormState,
    getTaskData: submission.getTaskData,
  };
}
