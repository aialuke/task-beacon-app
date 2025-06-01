import { useCallback } from 'react';
import { validateObject, validateWithError } from '@/hooks/validationUtils';
import { createTaskSchema } from '@/features/tasks/schemas/taskSchema';
import { createTextSchema } from '@/schemas/commonValidation';

/**
 * Standardized task form validation hook
 *
 * Provides consistent validation patterns for all task forms using Zod schemas
 */
export function useTaskFormValidation() {
  /**
   * Validate complete task form data using the task schema
   */
  const validateTaskForm = useCallback(
    (data: unknown) => {
      return validateWithError(createTaskSchema, data);
    },
    []
  );

  /**
   * Validate title with character limit
   */
  const validateTitle = useCallback(
    (value: string): boolean => {
      const titleSchema = createTextSchema(1, 22, true);
      const result = validateObject(titleSchema, value);
      return result.isValid;
    },
    []
  );

  /**
   * Create a title setter with validation and character limit enforcement
   */
  const createTitleSetter = useCallback((setTitle: (value: string) => void) => {
    return (value: string) => {
      if (value.length <= 22) {
        setTitle(value);
      }
    };
  }, []);

  return {
    validateTaskForm,
    validateTitle,
    createTitleSetter,
  };
}
