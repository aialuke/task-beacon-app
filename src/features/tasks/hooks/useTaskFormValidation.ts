import { useCallback } from "react";
import { useValidation } from "@/hooks/useValidation";
import { createTaskSchema } from "@/features/tasks/schemas/taskSchema";
import { createTextSchema } from "@/schemas/commonValidation";

/**
 * Standardized task form validation hook
 * 
 * Provides consistent validation patterns for all task forms using Zod schemas
 */
export function useTaskFormValidation() {
  const { validateWithToast, validateField } = useValidation();

  /**
   * Validate complete task form data using the task schema
   */
  const validateTaskForm = useCallback((data: any) => {
    return validateWithToast(createTaskSchema, data);
  }, [validateWithToast]);

  /**
   * Validate title with character limit and toast feedback
   */
  const validateTitle = useCallback((value: string): boolean => {
    const titleSchema = createTextSchema(1, 22, true);
    const result = validateField(titleSchema, value, "title", { showToast: true });
    return result.isValid;
  }, [validateField]);

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
    createTitleSetter
  };
}
