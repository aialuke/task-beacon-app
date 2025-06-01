/**
 * Shared Common Types
 * 
 * Basic utility types, generic interfaces, and common patterns
 * used throughout the application.
 */

// Basic utility types
export type ID = string;
export type Timestamp = string;
export type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;

// Generic status types
export type Status = 'idle' | 'loading' | 'success' | 'error';
export type AsyncState = 'pending' | 'fulfilled' | 'rejected';

// Generic entity interface
export interface BaseEntity {
  id: ID;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Generic form state
export interface FormState<T = Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Generic loading state
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Generic async operation state
export interface AsyncOperationState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Generic filter interface
export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Generic select option
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  description?: string;
}

// Generic modal state
export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: any;
}

// Generic notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: ID;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

// Generic validation types
export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Generic metadata interface
export interface Metadata {
  [key: string]: string | number | boolean | null | undefined;
}

// Generic response wrapper
export interface ResponseWrapper<T> {
  data: T;
  meta?: Metadata;
  timestamp: Timestamp;
}

// Generic event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Generic component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
} 