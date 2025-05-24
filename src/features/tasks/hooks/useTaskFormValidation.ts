
import { useState, useCallback } from "react";
import { toast } from "@/lib/toast";

export interface TaskFormValidationOptions {
  maxTitleLength?: number;
}

/**
 * Base hook for task form validation
 * 
 * Provides common validation logic that can be reused across different task forms
 * 
 * @param options - Configuration options for validation
 * @returns Validation functions and state
 */
export function useTaskFormValidation({ maxTitleLength = 22 }: TaskFormValidationOptions = {}) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  /**
   * Validates the task title
   * @param value - The title value to validate
   * @returns True if valid, false otherwise
   */
  const validateTitle = useCallback((value: string): boolean => {
    if (!value.trim()) {
      const error = "Title is required";
      setValidationErrors(prev => ({ ...prev, title: error }));
      toast.error(error);
      return false;
    }
    
    if (value.length > maxTitleLength) {
      const error = `Task title cannot exceed ${maxTitleLength} characters`;
      setValidationErrors(prev => ({ ...prev, title: error }));
      toast.error(error);
      return false;
    }
    
    // Clear title error if validation passes
    setValidationErrors(prev => {
      const { title, ...rest } = prev;
      return rest;
    });
    
    return true;
  }, [maxTitleLength]);

  /**
   * Validates a URL format
   * @param value - The URL value to validate
   * @returns True if valid, false otherwise
   */
  const validateUrl = useCallback((value: string): boolean => {
    if (!value) return true; // URL is optional
    
    try {
      new URL(value);
      setValidationErrors(prev => {
        const { url, ...rest } = prev;
        return rest;
      });
      return true;
    } catch {
      const error = "Please enter a valid URL";
      setValidationErrors(prev => ({ ...prev, url: error }));
      toast.error(error);
      return false;
    }
  }, []);

  /**
   * Validates a date string
   * @param value - The date value to validate
   * @returns True if valid, false otherwise
   */
  const validateDate = useCallback((value: string): boolean => {
    if (!value) return true; // Date is optional
    
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      const error = "Please enter a valid date";
      setValidationErrors(prev => ({ ...prev, date: error }));
      toast.error(error);
      return false;
    }
    
    setValidationErrors(prev => {
      const { date, ...rest } = prev;
      return rest;
    });
    
    return true;
  }, []);

  /**
   * Validates all form fields
   * @param formData - The form data to validate
   * @returns True if all fields are valid, false otherwise
   */
  const validateForm = useCallback((formData: {
    title: string;
    url?: string;
    dueDate?: string;
  }): boolean => {
    const titleValid = validateTitle(formData.title);
    const urlValid = validateUrl(formData.url || "");
    const dateValid = validateDate(formData.dueDate || "");
    
    return titleValid && urlValid && dateValid;
  }, [validateTitle, validateUrl, validateDate]);

  /**
   * Clears all validation errors
   */
  const clearValidationErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  return {
    validationErrors,
    validateTitle,
    validateUrl,
    validateDate,
    validateForm,
    clearValidationErrors
  };
}
