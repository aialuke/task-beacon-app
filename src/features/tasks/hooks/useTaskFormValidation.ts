
import { useCallback } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  taskFormSchema,
  createTaskSchema,
  updateTaskSchema,
  taskTitleSchema,
  taskDescriptionSchema,
} from '@/features/tasks/schemas/taskSchema';

interface FormDataWithExtras {
  title: string;
  description?: string;
  dueDate?: string;
  url?: string;
  assigneeId?: string;
  priority?: string;
  photoUrl?: string;
  urlLink?: string;
  parentTaskId?: string;
}

/**
 * Enhanced task form validation hook - Phase 3
 * 
 * Improved integration with form submission flow and better error handling
 */
export function useTaskFormValidation() {
  /**
   * Validate complete task form data with enhanced error handling
   */
  const validateTaskForm = useCallback(
    (data: unknown): { isValid: boolean; errors: Record<string, string>; data?: unknown } => {
      const result = taskFormSchema.safeParse(data);
      
      if (result.success) {
        return { isValid: true, errors: {}, data: result.data };
      }
      
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.');
        errors[field] = err.message;
      });
      
      console.log('Form validation errors:', errors);
      return { isValid: false, errors };
    },
    []
  );

  /**
   * Validate data for creating a task with enhanced error reporting
   */
  const validateCreateTask = useCallback(
    (data: unknown): { isValid: boolean; errors: Record<string, string>; data?: any } => {
      const result = createTaskSchema.safeParse(data);
      
      if (result.success) {
        return { isValid: true, errors: {}, data: result.data };
      }
      
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.');
        errors[field] = err.message;
      });
      
      console.log('Create task validation errors:', errors);
      return { isValid: false, errors };
    },
    []
  );

  /**
   * Validate data for updating a task
   */
  const validateUpdateTask = useCallback(
    (data: unknown): { isValid: boolean; errors: Record<string, string>; data?: any } => {
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
   * Validate individual fields with enhanced error handling
   */
  const validateField = useCallback(
    (fieldName: string, value: unknown): { isValid: boolean; error?: string } => {
      let result: z.SafeParseReturnType<unknown, any>;
      
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
      
      if (!result.success) {
        console.log(`Field '${fieldName}' validation failed:`, result.error.errors[0]?.message);
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
    if (!result.success) {
      console.log('Title validation failed:', result.error.errors[0]?.message);
    }
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
   * Enhanced validation error display with better UX
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
    
    // Log all errors for debugging
    console.log('All validation errors:', errors);
  }, []);

  /**
   * Enhanced task data preparation with validation
   */
  const prepareTaskData = useCallback((formData: FormDataWithExtras): unknown => {
    console.log('Preparing task data:', formData);
    
    const validation = validateCreateTask(formData);
    
    if (!validation.isValid) {
      showValidationErrors(validation.errors);
      return null;
    }
    
    // Transform validated data to API format (camelCase)
    const validatedData = validation.data;
    const taskData = {
      title: validatedData.title?.trim(),
      description: validatedData.description?.trim() || undefined,
      dueDate: validatedData.dueDate || undefined,
      photoUrl: formData.photoUrl || undefined,
      urlLink: validatedData.url?.trim() || undefined,
      assigneeId: validatedData.assigneeId || undefined,
      parentTaskId: formData.parentTaskId || undefined,
      priority: validatedData.priority || 'medium',
    };
    
    console.log('Prepared task data for API:', taskData);
    return taskData;
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
// CodeRabbit review
