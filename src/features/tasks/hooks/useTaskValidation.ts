
import { useCallback } from "react";
import { useValidation } from "@/hooks/useValidation";
import { createTextSchema } from "@/schemas/commonValidation";
import { createTaskSchema } from "@/features/tasks/schemas/taskSchema";

/**
 * Task-specific validation utilities
 */
export function useTaskValidation() {
  const { validate, validateField, validateWithToast } = useValidation();

  /**
   * Validates the task title
   */
  const validateTitle = useCallback((value: string): boolean => {
    const titleSchema = createTextSchema(1, 22, true);
    const result = validateField(titleSchema, value, "title", { showToast: true });
    return result.isValid;
  }, [validateField]);

  /**
   * Custom title setter with validation
   */
  const createTitleHandler = useCallback((setTitle: (value: string) => void) => {
    return (value: string) => {
      // Limit to 22 characters silently
      if (value.length <= 22) {
        setTitle(value);
      }
    };
  }, []);

  /**
   * Validate complete task form data
   */
  const validateTaskForm = useCallback((data: any) => {
    return validateWithToast(createTaskSchema, data);
  }, [validateWithToast]);

  /**
   * Validate URL field
   */
  const validateUrl = useCallback((value: string): boolean => {
    if (!value || value.length === 0) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Validate due date
   */
  const validateDueDate = useCallback((value: string): boolean => {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime()) && date > new Date(Date.now() - 24 * 60 * 60 * 1000);
  }, []);

  return {
    validateTitle,
    validateTaskForm,
    validateUrl,
    validateDueDate,
    createTitleHandler,
    // Expose validation utilities
    validate,
    validateField,
    validateWithToast,
  };
}
