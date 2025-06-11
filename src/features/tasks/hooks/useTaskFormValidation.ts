import { useCallback } from 'react';
import { toast } from 'sonner';

import {
  useUnifiedValidation,
  validateUnifiedTask,
  type UnifiedValidationResult,
} from '@/lib/validation';

interface TaskFormData {
  title: string;
  description?: string;
  url?: string;
  dueDate?: string;
  assigneeId?: string;
  priority?: string;
  photoUrl?: string;
  parentTaskId?: string;
}

/**
 * Simplified Task Form Validation Hook - Phase 1 Consolidation
 *
 * Uses unified validation system to replace scattered validation patterns.
 */
export function useTaskFormValidation() {
  const {
    validateTaskTitle,
    validateTaskDescription,
    validateUrl,
    validateField,
  } = useUnifiedValidation();

  /**
   * Validate complete task form data
   */
  const validateTaskFormData = useCallback(
    (
      data: unknown
    ): {
      isValid: boolean;
      errors: Record<string, string>;
      data?: TaskFormData;
    } => {
      const result = validateUnifiedTask(data);

      if (result.isValid && result.data) {
        return { isValid: true, errors: {}, data: result.data as TaskFormData };
      }

      const errors: Record<string, string> = {};
      if (result.fieldErrors) {
        Object.assign(errors, result.fieldErrors);
      }

      return { isValid: false, errors };
    },
    []
  );

  /**
   * Validate data for creating a task
   */
  const validateCreateTaskData = useCallback(
    (
      data: unknown
    ): {
      isValid: boolean;
      errors: Record<string, string>;
      data?: TaskFormData;
    } => {
      return validateTaskFormData(data);
    },
    [validateTaskFormData]
  );

  /**
   * Validate data for updating a task
   */
  const validateUpdateTaskData = useCallback(
    (
      data: unknown
    ): {
      isValid: boolean;
      errors: Record<string, string>;
      data?: TaskFormData;
    } => {
      return validateTaskFormData(data);
    },
    [validateTaskFormData]
  );

  /**
   * Validate individual fields
   */
  const validateFormField = useCallback(
    (
      fieldName: string,
      value: unknown
    ): { isValid: boolean; error?: string } => {
      const result = validateField(fieldName, value);

      return {
        isValid: result.isValid,
        error: result.isValid ? undefined : result.errors[0],
      };
    },
    [validateField]
  );

  /**
   * Validate title with character limit
   */
  const validateTitle = useCallback(
    (value: string): boolean => {
      const result = validateTaskTitle(value);
      return result.isValid;
    },
    [validateTaskTitle]
  );

  /**
   * Create a title setter with validation and character limit enforcement
   */
  const createTitleSetter = useCallback((setTitle: (value: string) => void) => {
    return (value: string) => {
      // Enforce character limit
      if (value.length <= 22) {
        setTitle(value);
      }
    };
  }, []);

  /**
   * Show validation errors with better UX
   */
  const showValidationErrors = useCallback((errors: Record<string, string>) => {
    const errorEntries = Object.entries(errors);

    if (errorEntries.length === 0) return;

    // Show the first error prominently
    const [firstField, firstError] = errorEntries[0];

    if (errorEntries.length === 1) {
      toast.error(`${firstField}: ${firstError}`);
    } else {
      // Multiple errors - show count and first error
      toast.error(`Validation Failed: ${firstError}`, {
        description: `${errorEntries.length} validation errors found. Please check all fields.`,
      });
    }
  }, []);

  /**
   * Prepare task data with validation
   */
  const prepareTaskData = useCallback(
    (formData: TaskFormData): TaskFormData | null => {
      const validation = validateCreateTaskData(formData);

      if (!validation.isValid) {
        showValidationErrors(validation.errors);
        return null;
      }

      return validation.data || null;
    },
    [validateCreateTaskData, showValidationErrors]
  );

  return {
    validateTaskFormData,
    validateCreateTaskData,
    validateUpdateTaskData,
    validateField: validateFormField,
    validateTitle,
    createTitleSetter,
    showValidationErrors,
    prepareTaskData,
  };
}
