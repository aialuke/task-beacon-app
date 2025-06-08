
import { useState, useCallback } from 'react';
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
  dueDate: string;
  url: string;
  assigneeId: string;
}

/**
 * Task form hook with validation and state management
 * 
 * Rewritten to use standard React hooks instead of complex unified form state
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

  // Form field states using standard useState
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [dueDate, setDueDate] = useState(initialDueDate ?? '');
  const [url, setUrl] = useState(initialUrl ?? '');
  const [assigneeId, setAssigneeId] = useState(initialAssigneeId ?? '');
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormValues, string>>>({});

  // Validation logic
  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof TaskFormValues, string>> = {};
    
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

  // Form submission handler
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        const values: TaskFormValues = {
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate || '',
          url: url.trim(),
          assigneeId: assigneeId || '',
        };
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, dueDate, url, assigneeId, onSubmit, validateForm]);

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

  // Reset form state
  const resetFormState = useCallback(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setDueDate(initialDueDate ?? '');
    setUrl(initialUrl ?? '');
    setAssigneeId(initialAssigneeId ?? '');
    setErrors({});
    setIsSubmitting(false);
    if (onClose) onClose();
  }, [initialTitle, initialDescription, initialDueDate, initialUrl, initialAssigneeId, onClose]);

  // Field value setters
  const setFieldValue = useCallback((field: keyof TaskFormValues, value: string) => {
    switch (field) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'dueDate':
        setDueDate(value);
        break;
      case 'url':
        setUrl(value);
        break;
      case 'assigneeId':
        setAssigneeId(value);
        break;
    }
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const isValid = Object.keys(errors).length === 0 && title.trim().length > 0;

  return {
    // Current field values
    title,
    description,
    dueDate,
    url,
    assigneeId,

    // Individual field setters
    setTitle: (value: string) => setFieldValue('title', value),
    setDescription: (value: string) => setFieldValue('description', value),
    setDueDate: (value: string) => setFieldValue('dueDate', value),
    setUrl: (value: string) => setFieldValue('url', value),
    setAssigneeId: (value: string) => setFieldValue('assigneeId', value),

    // Form state
    isValid,
    errors,
    isSubmitting,

    // Form actions
    handleSubmit,
    resetFormState,
    validateForm,
    getTaskData,
    setFieldValue,

    // Computed values object for compatibility
    values: {
      title,
      description,
      dueDate,
      url,
      assigneeId,
    },
  };
}
