import { useCallback } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  taskFormSchema,
  createTaskSchema,
  updateTaskSchema,
  taskTitleSchema,
  taskDescriptionSchema,
  getFieldError,
  type TaskFormInput,
  type CreateTaskInput,
  type UpdateTaskInput,
} from '@/features/tasks/schemas/taskSchema';

/**
 * Unified task form validation hook using Zod
 *
 * Single source of truth for all task validation logic
 * Provides consistent validation patterns across the application
 */
export function useTaskFormValidation() {
  /**
   * Validate complete task form data
   */
  const validateTaskForm = useCallback(
    (data: unknown): { isValid: boolean; errors: Record<string, string>; data?: TaskFormInput } => {
      const result = taskFormSchema.safeParse(data);
      
      if (result.success) {
        return { isValid: true, errors: {}, data: result.data };
      }
      
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.');
        errors[field] = err.message;
      });
      
      return { isValid: false, errors };
    },
    []
  );

  /**
   * Validate data for creating a task
   */
  const validateCreateTask = useCallback(
    (data: unknown): { isValid: boolean; errors: Record<string, string>; data?: CreateTaskInput } => {
      const result = createTaskSchema.safeParse(data);
      
      if (result.success) {
        return { isValid: true, errors: {}, data: result.data };
      }
      
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.');
        errors[field] = err.message;
      });
      
      return { isValid: false, errors };
    },
    []
  );

  /**
   * Validate data for updating a task
   */
  const validateUpdateTask = useCallback(
    (data: unknown): { isValid: boolean; errors: Record<string, string>; data?: UpdateTaskInput } => {
      const result = updateTaskSchema.safeParse(data);
      
      if (result.success) {
        return { isValid: true, errors: {}, data: result.data };
      }
      
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.');
        errors[field] = err.message;
      });
      
      return { isValid: false, errors };
    },
    []
  );

  /**
   * Validate individual fields
   */
  const validateField = useCallback(
    (fieldName: string, value: unknown): { isValid: boolean; error?: string } => {
      let result: z.SafeParseReturnType<any, any>;
      
      switch (fieldName) {
        case 'title':
          result = taskTitleSchema.safeParse(value);
          break;
        case 'description':
          result = taskDescriptionSchema.safeParse(value);
          break;
        default:
          // For other fields, use the form schema
          const fieldSchema = taskFormSchema.shape[fieldName as keyof typeof taskFormSchema.shape];
          if (fieldSchema) {
            result = fieldSchema.safeParse(value);
          } else {
            return { isValid: true };
          }
      }
      
      return {
        isValid: result.success,
        error: result.success ? undefined : result.error.errors[0]?.message,
      };
    },
    []
  );

  /**
   * Validate title with character limit
   */
  const validateTitle = useCallback((value: string): boolean => {
    const result = taskTitleSchema.safeParse(value);
    return result.success;
  }, []);

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
   * Show validation errors in toast notifications
   */
  const showValidationErrors = useCallback((errors: Record<string, string>) => {
    const errorMessages = Object.entries(errors)
      .map(([field, message]) => `${field}: ${message}`)
      .join('\n');
    
    if (errorMessages) {
      toast.error('Validation Failed', {
        description: errorMessages,
      });
    }
  }, []);

  /**
   * Validate and transform form data for API submission
   */
  const prepareTaskData = useCallback((formData: unknown): CreateTaskInput | null => {
    const validation = validateCreateTask(formData);
    
    if (!validation.isValid) {
      showValidationErrors(validation.errors);
      return null;
    }
    
    return validation.data!;
  }, [validateCreateTask, showValidationErrors]);

  return {
    // Validation functions
    validateTaskForm,
    validateCreateTask,
    validateUpdateTask,
    validateField,
    validateTitle,
    
    // Utility functions
    createTitleSetter,
    showValidationErrors,
    prepareTaskData,
    
    // Re-export schema types for convenience
    schemas: {
      taskFormSchema,
      createTaskSchema,
      updateTaskSchema,
    },
  };
}
