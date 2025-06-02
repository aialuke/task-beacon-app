
/**
 * Common Types
 * 
 * Shared utility types used across the application for common patterns.
 * These types provide consistency for data structures, state management,
 * and component interfaces.
 */

// === Core Identifier Types ===
export type ID = string;
export type Timestamp = string; // ISO 8601 timestamp

// === Utility Object Types ===
export type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;

// === Status and State Types ===
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface LoadingState {
  isLoading: boolean;
  isSubmitting?: boolean;
  isValidating?: boolean;
}

export interface AsyncOperationState extends LoadingState {
  error: string | null;
  success: boolean;
}

// === API Response Types ===
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: {
    message: string;
    code?: string;
    name: string;
  } | null;
}

export interface ApiError {
  message: string;
  code?: string;
  name: string;
}

// === Base Entity Types ===
export interface BaseEntity {
  id: ID;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// === Form and Validation Types ===
export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// === UI Component Types ===
export interface FilterOptions<T = string> {
  value: T;
  label: string;
  count?: number;
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

// === Notification Types ===
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Timestamp;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
}

// === Metadata and Context Types ===
export interface Metadata {
  version: string;
  lastModified: Timestamp;
  author?: string;
  tags?: string[];
}

export interface ResponseWrapper<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

// === Event Handler Types ===
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// === Component Props Types ===
export interface BaseComponentProps {
  className?: string;
  id?: string;
  testId?: string;
}
