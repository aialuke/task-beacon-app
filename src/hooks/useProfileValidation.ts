
// === EXTERNAL LIBRARIES ===
import { useCallback } from 'react';

// === INTERNAL UTILITIES (unified validation system) ===
import { 
  validateField, 
  validateForm, 
  type ValidationResult 
} from '@/lib/utils/validation';

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
    return validateField(field, value, { required: true });
  }, []);

  /**
   * Validate complete profile data
   */
  const validateProfile = useCallback((
    profileData: ProfileData
  ): ProfileValidationResult => {
    const errors: Record<string, string> = {};
    
    // Validate each field
    if (profileData.name !== undefined) {
      const nameResult = validateField('name', profileData.name, { required: true });
      if (!nameResult.isValid && nameResult.error) {
        errors.name = nameResult.error;
      }
    }
    
    if (profileData.email !== undefined) {
      const emailResult = validateField('email', profileData.email, { required: true, email: true });
      if (!emailResult.isValid && emailResult.error) {
        errors.email = emailResult.error;
      }
    }
    
    if (profileData.avatar_url !== undefined) {
      const urlResult = validateField('avatar_url', profileData.avatar_url);
      if (!urlResult.isValid && urlResult.error) {
        errors.avatar_url = urlResult.error;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      fieldErrors: {
        name: errors.name,
        email: errors.email,
        avatar_url: errors.avatar_url,
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
