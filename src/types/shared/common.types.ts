/**
 * Common Types - Updated to use streamlined system
 * 
 * This file now imports from the organized type system to eliminate duplication.
 */

// Import basic utility types
import type { 
  ID, 
  Timestamp, 
  LoadingState, 
  FormState, 
  ValidationRule, 
  ValidationResult, 
  BaseComponentProps, 
  EventHandler, 
  AsyncEventHandler, 
  DeepPartial, 
  DeepRequired 
} from '../utility.types';

import type {
  ApiResponse,
  ApiError,
  ServiceResult,
  BaseQueryParams,
} from '../api.types';

// Legacy compatibility exports
export type { 
  ID,
  Timestamp,
  LoadingState as AsyncState,
  LoadingState,
  FormState,
  ValidationRule,
  ValidationResult,
  BaseComponentProps,
  EventHandler,
  AsyncEventHandler,
  DeepPartial as OptionalExcept,
  DeepRequired as RequiredExcept,
  ApiResponse,
  ApiError,
  ServiceResult as ActionResult,
  ServiceResult as DatabaseOperationResult,
  BaseQueryParams,
};

// Keep entity types here as they're foundational
export interface BaseEntity {
  id: ID;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Keep async operation state as it's commonly used
export interface AsyncOperationState extends LoadingState {
  error: string | null;
  success: boolean;
}

// Keep notification types as they're app-wide
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

// Keep utility interfaces that are app-specific
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface FilterOptions<T = string> {
  value: T;
  label: string;
  count?: number;
}

export interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

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
