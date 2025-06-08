
// === EXTERNAL LIBRARIES ===
import { useCallback } from 'react';

// === INTERNAL UTILITIES (unified validation system) ===
import { 
  validateEmail, 
  validateUserName,
  type ValidationResult 
} from '@/lib/validation';

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
    switch (field) {
      case 'name':
        return validateUserName(value);
      case 'email':
        return validateEmail(value);
      case 'avatar_url':
        // Avatar URL is optional, so it's always valid
        return { isValid: true, errors: [], warnings: [] };
      default:
        return { isValid: false, errors: ['Unknown field'], warnings: [] };
    }
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
      const nameResult = validateUserName(profileData.name);
      if (!nameResult.isValid && nameResult.errors.length > 0) {
        errors.name = nameResult.errors[0];
      }
    }
    
    if (profileData.email !== undefined) {
      const emailResult = validateEmail(profileData.email);
      if (!emailResult.isValid && emailResult.errors.length > 0) {
        errors.email = emailResult.errors[0];
      }
    }
    
    if (profileData.avatar_url !== undefined) {
      // Avatar URL validation is optional
      // Could add URL validation here if needed
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
  const validateEmailField = useCallback((email: string): ValidationResult => {
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
    validateEmail: validateEmailField,
    validateAvatarUrl,
  };
}
// CodeRabbit review
