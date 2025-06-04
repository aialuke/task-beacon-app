/**
 * Shared Types Barrel File - Streamlined
 * 
 * Updated to import from the organized type system and reduce duplication.
 */

// Import common types from streamlined system
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
} from '../utility.types';

export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  PaginationMeta,
  BaseQueryParams,
  ServiceResult as ActionResult,
  ServiceResult as DatabaseOperationResult,
} from '../api.types';

// Import auth types (keeping these in shared as they're cross-cutting)
export type {
  User,
  Session,
  AuthResponse,
  SignUpOptions,
  UserRole,
  UserPermissions,
  AuthContextType,
  AuthState,
  SignInCredentials,
  SignUpCredentials,
  SessionRefreshResult,
  AuthOperationResult,
} from './auth.types';

// Import database types (keeping these in shared as they're foundational)
export type {
  DatabaseOperation,
  RealTimeEvent,
  TableRow,
  QueryFilter,
  QueryOptions,
  RealtimeSubscription,
  RealtimePayload,
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

// Import component types from streamlined system
export type {
  Size,
  Variant,
  ColorScheme,
  LayoutProps,
  ButtonProps,
  ModalProps,
  DialogAction,
  CardProps,
  NavItem,
  BreadcrumbItem,
  TableColumn,
  TableProps,
  LoadingProps,
  ToastProps,
  AnimationProps,
  Breakpoint,
  ResponsiveValue,
} from '../component.types';

// Legacy exports for backward compatibility
export type {
  BaseComponentProps as ContainerProps,
  BaseComponentProps as ComponentVariants,
  InputFieldProps as InputProps,
  BaseComponentProps as FormFieldProps,
  BaseComponentProps as SkeletonProps,
} from '../component.types';

// Notification types (keep here as they're app-wide)
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

// Utility types
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

// Drag and drop types
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
