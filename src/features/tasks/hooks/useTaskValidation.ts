import { useTaskFormValidation } from './useTaskFormValidation';

/**
 * Task validation hook
 *
 * Provides task validation functions using the unified Zod-based validation
 * This is now a thin wrapper around useTaskFormValidation for backward compatibility
 * 
 * @deprecated Use useTaskFormValidation directly for new code
 */
export function useTaskValidation() {
  const validation = useTaskFormValidation();

  return {
    // Maintain backward compatibility
    validateTitle: validation.validateTitle,
    validateTaskForm: validation.validateTaskForm,
    validateField: validation.validateField,
    createTitleSetter: validation.createTitleSetter,
    
    // Expose new validation methods
    validateCreateTask: validation.validateCreateTask,
    validateUpdateTask: validation.validateUpdateTask,
    showValidationErrors: validation.showValidationErrors,
    prepareTaskData: validation.prepareTaskData,
  };
}
