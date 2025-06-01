/**
 * Shared Types Barrel File
 * 
 * Centralized exports for all shared types organized by category.
 * This provides clean imports for commonly used types across the application.
 */

// Common utility types
export type {
  ID,
  Timestamp,
  OptionalExcept,
  RequiredExcept,
  Status,
  AsyncState,
  BaseEntity,
  FormState,
  LoadingState,
  AsyncOperationState,
  FilterOptions,
  SelectOption,
  ModalState,
  NotificationType,
  Notification,
  NotificationAction,
  ValidationRule,
  ValidationResult,
  Metadata,
  ResponseWrapper,
  EventHandler,
  AsyncEventHandler,
  BaseComponentProps,
} from './common.types';

// API response and error types
export type {
  ApiResponse,
  ApiError,
  PaginationOptions,
  PaginatedResponse,
  TablesResponse,
  BaseQueryParams,
  ActionResult,
  DatabaseOperationResult,
} from './api.types';

// Authentication and authorization types
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

// Database operation types
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

// UI component and styling types
export type {
  ColorScheme,
  Size,
  Variant,
  LayoutProps,
  ContainerProps,
  ComponentVariants,
  ButtonProps,
  InputProps,
  ModalProps,
  DialogAction,
  CardProps,
  NavItem,
  BreadcrumbItem,
  TableColumn,
  TableProps,
  FormFieldProps,
  ToastProps,
  AnimationProps,
  Breakpoint,
  ResponsiveValue,
  LoadingProps,
  SkeletonProps,
  DragItem,
  DropTarget,
} from './ui.types'; 