
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

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string | null;
  url: string | null;
  assigneeId: string | null;
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

  // Create initial form state
  const initialValues: TaskFormValues = {
    title: initialTitle,
    description: initialDescription,
    dueDate: initialDueDate,
    url: initialUrl || '', // Convert null to empty string
    assigneeId: initialAssigneeId,
  };

  // Create validation schema - return string errors, not boolean
  const validationSchema = useCallback(() => {
    return {
      title: (value: string) => {
        if (!value?.trim()) return 'Title is required';
        return undefined;
      },
      url: (value: string) => {
        if (value && value.trim()) {
          try {
            new URL(value);
            return undefined;
          } catch {
            return 'Please enter a valid URL';
          }
        }
        return undefined;
      },
    };
  }, []);

  // Use unified form state - properly destructure the tuple
  const [formState, formActions] = useUnifiedFormState({
    initialValues,
    validationSchema: validationSchema(),
    onSubmit,
  });

  // Extract current field values for convenience
  const title = formState.fields.title.value;
  const description = formState.fields.description.value;
  const dueDate = formState.fields.dueDate.value;
  const url = formState.fields.url.value || ''; // Ensure url is never null
  const assigneeId = formState.fields.assigneeId.value;

  // Convenience setters
  const setTitle = useCallback((value: string) => {
    formActions.setFieldValue('title', value);
  }, [formActions]);

  const setDescription = useCallback((value: string) => {
    formActions.setFieldValue('description', value);
  }, [formActions]);

  const setDueDate = useCallback((value: string) => {
    formActions.setFieldValue('dueDate', value);
  }, [formActions]);

  const setUrl = useCallback((value: string) => {
    formActions.setFieldValue('url', value);
  }, [formActions]);

  const setAssigneeId = useCallback((value: string) => {
    formActions.setFieldValue('assigneeId', value);
  }, [formActions]);

  // Create task data formatter
  const getTaskData = useCallback((): TaskCreateData => {
    return {
      title: title.trim(),
      description: description.trim() || undefined,
      due_date: dueDate || undefined, // Use due_date for API
      photo_url: null,
      url_link: url.trim() || undefined,
      assignee_id: assigneeId || undefined,
    };
  }, [title, description, dueDate, url, assigneeId]);

  // Manual validation trigger
  const validateForm = useCallback(() => {
    return formActions.validateForm();
  }, [formActions]);

  // Reset form state including calling onClose
  const resetFormState = useCallback(() => {
    formActions.resetForm();
    if (onClose) onClose();
  }, [formActions, onClose]);

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
    errors: Object.fromEntries(
      Object.entries(formState.fields).map(([key, field]) => [key, field.error])
    ),
    isSubmitting: formState.isSubmitting,

    // Form actions
    handleSubmit: formActions.submitForm,
    resetFormState,
    validateForm,
    getTaskData,

    // Direct access to form state for advanced usage
    formState,
    formActions,
  };
}
