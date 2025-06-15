
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

export function useTaskFormValidation() {
  const {
    validateTaskTitle,
    validateTaskDescription,
    validateUrl,
    validateField,
  } = useUnifiedValidation();

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

  const validateFormField = useCallback(
    async (
      fieldName: string,
      value: unknown
    ): Promise<{ isValid: boolean; error?: string }> => {
      const result = await validateField(fieldName, value);

      return {
        isValid: result.isValid,
        error: result.isValid ? undefined : result.errors[0],
      };
    },
    [validateField]
  );

  const validateTitle = useCallback(
    async (value: string): Promise<boolean> => {
      const result = await validateTaskTitle(value);
      return result.isValid;
    },
    [validateTaskTitle]
  );

  const createTitleSetter = useCallback((setTitle: (value: string) => void) => {
    return (value: string) => {
      if (value.length <= 22) {
        setTitle(value);
      }
    };
  }, []);

  const showValidationErrors = useCallback((errors: Record<string, string>) => {
    const errorEntries = Object.entries(errors);

    if (errorEntries.length === 0) return;

    const [firstField, firstError] = errorEntries[0];

    if (errorEntries.length === 1) {
      toast.error(`${firstField}: ${firstError}`);
    } else {
      toast.error(`Validation Failed: ${firstError}`, {
        description: `${errorEntries.length} validation errors found. Please check all fields.`,
      });
    }
  }, []);

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
