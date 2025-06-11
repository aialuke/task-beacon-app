import { useCallback } from 'react';

import { useUnifiedForm } from '@/hooks/core';
import { logger } from '@/lib/logger';
import type { TaskCreateData } from '@/types';
import type { FormErrors } from '@/types/form.types';

export interface UseTaskFormOptions {
  initialTitle?: string;
  initialDescription?: string;
  initialDueDate?: string | null;
  initialUrl?: string | null;
  initialAssigneeId?: string | null;
  onSubmit?: (values: TaskFormValues) => Promise<void> | void;
  onClose?: () => void;
}

export interface TaskFormValues extends Record<string, unknown> {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  assigneeId: string;
}

/**
 * Task form hook - Phase 2 Refactored
 *
 * Now uses unified form hook to eliminate duplicate form state patterns.
 * Maintains backward compatibility with existing interface.
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

  // Task form validation logic
  const validateTaskForm = useCallback(
    (values: TaskFormValues): FormErrors<TaskFormValues> => {
      const errors: FormErrors<TaskFormValues> = {};

      if (!values.title.trim()) {
        errors.title = 'Title is required';
      }

      if (values.url?.trim()) {
        try {
          new URL(values.url);
        } catch {
          errors.url = 'Please enter a valid URL';
        }
      }

      return errors;
    },
    []
  );

  // Unified form with task-specific configuration
  const form = useUnifiedForm<TaskFormValues>({
    initialValues: {
      title: initialTitle,
      description: initialDescription,
      dueDate: initialDueDate ?? '',
      url: initialUrl ?? '',
      assigneeId: initialAssigneeId ?? '',
    },
    validate: validateTaskForm,
    onSubmit: async values => {
      if (onSubmit) {
        const trimmedValues = {
          title: values.title.trim(),
          description: values.description.trim(),
          dueDate: values.dueDate || '',
          url: values.url.trim(),
          assigneeId: values.assigneeId || '',
        };
        await onSubmit(trimmedValues);
      }
    },
    onReset: onClose,
    validateOnBlur: true,
  });

  // Task-specific helper functions
  const getTaskData = useCallback((): TaskCreateData => {
    return {
      title: form.values.title.trim(),
      description: form.values.description.trim() || undefined,
      due_date: form.values.dueDate || undefined,
      photo_url: null,
      url_link: form.values.url.trim() || undefined,
      assignee_id: form.values.assigneeId || undefined,
    };
  }, [form.values]);

  // Enhanced validation that includes title requirement
  const isValid = form.isValid && form.values.title.trim().length > 0;

  // Backward compatibility interface
  return {
    // Current field values (backward compatibility)
    title: form.values.title,
    description: form.values.description,
    dueDate: form.values.dueDate,
    url: form.values.url,
    assigneeId: form.values.assigneeId,

    // Individual field setters (backward compatibility)
    setTitle: (value: string) => form.setFieldValue('title', value),
    setDescription: (value: string) => form.setFieldValue('description', value),
    setDueDate: (value: string) => form.setFieldValue('dueDate', value),
    setUrl: (value: string) => form.setFieldValue('url', value),
    setAssigneeId: (value: string) => form.setFieldValue('assigneeId', value),

    // Form state (backward compatibility)
    isValid,
    errors: form.errors,
    isSubmitting: form.isSubmitting,
    setIsSubmitting: (submitting: boolean) => {
      // Legacy compatibility - unified form handles this internally
      logger.warn(
        'setIsSubmitting is deprecated - form handles submission state automatically'
      );
    },

    // Form actions (backward compatibility)
    handleSubmit: form.handleSubmit,
    resetFormState: form.reset,
    validateForm: form.validateForm,
    getTaskData,
    setFieldValue: form.setFieldValue,

    // Computed values object (backward compatibility)
    values: form.values,
  };
}
