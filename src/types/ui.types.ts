/**
 * UI Component Types
 * 
 * All UI component-related type definitions.
 */

// === COMMON UI TYPES ===
export type Size = 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export type ColorScheme = 'light' | 'dark' | 'auto';

// === BASE COMPONENT PROPS ===
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export interface LoadingProps {
  size?: Size;
  variant?: 'spinner' | 'skeleton' | 'dots';
  message?: string;
}

// === UTILITY UI TYPES ===
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

// === NOTIFICATION TYPES ===
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