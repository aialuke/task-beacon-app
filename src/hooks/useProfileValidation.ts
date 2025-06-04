import { useCallback } from 'react';
import { validateForm } from '@/lib/utils/validation';
import { showValidationErrors } from './dataValidationUtils';

export function useProfileValidation() {
  const validateProfile = useCallback((profileData: {
    email: string;
    name?: string | null;
  }) => {
    const result = validateForm(profileData, {
      email: { required: true, email: true },
      name: { minLength: 2, maxLength: 50 },
    });
    
    return showValidationErrors({
      isValid: result.isValid,
      errors: Object.values(result.errors).flat(),
    });
  }, []);

  return { validateProfile };
}
