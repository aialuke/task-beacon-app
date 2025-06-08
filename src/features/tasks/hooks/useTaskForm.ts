
import { useCallback } from 'react';
import { useUnifiedFormState } from '@/hooks/unified/useUnifiedFormState';
import type { TaskCreateData } from '@/types';

export interface UseTaskFormOptions {
  initialTitle?: string;
  initialDescription?: string;
  initialDueDate?: string | null;
  initialUrl?: string | null;
  initialAssigneeId?: string | null;
  onSubmit?: (values: TaskFormValues) => Promise<void> | void;
  onClose?: () => void;
}

export interface TaskFormValues extends Record<string, string> {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  assigneeId: string;
}

/**
 * Task form hook with validation and state management
 * 
 * This hook provides form state management and validation for task creation.
 * It uses the unified form state hook internally for consistent form behavior.
 */
export function useTaskForm(options: UseTaskFormOptions = {}) {
  const {
    initialTitle = '',
    initialDescription = '',
    initialDueDate = null,
    initialUrl = null,
    initialAssigneeId = null,
    onSubmit,
    onClose,
  } = options;

  // Create initial form state - ensure all values are strings
  const initialValues: TaskFormValues = {
    title: initialTitle,
    description: initialDescription,
    dueDate: initialDueDate ?? '',
    url: initialUrl ?? '',
    assigneeId: initialAssigneeId ?? '',
  };

  // Create validation rules - return string errors, not boolean
  const validationRules = useCallback(() => {
    return {
      title: (value: string) => {
        if (!value.trim()) return 'Title is required';
        return null;
      },
      url: (value: string) => {
        if (value?.trim()) {
          try {
            new URL(value);
            return null;
          } catch {
            return 'Please enter a valid URL';
          }
        }
        return null;
      },
    } as Record<keyof TaskFormValues, (value: string) => string | null>;
  }, []);

  // Use unified form state with proper destructuring
  const formState = useUnifiedFormState<TaskFormValues>({
    initialValues,
    validationRules: validationRules(),
    onSubmit: onSubmit as ((values: Record<string, string>) => Promise<void> | void) | undefined,
  });

  // Extract current field values for convenience
  const title = formState.values.title || '';
  const description = formState.values.description || '';
  const dueDate = formState.values.dueDate || '';
  const url = formState.values.url || '';
  const assigneeId = formState.values.assigneeId || '';

  // Convenience setters
  const setTitle = useCallback((value: string) => {
    formState.setFieldValue('title', value);
  }, [formState]);

  const setDescription = useCallback((value: string) => {
    formState.setFieldValue('description', value);
  }, [formState]);

  const setDueDate = useCallback((value: string) => {
    formState.setFieldValue('dueDate', value);
  }, [formState]);

  const setUrl = useCallback((value: string) => {
    formState.setFieldValue('url', value);
  }, [formState]);

  const setAssigneeId = useCallback((value: string) => {
    formState.setFieldValue('assigneeId', value);
  }, [formState]);

  // Create task data formatter
  const getTaskData = useCallback((): TaskCreateData => {
    return {
      title: title.trim(),
      description: description.trim() || undefined,
      due_date: dueDate || undefined,
      photo_url: null,
      url_link: url.trim() || undefined,
      assignee_id: assigneeId || undefined,
    };
  }, [title, description, dueDate, url, assigneeId]);

  // Manual validation trigger
  const validateForm = useCallback(() => {
    return formState.validateForm();
  }, [formState]);

  // Reset form state including calling onClose
  const resetFormState = useCallback(() => {
    formState.resetForm();
    if (onClose) onClose();
  }, [formState, onClose]);

  return {
    // Current field values
    title,
    description,
    dueDate,
    url,
    assigneeId,

    // Individual field setters
    setTitle,
    setDescription,
    setDueDate,
    setUrl,
    setAssigneeId,

    // Form state - maintain compatibility
    isValid: formState.isValid,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,

    // Form actions
    handleSubmit: formState.handleSubmit,
    resetFormState,
    validateForm,
    getTaskData,

    // Direct access to form state for advanced usage
    formState,
  };
}
// CodeRabbit review
// CodeRabbit review
