
import { useCallback } from "react";
import { useValidation } from "@/hooks/useValidation";
import { createTextSchema, urlSchema } from "@/schemas/commonValidation";

/**
 * Generic form validation utilities
 * 
 * For task-specific validation, use @/features/tasks/hooks/useTaskValidation
 */
export function useFormValidation() {
  const { validate, validateField, validateWithToast } = useValidation();

  /**
   * Generic text field validation
   */
  const validateText = useCallback((value: string, minLength = 1, maxLength = 1000): boolean => {
    const textSchema = createTextSchema(minLength, maxLength, true);
    const result = validateField(textSchema, value, "text", { showToast: true });
    return result.isValid;
  }, [validateField]);

  /**
   * Create a text handler with length limits
   */
  const createTextHandler = useCallback((setText: (value: string) => void, maxLength = 1000) => {
    return (value: string) => {
      if (value.length <= maxLength) {
        setText(value);
      }
    };
  }, []);

  /**
   * Validate URL field using schema
   */
  const validateUrl = useCallback((value: string): boolean => {
    const result = validateField(urlSchema, value, "url");
    return result.isValid;
  }, [validateField]);

  return {
    validateText,
    validateUrl,
    createTextHandler,
    // Expose validation utilities
    validate,
    validateField,
    validateWithToast,
  };
}
