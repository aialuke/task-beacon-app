import { useCallback } from 'react';
import { validateTaskData } from '@/lib/validation/databaseValidation';
import { showValidationErrors } from './dataValidationUtils';

export function useTaskValidation() {
  const validateTask = useCallback((taskData: {
    title: string;
    description?: string | null;
    url_link?: string | null;
    due_date?: string | null;
  }) => {
    const result = validateTaskData(taskData);
    return showValidationErrors(result);
  }, []);

  return { validateTask };
} 