/**
 * User Feature Types
 * 
 * Feature-specific types for user components, hooks, and UI patterns.
 * These are separate from the core user domain types.
 */

// Component prop types (will be created as needed)
export interface UserListProps {
  className?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  onUserSelect?: (user: import('@/types').User) => void;
}

export interface UserCardProps {
  user: import('@/types').User;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  showActions?: boolean;
}

export interface UserProfileProps {
  userId: string;
  isEditable?: boolean;
  onUpdate?: (data: import('@/types').UserUpdateData) => void;
}

// Hook return types
export interface UseUserListReturn {
  users: import('@/types').User[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
  refetch: () => void;
}

export interface UseUserProfileReturn {
  user: import('@/types').User | null;
  loading: boolean;
  error: string | null;
  updateUser: (data: import('@/types').UserUpdateData) => Promise<void>;
  refreshUser: () => void;
}

// Context types
export interface UserUIContextType {
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  showInactiveUsers: boolean;
  setShowInactiveUsers: (show: boolean) => void;
  viewMode: 'list' | 'grid' | 'table';
  setViewMode: (mode: 'list' | 'grid' | 'table') => void;
}

// Form types specific to user features
export interface UserFormData {
  name: string;
  email: string;
  role: import('@/types').UserRole;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
}

export interface UserInviteFormData {
  email: string;
  role: import('@/types').UserRole;
  team_id?: string;
  message?: string;
  send_welcome_email: boolean;
} 