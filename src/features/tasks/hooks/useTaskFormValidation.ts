import { useCallback } from 'react';
import { toast } from 'sonner';

import { taskFormSchema } from '@/lib/validation/schemas';
import type { TaskFormInput } from '@/lib/validation/schemas';

export function useTaskFormValidation() {
  const validateTaskFormData = useCallback(
    (
      data: unknown
    ): {
      isValid: boolean;
      errors: Record<string, string>;
      data?: TaskFormInput;
    } => {
      const result = taskFormSchema.safeParse(data);

      if (result.success) {
        return {
          isValid: true,
          errors: {},
          data: result.data as TaskFormInput,
        };
      }

      const errors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        if (path) {
          errors[path] = issue.message;
        }
      });

      return { isValid: false, errors };
    },
    []
  );

  const validateFormField = useCallback(
    async (
      fieldName: keyof TaskFormInput,
      value: unknown
    ): Promise<{ isValid: boolean; error?: string }> => {
      const fieldSchema = taskFormSchema.shape[fieldName];
      const result = await fieldSchema.safeParseAsync(value);

      return {
        isValid: result.success,
        error: result.success ? undefined : result.error.issues[0].message,
      };
    },
    []
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
    (formData: TaskFormInput): TaskFormInput | null => {
      const validation = validateTaskFormData(formData);

      if (!validation.isValid) {
        showValidationErrors(validation.errors);
        return null;
      }

      return validation.data || null;
    },
    [validateTaskFormData, showValidationErrors]
  );

  return {
    validateTaskFormData,
    validateField: validateFormField,
    createTitleSetter,
    showValidationErrors,
    prepareTaskData,
  };
}
