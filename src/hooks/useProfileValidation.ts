import { useCallback } from 'react';
import { validateProfileData } from '@/lib/validation';
import { showValidationErrors } from './dataValidationUtils';

export function useProfileValidation() {
  const validateProfile = useCallback((profileData: {
    email: string;
    name?: string | null;
  }) => {
    const result = validateProfileData(profileData);
    return showValidationErrors(result);
  }, []);

  return { validateProfile };
} 