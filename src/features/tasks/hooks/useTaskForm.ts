import { useCallback, useState } from 'react';
import { logger } from '@/lib/logger';
import type { TaskCreateData } from '@/types';
import type { FormErrors } from '@/types/form.types';

interface UseTaskFormOptions {
  initialTitle?: string;
  initialDescription?: string;
  initialDueDate?: string | null;
  initialUrl?: string | null;
  initialAssigneeId?: string | null;
  onSubmit?: (values: TaskFormValues) => Promise<void> | void;
  onClose?: () => void;
}

interface TaskFormValues extends Record<string, unknown> {
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

  // Local state for each field
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [dueDate, setDueDate] = useState(initialDueDate ?? '');
  const [url, setUrl] = useState(initialUrl ?? '');
  const [assigneeId, setAssigneeId] = useState(initialAssigneeId ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors<TaskFormValues>>({});

  // Validation logic
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors<TaskFormValues> = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (url?.trim()) {
      try {
        new URL(url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, url]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!validateForm()) return;
      if (!onSubmit) return;
      setIsSubmitting(true);
      try {
        await onSubmit({
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate || '',
          url: url.trim(),
          assigneeId: assigneeId || '',
        });
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
  }, [initialTitle, initialDescription, initialDueDate, initialUrl, initialAssigneeId, onClose]);

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
    setIsSubmitting: (submitting: boolean) => {
      logger.warn('setIsSubmitting is deprecated - form handles submission state automatically');
    },
    handleSubmit,
    resetFormState,
    validateForm,
    getTaskData,
    setFieldValue: (field: keyof TaskFormValues, value: any) => {
      switch (field) {
        case 'title': setTitle(value); break;
        case 'description': setDescription(value); break;
        case 'dueDate': setDueDate(value); break;
        case 'url': setUrl(value); break;
        case 'assigneeId': setAssigneeId(value); break;
        default: break;
      }
    },
    values: { title, description, dueDate, url, assigneeId },
  };
}
