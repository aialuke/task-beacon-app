
/**
 * Entity validation orchestrators
 * 
 * These validators combine multiple validation rules to provide complete
 * validation for entities like user profiles.
 */
import {
  validateEmail,
  validateUserName,
} from './format-validators';
import { 
  BasicValidationResult,
  ValidationContext 
} from './types';
import { 
  combineValidationResults,
  createSuccessResult 
} from './error-handling';

/**
 * Comprehensive profile validation
 * 
 * Validates user profile data including email and name.
 * Combines results from multiple format validators.
 */
export const validateProfileData = (
  profileData: {
    email: string;
    name?: string | null;
  },
  context?: ValidationContext
): BasicValidationResult => {
  const ctx = { validator: 'validateProfileData', ...context };

  // Validate email (required)
  const results: BasicValidationResult[] = [
    validateEmail(profileData.email, { ...ctx, field: 'email' }),
  ];

  // Validate name only if provided
  if (profileData.name !== null && profileData.name !== undefined) {
    results.push(validateUserName(profileData.name, { ...ctx, field: 'name' }));
  }

  return combineValidationResults(results);
};
// CodeRabbit review
// CodeRabbit review
