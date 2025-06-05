
// === EXTERNAL LIBRARIES ===
import { useCallback } from 'react';

// === INTERNAL UTILITIES (unified validation system) ===
import { 
  validateField, 
  validateForm, 
  type ValidationResult 
} from '@/lib/utils/validation';
import { validateUserProfile } from '@/lib/validation/entity-validators';

// === TYPES ===
interface ProfileData {
  name?: string;
  email?: string;
  avatar_url?: string;
}

interface ProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  fieldErrors: {
    name?: string;
    email?: string;
    avatar_url?: string;
  };
}

/**
 * Profile Validation Hook - Updated to use unified validation system
 * 
 * Now leverages the consolidated validation utilities and patterns.
 */
export function useProfileValidation() {
  /**
   * Validate individual profile field
   */
  const validateProfileField = useCallback((
    field: keyof ProfileData,
    value: string
  ): ValidationResult => {
    return validateField(field, value);
  }, []);

  /**
   * Validate complete profile data
   */
  const validateProfile = useCallback((
    profileData: ProfileData
  ): ProfileValidationResult => {
    // Use unified validation system
    const validationResult = validateUserProfile({
      name: profileData.name || '',
      email: profileData.email || '',
      avatar_url: profileData.avatar_url || '',
    });

    // Transform to expected format
    const fieldErrors: Record<string, string> = {};
    if (!validationResult.isValid && validationResult.errors) {
      Object.entries(validationResult.errors).forEach(([field, error]) => {
        if (error) {
          fieldErrors[field] = error;
        }
      });
    }

    return {
      isValid: validationResult.isValid,
      errors: fieldErrors,
      fieldErrors: {
        name: fieldErrors.name,
        email: fieldErrors.email,
        avatar_url: fieldErrors.avatar_url,
      },
    };
  }, []);

  /**
   * Validate profile name
   */
  const validateName = useCallback((name: string): ValidationResult => {
    return validateProfileField('name', name);
  }, [validateProfileField]);

  /**
   * Validate profile email
   */
  const validateEmail = useCallback((email: string): ValidationResult => {
    return validateProfileField('email', email);
  }, [validateProfileField]);

  /**
   * Validate avatar URL
   */
  const validateAvatarUrl = useCallback((url: string): ValidationResult => {
    return validateProfileField('avatar_url', url);
  }, [validateProfileField]);

  return {
    validateProfile,
    validateProfileField,
    validateName,
    validateEmail,
    validateAvatarUrl,
  };
}
