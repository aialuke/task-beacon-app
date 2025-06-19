import { useState, useCallback } from 'react';

import type { TaskFormInput } from '@/lib/validation/schemas';
import type { TaskFormInitialValues, TaskFormState } from '@/types';

/**
 * Hook for managing task form state
 * Focused on form data management only
 */
export function useTaskFormState(options: TaskFormInitialValues = {}): TaskFormState {
  const {
    initialTitle = '',
    initialDescription = '',
    initialDueDate = null,
    initialUrl = null,
    initialAssigneeId = null,
  } = options;

  // Form field state
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [dueDate, setDueDate] = useState(initialDueDate ?? '');
  const [url, setUrl] = useState(initialUrl ?? '');
  const [assigneeId, setAssigneeId] = useState(initialAssigneeId ?? '');

  // Generic field setter for dynamic updates
  const setFieldValue = useCallback((field: keyof TaskFormInput, value: unknown) => {
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
  }, []);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setDueDate(initialDueDate ?? '');
    setUrl(initialUrl ?? '');
    setAssigneeId(initialAssigneeId ?? '');
  }, [
    initialTitle,
    initialDescription,
    initialDueDate,
    initialUrl,
    initialAssigneeId,
  ]);

  // Get current form values
  const values = {
    title,
    description,
    dueDate,
    url,
    assigneeId,
  };

  return {
    // Field values
    title,
    description,
    dueDate,
    url,
    assigneeId,
    
    // Field setters
    setTitle,
    setDescription,
    setDueDate,
    setUrl,
    setAssigneeId,
    setFieldValue,
    
    // Form utilities
    values,
    resetForm,
  };
}