
import { createStandardResult, createErrorResult } from './result-creators';
import { ValidationContext, StandardValidationResult, ValidationErrorCode } from './types';
import { validateUserExists } from './database-validators';
import { withErrorHandling } from './async-wrapper';

/**
 * Validates task ownership and assignee relationships
 */
export async function validateTaskOwnership(
  ownerId: string,
  assigneeId?: string | null,
  context?: ValidationContext
): Promise<StandardValidationResult> {
  return withErrorHandling(async () => {
    // Validate owner exists
    const ownerValidation = await validateUserExists(ownerId, context);
    if (!ownerValidation.isValid) {
      return createErrorResult(
        ValidationErrorCode.NOT_FOUND,
        'Task owner not found',
        [
          {
            field: 'owner_id',
            code: ValidationErrorCode.NOT_FOUND,
            message: 'The specified task owner does not exist',
            severity: 'error' as const,
            value: ownerId,
          },
        ]
      );
    }

    // Validate assignee exists if provided
    if (assigneeId) {
      const assigneeValidation = await validateUserExists(assigneeId, context);
      if (!assigneeValidation.isValid) {
        return createErrorResult(
          ValidationErrorCode.NOT_FOUND,
          'Task assignee not found',
          [
            {
              field: 'assignee_id',
              code: ValidationErrorCode.NOT_FOUND,
              message: 'The specified task assignee does not exist',
              severity: 'error' as const,
              value: assigneeId,
            },
          ]
        );
      }
    }

    // All validations passed
    return createStandardResult(true, [], {
      validator: context?.validator || 'validateTaskOwnership',
    });
  }, context);
}
