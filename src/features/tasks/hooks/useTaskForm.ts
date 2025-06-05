
// === EXTERNAL LIBRARIES ===
import { useCallback, useState } from 'react';

// === INTERNAL UTILITIES ===
import { useUnifiedFormState } from '@/hooks/unified/useUnifiedFormState';

// === HOOKS ===
import { useTaskFormValidation } from './useTaskFormValidation';

// === TYPES ===
import type { TaskCreateData } from '@/types';

interface UseTaskFormOptions {
  initialTitle?: string;
  initialDescription?: string;
  initialDueDate?: string | null;
  initialUrl?: string | null;
  initialAssigneeId?: string | null;
  initialPinned?: boolean;
  onSubmit?: (values: TaskFormValues) => Promise<void> | void;
  onClose?: () => void;
}

interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string | null;
  url: string | null;
  assigneeId: string | null;
  pinned: boolean;
}

/**
 * Unified Task Form Hook - Phase 3 Consolidation
 * 
 * Now uses the unified form state management system to reduce duplication
 * and provide consistent form handling patterns.
 */
export function useTaskForm(options: UseTaskFormOptions = {}) {
  const {
    initialTitle = '',
    initialDescription = '',
    initialDueDate = null,
    initialUrl = null,
    initialAssigneeId = null,
    initialPinned = false,
    onSubmit,
    onClose,
  } = options;

  const validation = useTaskFormValidation();
  
  // Add local loading state for compatibility
  const [loading, setLoading] = useState(false);

  // Create initial values
  const initialValues: TaskFormValues = {
    title: initialTitle,
    description: initialDescription,
    dueDate: initialDueDate,
    url: initialUrl,
    assigneeId: initialAssigneeId,
    pinned: initialPinned,
  };

  // Create validation schema - return string errors, not boolean
  const validationSchema = {
    title: (value: string) => {
      const result = validation.validateTitle(value);
      return result.isValid ? undefined : result.error;
    },
    description: (value: string) => {
      const result = validation.validateField('description', value);
      return result.isValid ? undefined : result.error;
    },
    url: (value: string | null) => {
      if (!value) return undefined;
      const result = validation.validateField('url', value);
      return result.isValid ? undefined : result.error;
    },
  };

  // Use unified form state
  const [formState, formActions] = useUnifiedFormState({
    initialValues,
    validationSchema,
    onSubmit,
    resetOnSubmit: false,
  });

  // Convenience getters for individual field values
  const title = formState.fields.title.value;
  const description = formState.fields.description.value;
  const dueDate = formState.fields.dueDate.value;
  const url = formState.fields.url.value;
  const assigneeId = formState.fields.assigneeId.value;
  const pinned = formState.fields.pinned.value;

  // Convenience setters
  const setTitle = useCallback((value: string) => {
    formActions.setFieldValue('title', value);
  }, [formActions]);

  const setDescription = useCallback((value: string) => {
    formActions.setFieldValue('description', value);
  }, [formActions]);

  const setDueDate = useCallback((value: string | null) => {
    formActions.setFieldValue('dueDate', value);
  }, [formActions]);

  const setUrl = useCallback((value: string | null) => {
    formActions.setFieldValue('url', value);
  }, [formActions]);

  const setAssigneeId = useCallback((value: string | null) => {
    formActions.setFieldValue('assigneeId', value);
  }, [formActions]);

  const setPinned = useCallback((value: boolean) => {
    formActions.setFieldValue('pinned', value);
  }, [formActions]);

  // Create task data formatter
  const getTaskData = useCallback((): TaskCreateData => {
    return {
      title: title.trim(),
      description: description.trim() || undefined,
      due_date: dueDate || null,
      url_link: url || null,
      assignee_id: assigneeId || null,
      priority: 'medium' as const,
    };
  }, [title, description, dueDate, url, assigneeId]);

  // Validate entire form using task-specific validation
  const validateTaskForm = useCallback(() => {
    return validation.validateTaskForm({
      title,
      description,
      dueDate,
      url,
      pinned,
      assigneeId,
      priority: 'medium',
    });
  }, [validation, title, description, dueDate, url, pinned, assigneeId]);

  // Reset form state including calling onClose
  const resetFormState = useCallback(() => {
    formActions.resetForm();
    setLoading(false);
    onClose?.();
  }, [formActions, onClose]);

  return {
    // Individual field values
    title,
    description,
    dueDate,
    url,
    assigneeId,
    pinned,

    // Individual field setters
    setTitle,
    setDescription,
    setDueDate,
    setUrl,
    setAssigneeId,
    setPinned,

    // Form state - maintain compatibility
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    isSubmitting: formState.isSubmitting,
    loading, // Local loading state for compatibility
    
    // Form actions - maintain compatibility
    validateForm: validateTaskForm,
    resetForm: formActions.resetForm,
    resetFormState, // Legacy compatibility
    submitForm: formActions.submitForm,
    setLoading, // Local loading setter for compatibility
    
    // Task-specific utilities
    getTaskData,
    
    // Field errors
    titleError: formState.fields.title.error,
    descriptionError: formState.fields.description.error,
    urlError: formState.fields.url.error,
    
    // Field touched states
    titleTouched: formState.fields.title.touched,
    descriptionTouched: formState.fields.description.touched,
    urlTouched: formState.fields.url.touched,

    // Validation utilities
    validateTitle: validation.validateTitle,
    validateField: validation.validateField,
    showValidationErrors: validation.showValidationErrors,
  };
}
