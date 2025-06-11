/**
 * Shared Types - Cleaned Legacy Exports
 *
 * Simplified imports from unified type system with legacy compatibility removed.
 */

// Import from unified type system
export type {
  ID,
  Timestamp,
  Status,
  AsyncState,
  LoadingState,
  FormState,
  ValidationRule,
  ValidationResult,
  BaseComponentProps,
  ApiResponse,
  ApiError,
  PaginatedResponse,
  PaginationMeta,
  BaseQueryParams,
  ServiceResult,
  ActionResult,
  DatabaseOperationResult,
  Size,
  Variant,
  ColorScheme,
  InputFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  AuthResponse,
  SignUpOptions,
  AuthContextType,
  AuthState,
  SignInCredentials,
  SignUpCredentials,
  NotificationType,
  Notification,
  NotificationAction,
  SelectOption,
  FilterOptions,
  ModalState,
} from '@/types';

// Simplified interfaces without legacy compatibility
export interface DragItem {
  id: string;
  type: string;
  data: unknown;
}

export interface DropTarget {
  id: string;
  accepts: string[];
  onDrop: (item: DragItem) => void;
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

export interface Metadata {
  version: string;
  lastModified: string;
  author?: string;
  tags?: string[];
}
