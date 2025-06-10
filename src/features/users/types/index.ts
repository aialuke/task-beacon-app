/**
 * Users Feature Types Index - Phase 2 Consolidated
 * 
 * Centralized export of all user-related types for the feature.
 * Follows standardized naming conventions with Props suffix.
 */

// Import types for local use
import type { User, UserUpdateData } from '@/types';

// Re-export core user types from main types (shared across features)
export type {
  User,
  UserRole,
  UserCreateData,
  UserUpdateData,
  UserQueryOptions,
  UserPreferences,
  NotificationPreferences,
  ID as UserId,
} from '@/types';

// Standardized component props interfaces (with Props suffix)
export interface UserListProps {
  className?: string;
  onUserSelect?: (user: User) => void;
  showFilters?: boolean;
}

export interface UserCardProps {
  user: User;
  onClick?: (user: User) => void;
  className?: string;
}

export interface UserAutocompleteProps {
  value?: string;
  onChange: (userId: string) => void;
  placeholder?: string;
  className?: string;
}

// Hook return types (standardized naming)
export interface UseUsersQueryReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseUserProfileReturn {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: UserUpdateData) => void;
  isUpdating: boolean;
} 