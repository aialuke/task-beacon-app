
/**
 * Main Types Index - Unified and Streamlined
 * 
 * Single source of truth for all type definitions across the application.
 * This consolidates all scattered type definitions into one organized system.
 */

// === AUTHENTICATION IMPORTS (must come first) ===
import type { User, Session } from '@supabase/supabase-js';

// === CORE ENTITIES (from database types) ===
export type {
  TaskWithRelations as Task,
  ProfileTable as User,
  TaskTable,
  ProfileTable,
  TaskWithRelations,
  ProfileWithRelations,
  TaskStatusEnum as TaskStatus,
  UserRoleEnum as UserRole,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
} from './database';

// === API LAYER (single source of truth) ===
export type {
  ApiResponse,
  ApiError,
  ServiceResult,
  PaginatedResponse,
  PaginationMeta,
  BaseQueryParams,
  ActionResult,
  DatabaseOperationResult,
} from './api.types';

// === FORMS & VALIDATION ===
export type {
  FormState,
  ValidationResult,
  FormSubmissionResult,
  InputFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  ValidationRule,
  FieldValidationState,
  FormSubmissionState,
  BaseFieldProps,
  FormConfig,
} from './form.types';

// === UI COMPONENTS ===
export type {
  BaseComponentProps,
  ButtonProps,
  ModalProps,
  CardProps,
  LoadingProps,
  Size,
  Variant,
  ColorScheme,
} from './component.types';

// === TASK FEATURES ===
export type {
  TaskFilter,
  TaskPriority,
  ParentTask,
  TaskCreateData,
  TaskUpdateData,
  TaskQueryOptions,
} from './feature-types';

// === USER FEATURES ===
export type {
  UserPreferences,
  NotificationPreferences,
  UserCreateData,
  UserUpdateData,
  UserQueryOptions,
} from './feature-types';

// === AUTHENTICATION (consolidated from shared) ===
export type { User as AuthUser, Session } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User;
  session: Session | null;
  emailConfirmed: boolean;
}

export interface SignUpOptions {
  data?: {
    full_name?: string;
    name?: string;
    [key: string]: unknown;
  };
  redirectTo?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  error: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  name?: string;
  confirmPassword?: string;
}

// === UTILITIES ===
export type {
  DeepPartial,
  DeepRequired,
  Merge,
  Override,
  PropsWithClassName,
  PropsWithChildren,
  AsyncState,
  LoadingState,
  ID,
  Timestamp,
  Status,
  EventHandler,
  AsyncEventHandler,
} from './utility.types';

// === NOTIFICATION TYPES (consolidated from shared) ===
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
}

// === COMMON UTILITY INTERFACES ===
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

// Convenience type aliases - unified definitions
export interface ApiState<T = unknown, E = string> {
  data: T | null;
  loading: boolean;
  error: E | null;
  success: boolean;
  lastFetch?: Date;
}
