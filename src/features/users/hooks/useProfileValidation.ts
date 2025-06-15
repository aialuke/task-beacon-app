import { useCallback } from 'react';
import { z } from 'zod';

import {
  validateProfileUpdate,
  profileUpdateSchema,
  type ProfileUpdateInput,
} from '@/lib/validation';

interface ProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  data?: ProfileUpdateInput;
}

/**
 * Profile validation hook - Phase 3 Update
 *
 * Migrated to use centralized Zod validation from Phase 1 implementation
 */
export function useProfileValidation() {
  /**
   * Validate complete profile data using centralized schema
   */
  const validateProfile = useCallback(
    (data: unknown): ProfileValidationResult => {
      const result = validateProfileUpdate(data);

      if (result.success) {
        return {
          isValid: true,
          errors: {},
          data: result.data,
        };
      }

      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
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
    (
      fieldName: keyof ProfileUpdateInput,
      value: unknown
    ): { isValid: boolean; error?: string } => {
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
   * Validate profile name
   */
  const validateName = useCallback((name: string): boolean => {
    const result = profileUpdateSchema.shape.name.safeParse(name);
    return result.success;
  }, []);

  /**
   * Validate profile email
   */
  const validateEmail = useCallback((email: string): boolean => {
    const result = profileUpdateSchema.shape.email.safeParse(email);
    return result.success;
  }, []);

  /**
   * Validate avatar URL
   */
  const validateAvatarUrl = useCallback((url: string): boolean => {
    const result = profileUpdateSchema.shape.avatar_url.safeParse(url);
    return result.success;
  }, []);

  return {
    validateProfile,
    validateProfileField,
    validateName,
    validateEmail,
    validateAvatarUrl,

    // Export schema for convenience
    schema: profileUpdateSchema,
  };
}

// Backward compatibility exports
const useProfileValidationHook = useProfileValidation;
