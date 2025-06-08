
import { useState, useCallback } from 'react';

export interface UseTaskFormStateOptions {
  initialUrl?: string;
  onClose?: () => void;
}

/**
 * Basic task form state management
 * 
 * This is a focused hook that only handles form state.
 * It doesn't mix validation, API calls, or side effects.
 * 
 * @param options - Configuration options for form state
 * @returns Form state values and setters
 */
export function useTaskFormState({
  initialUrl = '',
  onClose,
}: UseTaskFormStateOptions = {}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [url, setUrl] = useState(initialUrl);
  const [assigneeId, setAssigneeId] = useState('');
  const [loading, setLoading] = useState(false);

  const resetFormState = useCallback(() => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setUrl(initialUrl);
    setAssigneeId('');
    if (onClose) onClose();
  }, [initialUrl, onClose]);

  return {
    // Form state
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    url,
    setUrl,
    assigneeId,
    setAssigneeId,

    // Loading state
    loading,
    setLoading,

    // Form actions
    resetFormState,
  };
}
// CodeRabbit review
