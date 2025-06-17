
import { useCallback, useState } from 'react';

import { logger as _logger } from '@/lib/logger';
import type { TaskFormInput } from '@/lib/validation/schemas';
import type { TaskCreateData } from '@/types';

import { useTaskFormValidation } from './useTaskFormValidation';

// Local type definition for form errors
// Matches the previous FormErrors type
type FormErrors<T extends Record<string, unknown>> = {
  [K in keyof T]?: string;
};

interface UseTaskFormOptions {
  initialTitle?: string;
  initialDescription?: string;
  initialDueDate?: string | null;
  initialUrl?: string | null;
  initialAssigneeId?: string | null;
  onSubmit?: (values: TaskFormInput) => Promise<void> | void;
  onClose?: (() => void) | undefined;
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

  // Local state for each field
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [dueDate, setDueDate] = useState(initialDueDate ?? '');
  const [url, setUrl] = useState(initialUrl ?? '');
  const [assigneeId, setAssigneeId] = useState(initialAssigneeId ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors<TaskFormInput>>({});

  // Use Zod validation instead of manual validation
  const validation = useTaskFormValidation();

  // Replace validateForm usage with Zod validation
  const validateForm = useCallback(() => {
    const formData = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      url: url.trim(),
      assigneeId,
    };

    const result = validation.validateTaskFormData(formData);
    setErrors(result.errors);
    return result.isValid;
  }, [title, description, dueDate, url, assigneeId, validation]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!validateForm()) return;
      if (!onSubmit) return;
      setIsSubmitting(true);
      try {
        await onSubmit({
          title,
          description,
          dueDate,
          url,
          assigneeId: assigneeId || '',
        });
      } catch (error) {
        console.error('Submission failed:', error);
        // Even if submission fails, we resolve the promise as the error is handled internally.
        return Promise.resolve();
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, title, description, dueDate, url, assigneeId, validateForm]
  );

  const resetFormState = useCallback(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setDueDate(initialDueDate ?? '');
    setUrl(initialUrl ?? '');
    setAssigneeId(initialAssigneeId ?? '');
    setErrors({});
    if (onClose) onClose();
  }, [
    initialTitle,
    initialDescription,
    initialDueDate,
    initialUrl,
    initialAssigneeId,
    onClose,
  ]);

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

  const isValid = !Object.keys(errors).length && title.trim().length > 0;

  return {
    title,
    description,
    dueDate,
    url,
    assigneeId,
    setTitle,
    setDescription,
    setDueDate,
    setUrl,
    setAssigneeId,
    isValid,
    errors,
    isSubmitting,
    handleSubmit,
    resetFormState,
    validateForm,
    getTaskData,
    setFieldValue: (field: keyof TaskFormInput, value: unknown) => {
      switch (field) {
        case 'title':
          setTitle(value as string);
          break;
        case 'description':
          setDescription(value as string);
          break;
        case 'dueDate':
          setDueDate(value as string);
          break;
        case 'url':
          setUrl(value as string);
          break;
        case 'assigneeId':
          setAssigneeId(value as string);
          break;
        default:
          break;
      }
    },
    values: { title, description, dueDate, url, assigneeId },
  };
}
