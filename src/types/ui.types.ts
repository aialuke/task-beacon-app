/**
 * UI Component Types
 *
 * All UI component-related type definitions.
 */

// === COMMON UI TYPES ===
type Size = 'sm' | 'md' | 'lg' | 'xl';
type Variant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost';
type ColorScheme = 'light' | 'dark' | 'auto';

// === BASE COMPONENT PROPS ===
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

interface ButtonProps extends BaseComponentProps {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

interface LoadingProps {
  size?: Size;
  variant?: 'spinner' | 'skeleton' | 'dots';
  message?: string;
}

// === UTILITY UI TYPES ===
interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface FilterOptions<T = string> {
  value: T;
  label: string;
  count?: number;
}

interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

// === NOTIFICATION TYPES ===
type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
}

interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
}
