/**
 * Shared Types Barrel File - Unified Imports
 * 
 * Updated to import from the unified type system and reduce duplication.
 * This file will be phased out as we complete the type consolidation.
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

// Legacy compatibility exports (will be removed in next phase)
export type {
  BaseComponentProps as ContainerProps,
  BaseComponentProps as ComponentVariants,
  BaseComponentProps as FormFieldProps,
  BaseComponentProps as SkeletonProps,
} from '@/types';

// Database types that remain here temporarily
export type {
  DatabaseOperation,
  TableRow,
  QueryFilter,
  QueryOptions,
  TransactionOptions,
  DatabaseConfig,
  ColumnDefinition,
  TableSchema,
  Migration,
  DatabaseHealth,
  AuditLog,
  DatabaseError,
  QueryMetrics,
  BackupConfig,
  BackupInfo,
} from './database.types';

// Drag and drop types (keep here temporarily as they're app-wide)
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
