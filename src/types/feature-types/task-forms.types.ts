import type { TaskFormInput } from '@/lib/validation/schemas';

/**
 * Task Form Type Definitions
 * 
 * Centralized types for all task form-related functionality including
 * form state, validation, submission, and component props.
 */

// Base form field state
export interface TaskFormFields {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  assigneeId: string;
}

// Form initialization options
export interface TaskFormInitialValues {
  initialTitle?: string;
  initialDescription?: string;
  initialDueDate?: string | null;
  initialUrl?: string | null;
  initialAssigneeId?: string | null;
}

// Form submission options
export interface TaskFormSubmissionOptions {
  onSubmit?: (values: TaskFormInput) => Promise<void> | void;
  onClose?: () => void;
}

// Complete form options (combines all aspects)
export interface TaskFormOptions extends TaskFormInitialValues, TaskFormSubmissionOptions {}

// Form state hook return type
export interface TaskFormState extends TaskFormFields {
  // Field setters
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setDueDate: (value: string) => void;
  setUrl: (value: string) => void;
  setAssigneeId: (value: string) => void;
  setFieldValue: (field: keyof TaskFormInput, value: unknown) => void;
  
  // Form utilities
  values: TaskFormFields;
  resetForm: () => void;
}

// Form validation state
export interface TaskFormValidationState {
  errors: Record<string, string>;
  isValid: boolean;
  validateForm: () => boolean;
}

// Form submission state
export interface TaskFormSubmissionState {
  isSubmitting: boolean;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleReset: () => void;
  getTaskData: () => any; // TaskCreateData from types
}

// Complete form hook return type
export interface TaskFormHookReturn extends 
  TaskFormState, 
  TaskFormValidationState, 
  TaskFormSubmissionState {
  resetFormState: () => void;
}

// Form component props
export interface TaskFormComponentProps extends TaskFormFields {
  // Form handlers
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setDueDate: (value: string) => void;
  setUrl: (value: string) => void;
  setAssigneeId: (value: string) => void;
  
  // Form submission
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  
  // Validation
  errors?: Record<string, string>;
  disabled?: boolean;
  
  // Presentation
  headerTitle: string;
  headerSubtitle: string;
  titleLabel?: string;
  descriptionLabel?: string;
  descriptionPlaceholder?: string;
}