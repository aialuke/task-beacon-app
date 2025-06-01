import { useCallback } from 'react';
import { useTaskFormValidation } from './useTaskFormValidation';

/**
 * Task form validation hook
 *
 * Provides validation functions specifically for task forms
 */
export function useTaskValidation() {
  const { validateTitle, createTitleSetter, validateTaskForm } =
    useTaskFormValidation();

  const validateField = useCallback(
    (fieldName: string, value: unknown) => {
      switch (fieldName) {
        case 'title':
          return validateTitle(value as string);
        default:
          return true;
      }
    },
    [validateTitle]
  );

  return {
    validateTitle,
    validateTaskForm,
    validateField,
    createTitleSetter,
  };
}
