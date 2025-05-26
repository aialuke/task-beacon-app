
import { useCallback } from "react";
import { toast } from "@/lib/toast";

/**
 * Hook for form validation utilities
 */
export function useFormValidation() {
  /**
   * Validates the task title
   */
  const validateTitle = useCallback((value: string): boolean => {
    if (value.length > 22) {
      toast.error("Task title cannot exceed 22 characters");
      return false;
    }
    return true;
  }, []);

  /**
   * Custom title setter with validation
   */
  const createTitleHandler = useCallback((setTitle: (value: string) => void) => {
    return (value: string) => {
      // Limit to 22 characters
      if (value.length <= 22) {
        setTitle(value);
      }
    };
  }, []);

  return {
    validateTitle,
    createTitleHandler,
  };
}
