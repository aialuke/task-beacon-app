
import { useCallback } from 'react';
import { useTaskFormState, UseTaskFormStateOptions } from './useTaskFormState';
import { useTaskFormValidation } from './useTaskFormValidation';

/**
 * Simplified task form hook
 *
 * A thin orchestrator that combines form state and validation.
 * Photo upload is now handled separately to reduce coupling.
 * 
 * @param options - Configuration options for form state
 * @returns Combined form state and validation methods
 */
export function useTaskForm(options: UseTaskFormStateOptions = {}) {
  const formState = useTaskFormState(options);
  const validation = useTaskFormValidation();

  // Create title setter with validation
  const setTitle = useCallback((value: string) => {
    const setter = validation.createTitleSetter(formState.setTitle);
    setter(value);
  }, [formState.setTitle, validation]);

  // Validate entire form
  const validateForm = useCallback(() => {
    return validation.validateTaskForm({
      title: formState.title,
      description: formState.description,
      dueDate: formState.dueDate,
      url: formState.url,
      pinned: formState.pinned,
      assigneeId: formState.assigneeId,
      priority: 'medium',
    });
  }, [formState, validation]);

  return {
    // Form state
    ...formState,
    setTitle, // Override with validated setter

    // Validation methods
    validateTitle: validation.validateTitle,
    validateField: validation.validateField,
    validateForm,
    
    // Validation utilities
    showValidationErrors: validation.showValidationErrors,
  };
}
