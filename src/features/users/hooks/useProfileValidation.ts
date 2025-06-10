import { useCallback } from 'react';

import { 
  validateProfileCreate
} from '../../../lib/validation/validators';
import { validateUnifiedProfile } from '../../../lib/validation/unified-validation';
import { profileUpdateSchema, type ProfileUpdateInput } from '../../../lib/validation/schemas';

interface ProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  data?: ProfileUpdateInput;
}

/**
 * Profile validation hook - Optimized Implementation
 * 
 * Provides comprehensive profile validation using centralized Zod schemas.
 * Supports both full profile validation and individual field validation.
 */
export function useProfileValidation() {
  /**
   * Validate complete profile data using unified validation for enhanced validation
   */
  const validateProfile = useCallback(
    (data: unknown): ProfileValidationResult => {
      // Use unified validation for enhanced validation
      const unifiedResult = validateUnifiedProfile(data);
      
      if (unifiedResult.isValid) {
        return { 
          isValid: true, 
          errors: {}, 
          data: unifiedResult.data as ProfileUpdateInput
        };
      }
      
      return { 
        isValid: false, 
        errors: unifiedResult.fieldErrors || {}
      };
    },
    []
  );

  /**
   * Validate profile data for creation using centralized schema
   */
  const validateNewProfile = useCallback(
    (data: unknown): ProfileValidationResult => {
      const result = validateProfileCreate(data);
      
      if (result.success) {
        return { 
          isValid: true, 
          errors: {}, 
          data: result.data as ProfileUpdateInput
        };
      }
      
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.');
        errors[field] = err.message;
      });
      
      return { isValid: false, errors };
    },
    []
  );

  /**
   * Validate individual profile field
   */
  const validateProfileField = useCallback(
    (fieldName: keyof ProfileUpdateInput, value: unknown): { isValid: boolean; error?: string } => {
      const fieldSchema = profileUpdateSchema.shape[fieldName];
      if (!fieldSchema) {
        return { isValid: true };
      }
      
      const result = fieldSchema.safeParse(value);
      
      return {
        isValid: result.success,
        error: result.success ? undefined : result.error.errors[0]?.message,
      };
    },
    []
  );

  /**
   * Validate profile name with detailed result
   */
  const validateName = useCallback((name: string): { isValid: boolean; error?: string } => {
    return validateProfileField('name', name);
  }, [validateProfileField]);

  /**
   * Validate profile email with detailed result
   */
  const validateEmail = useCallback((email: string): { isValid: boolean; error?: string } => {
    return validateProfileField('email', email);
  }, [validateProfileField]);

  /**
   * Validate avatar URL with detailed result
   */
  const validateAvatarUrl = useCallback((url: string): { isValid: boolean; error?: string } => {
    return validateProfileField('avatar_url', url);
  }, [validateProfileField]);

  return {
    validateProfile,
    validateNewProfile,
    validateProfileField,
    validateName,
    validateEmail,
    validateAvatarUrl,
    
    // Export schema for convenience
    schema: profileUpdateSchema,
  };
}
