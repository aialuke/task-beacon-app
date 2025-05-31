
import { useCallback } from 'react';
import { toast } from '@/lib/toast';
import {
  validateTaskData,
  validateProfileData,
  ValidationResult,
} from '@/lib/validation/databaseValidation';

/**
 * Hook for client-side data validation before database operations
 */
export function useDataValidation() {
  const showValidationErrors = useCallback((result: ValidationResult) => {
    if (!result.isValid) {
      result.errors.forEach(error => toast.error(error));
    }
    
    if (result.warnings.length > 0) {
      result.warnings.forEach(warning => toast.warning(warning));
    }
  }, []);

  const validateTask = useCallback((taskData: {
    title: string;
    description?: string | null;
    url_link?: string | null;
    due_date?: string | null;
  }) => {
    const result = validateTaskData(taskData);
    showValidationErrors(result);
    return result;
  }, [showValidationErrors]);

  const validateProfile = useCallback((profileData: {
    email: string;
    name?: string | null;
  }) => {
    const result = validateProfileData(profileData);
    showValidationErrors(result);
    return result;
  }, [showValidationErrors]);

  return {
    validateTask,
    validateProfile,
    showValidationErrors,
  };
}
